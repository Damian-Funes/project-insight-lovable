
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OptimizedActivityFilters {
  limit?: number;
  offset?: number;
  projeto_id?: string;
  area_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface OptimizedActivity {
  id: string;
  data_registro: string;
  horas_gastas: number;
  descricao_atividade?: string;
  tipo_atividade?: string;
  projeto_id: string;
  area_id: string;
  responsavel_id: string;
  projetos: {
    nome_projeto: string;
  };
  areas_produtivas: {
    nome_area: string;
    custo_hora_padrao?: number;
  };
  profiles: {
    nome_completo: string;
  };
}

export const useOptimizedActivities = (filters: OptimizedActivityFilters = {}) => {
  return useQuery({
    queryKey: ["activities-optimized", filters],
    queryFn: async (): Promise<OptimizedActivity[]> => {
      console.log("Buscando atividades otimizado com filtros:", filters);
      
      try {
        let query = supabase
          .from("registros_atividades")
          .select(`
            id,
            data_registro,
            horas_gastas,
            descricao_atividade,
            tipo_atividade,
            projeto_id,
            area_id,
            responsavel_id,
            projetos!inner(nome_projeto),
            areas_produtivas!inner(nome_area, custo_hora_padrao),
            profiles!inner(nome_completo)
          `);

        // Aplicar filtros
        if (filters.projeto_id && filters.projeto_id !== "all") {
          query = query.eq("projeto_id", filters.projeto_id);
        }

        if (filters.area_id && filters.area_id !== "all") {
          query = query.eq("area_id", filters.area_id);
        }

        if (filters.data_inicio) {
          query = query.gte("data_registro", filters.data_inicio);
        }

        if (filters.data_fim) {
          query = query.lte("data_registro", filters.data_fim);
        }

        // Aplicar paginação
        const offset = filters.offset || 0;
        const limit = filters.limit || 25;

        const { data, error } = await query
          .order("data_registro", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error("Erro ao buscar atividades:", error);
          throw new Error(`Falha ao carregar atividades: ${error.message}`);
        }

        console.log(`Atividades carregadas: ${data?.length || 0}`);
        return (data || []) as OptimizedActivity[];
      } catch (error) {
        console.error("Erro na query atividades otimizada:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
