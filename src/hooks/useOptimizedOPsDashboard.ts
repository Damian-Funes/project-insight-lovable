
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OptimizedOPFilters {
  projeto_id?: string;
  area_id?: string;
  status?: string;
  limit?: number;
}

export const useOptimizedOPsDashboard = (filters: OptimizedOPFilters = {}) => {
  return useQuery({
    queryKey: ["ops-dashboard-optimized", filters],
    queryFn: async () => {
      console.log("Buscando OPs otimizado...");

      let query = supabase
        .from("ordem_producao")
        .select(`
          id,
          numero_op,
          status_op,
          data_inicio_prevista,
          data_fim_prevista,
          data_inicio_real,
          data_fim_real,
          projetos!inner(nome_projeto),
          areas_produtivas!inner(nome_area, custo_hora_padrao)
        `);

      // Aplicar filtros
      if (filters.projeto_id && filters.projeto_id !== "all") {
        query = query.eq("projeto_id", filters.projeto_id);
      }

      if (filters.area_id && filters.area_id !== "all") {
        query = query.eq("area_responsavel_id", filters.area_id);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status_op", filters.status);
      }

      const { data: ops, error } = await query
        .order("created_at", { ascending: false })
        .limit(filters.limit || 50); // Limitar para melhor performance

      if (error) {
        console.error("Erro ao buscar OPs:", error);
        throw error;
      }

      // Calcular métricas simples no cliente (otimizado)
      const opsWithCalculations = (ops || []).map(op => {
        let tempo_execucao_dias = 0;
        let custo_total = 0;

        if (op.data_inicio_real && op.data_fim_real) {
          const inicio = new Date(op.data_inicio_real);
          const fim = new Date(op.data_fim_real);
          tempo_execucao_dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          ...op,
          tempo_execucao_dias,
          custo_total,
        };
      });

      console.log(`OPs carregadas: ${opsWithCalculations.length}`);
      return opsWithCalculations;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData, // Manter dados anteriores durante recarregamento
  });
};
