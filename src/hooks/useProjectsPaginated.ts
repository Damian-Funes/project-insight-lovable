
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
    pageSize = 10,
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
      if (status && status !== '') {
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
        throw error;
      }

      console.log(`Projetos encontrados: ${data?.length || 0} de ${count || 0} total`);
      
      return {
        projects: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos para projetos (dados menos dinâmicos)
    gcTime: 10 * 60 * 1000, // 10 minutos no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Evitar refetch automático
    // Usar cache anterior enquanto busca novos dados
    placeholderData: (previousData) => previousData,
  });
};
