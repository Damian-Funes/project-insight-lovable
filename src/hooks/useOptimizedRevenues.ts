
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OptimizedRevenueFilters {
  limit?: number;
  offset?: number;
  projeto_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface OptimizedRevenue {
  id: string;
  valor_receita: number;
  data_receita: string;
  descricao_receita?: string;
  tipo_receita?: string;
  projeto_id: string;
  projetos: {
    nome_projeto: string;
  };
}

export const useOptimizedRevenues = (filters: OptimizedRevenueFilters = {}) => {
  return useQuery({
    queryKey: ["revenues-optimized", filters],
    queryFn: async (): Promise<OptimizedRevenue[]> => {
      console.log("Buscando receitas otimizado com filtros:", filters);
      
      try {
        let query = supabase
          .from("receitas")
          .select(`
            id,
            valor_receita,
            data_receita,
            descricao_receita,
            tipo_receita,
            projeto_id,
            projetos!inner(nome_projeto)
          `);

        // Aplicar filtros
        if (filters.projeto_id && filters.projeto_id !== "all") {
          query = query.eq("projeto_id", filters.projeto_id);
        }

        if (filters.data_inicio) {
          query = query.gte("data_receita", filters.data_inicio);
        }

        if (filters.data_fim) {
          query = query.lte("data_receita", filters.data_fim);
        }

        // Aplicar paginação
        const offset = filters.offset || 0;
        const limit = filters.limit || 25;

        const { data, error } = await query
          .order("data_receita", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error("Erro ao buscar receitas:", error);
          throw new Error(`Falha ao carregar receitas: ${error.message}`);
        }

        console.log(`Receitas carregadas: ${data?.length || 0}`);
        return (data || []) as OptimizedRevenue[];
      } catch (error) {
        console.error("Erro na query receitas otimizada:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
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
