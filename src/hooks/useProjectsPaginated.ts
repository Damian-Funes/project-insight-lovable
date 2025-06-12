
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

interface UseProjectsOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  searchTerm?: string;
}

export const useProjectsPaginated = (options: UseProjectsOptions = {}) => {
  const {
    page = 1,
    pageSize = 20, // Reduzido para melhor performance
    status,
    searchTerm
  } = options;

  // Memoizar queryKey para evitar re-renders desnecessários
  const queryKey = useMemo(
    () => ["projects-paginated", page, pageSize, status, searchTerm],
    [page, pageSize, status, searchTerm]
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log("Buscando projetos paginados...", options);
      
      try {
        let query = supabase
          .from("projetos")
          .select(`
            id,
            nome_projeto,
            descricao_projeto,
            status_projeto,
            data_inicio,
            data_termino_prevista,
            orcamento_total,
            created_at
          `, { count: 'exact' });

        // Aplicar filtros
        if (status && status !== '' && status !== 'all') {
          query = query.eq("status_projeto", status);
        }
        if (searchTerm && searchTerm.trim() !== '') {
          query = query.ilike("nome_projeto", `%${searchTerm}%`);
        }

        // Aplicar paginação
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error, count } = await query
          .range(from, to)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar projetos:", error);
          throw new Error(`Falha ao carregar projetos: ${error.message}`);
        }

        console.log(`Projetos encontrados: ${data?.length || 0} de ${count || 0} total`);
        
        return {
          projects: data || [],
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page
        };
      } catch (error) {
        console.error("Erro na query projetos paginados:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos para projetos (dados menos dinâmicos)
    gcTime: 30 * 60 * 1000, // 30 minutos no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Usar cache anterior enquanto busca novos dados
    placeholderData: (previousData) => previousData,
  });
};
