
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OptimizedAreaFilters {
  limit?: number;
  offset?: number;
}

export interface OptimizedArea {
  id: string;
  nome_area: string;
  descricao_area?: string;
  custo_hora_padrao?: number;
}

export const useOptimizedAreas = (filters: OptimizedAreaFilters = {}) => {
  return useQuery({
    queryKey: ["areas-optimized", filters],
    queryFn: async (): Promise<OptimizedArea[]> => {
      console.log("Buscando áreas otimizado com filtros:", filters);
      
      try {
        let query = supabase
          .from("areas_produtivas")
          .select(`
            id,
            nome_area,
            descricao_area,
            custo_hora_padrao
          `);

        // Aplicar paginação
        const offset = filters.offset || 0;
        const limit = filters.limit || 30;

        const { data, error } = await query
          .order("nome_area", { ascending: true })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error("Erro ao buscar áreas:", error);
          throw new Error(`Falha ao carregar áreas produtivas: ${error.message}`);
        }

        console.log(`Áreas carregadas: ${data?.length || 0}`);
        return (data || []) as OptimizedArea[];
      } catch (error) {
        console.error("Erro na query áreas otimizada:", error);
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutos - áreas mudam muito pouco
    gcTime: 2 * 60 * 60 * 1000, // 2 horas no cache
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
