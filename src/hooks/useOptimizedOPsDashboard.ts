
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OptimizedOPFilters {
  projeto_id?: string;
  area_id?: string;
  status?: string;
  data_inicio_de?: string;
  data_inicio_ate?: string;
  limit?: number;
  offset?: number;
}

export interface OptimizedOPWithDetails {
  id: string;
  numero_op: string;
  descricao_op: string;
  status_op: string;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  projeto_id: string;
  area_responsavel_id: string;
  projetos: {
    nome_projeto: string;
  };
  areas_produtivas: {
    nome_area: string;
    custo_hora_padrao?: number;
  };
  tempo_execucao_dias?: number;
  custo_total?: number;
}

export const useOptimizedOPsDashboard = (filters: OptimizedOPFilters = {}) => {
  return useQuery({
    queryKey: ["ops-dashboard-optimized", filters],
    queryFn: async (): Promise<OptimizedOPWithDetails[]> => {
      console.log("Buscando OPs otimizado com filtros:", filters);

      try {
        let query = supabase
          .from("ordem_producao")
          .select(`
            id,
            numero_op,
            descricao_op,
            status_op,
            data_inicio_prevista,
            data_fim_prevista,
            data_inicio_real,
            data_fim_real,
            projeto_id,
            area_responsavel_id,
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

        if (filters.data_inicio_de) {
          query = query.gte("data_inicio_prevista", filters.data_inicio_de);
        }

        if (filters.data_inicio_ate) {
          query = query.lte("data_inicio_prevista", filters.data_inicio_ate);
        }

        // Aplicar paginação
        const offset = filters.offset || 0;
        const limit = filters.limit || 30;
        
        const { data: ops, error } = await query
          .order("data_inicio_prevista", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error("Erro ao buscar OPs:", error);
          throw new Error(`Falha ao carregar ordens de produção: ${error.message}`);
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
          } as OptimizedOPWithDetails;
        });

        console.log(`OPs carregadas: ${opsWithCalculations.length}`);
        return opsWithCalculations;
      } catch (error) {
        console.error("Erro na query OPs dashboard:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      // Retry até 2 vezes, mas não para erros 4xx
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (previousData) => previousData,
  });
};
