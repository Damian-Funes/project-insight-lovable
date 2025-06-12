
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OptimizedProjectFilters {
  limit?: number;
  offset?: number;
  status?: string;
}

export const useOptimizedProjects = (filters: OptimizedProjectFilters = {}) => {
  return useQuery({
    queryKey: ["projects-optimized", filters],
    queryFn: async () => {
      console.log("Buscando projetos otimizado com filtros:", filters);
      
      try {
        let query = supabase
          .from("projetos")
          .select(`
            id,
            nome_projeto,
            status_projeto,
            data_inicio,
            data_termino_prevista,
            orcamento_total
          `);

        // Aplicar filtro de status se fornecido
        if (filters.status && filters.status !== "all") {
          query = query.eq("status_projeto", filters.status);
        }

        // Aplicar paginação
        const offset = filters.offset || 0;
        const limit = filters.limit || 50;

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error("Erro ao buscar projetos:", error);
          throw new Error(`Falha ao carregar projetos: ${error.message}`);
        }

        console.log(`Projetos carregados: ${data?.length || 0}`);
        return data || [];
      } catch (error) {
        console.error("Erro na query projetos otimizada:", error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutos - projetos mudam pouco
    gcTime: 60 * 60 * 1000, // 1 hora no cache
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
