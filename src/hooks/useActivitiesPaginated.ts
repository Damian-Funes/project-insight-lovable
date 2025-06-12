
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

interface UseActivitiesOptions {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  searchTerm?: string;
}

export const useActivitiesPaginated = (options: UseActivitiesOptions = {}) => {
  const {
    page = 1,
    pageSize = 15,
    dateFrom,
    dateTo,
    projectId,
    searchTerm
  } = options;

  // Memoizar queryKey para evitar re-renders desnecessários
  const queryKey = useMemo(
    () => ["activities-paginated", page, pageSize, dateFrom, dateTo, projectId, searchTerm],
    [page, pageSize, dateFrom, dateTo, projectId, searchTerm]
  );

  // Memoizar data padrão para melhor performance
  const defaultDateFrom = useMemo(() => {
    if (dateFrom) return dateFrom;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sevenDaysAgo.toISOString().split('T')[0];
  }, [dateFrom]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log("Buscando atividades paginadas...", options);
      
      let query = supabase
        .from("registros_atividades")
        .select(`
          id,
          data_registro,
          horas_gastas,
          descricao_atividade,
          tipo_atividade,
          projetos!inner (
            nome_projeto
          ),
          areas_produtivas!inner (
            nome_area
          )
        `, { count: 'exact' });

      // Aplicar filtros com defaults otimizados
      query = query.gte("data_registro", defaultDateFrom);
      
      if (dateTo) {
        query = query.lte("data_registro", dateTo);
      }
      if (projectId) {
        query = query.eq("projeto_id", projectId);
      }
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.ilike("descricao_atividade", `%${searchTerm}%`);
      }

      // Aplicar paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order("data_registro", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar atividades:", error);
        throw error;
      }

      console.log(`Atividades encontradas: ${data?.length || 0} de ${count || 0} total`);
      
      return {
        activities: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos para atividades (dados mais dinâmicos)
    gcTime: 5 * 60 * 1000, // 5 minutos no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Usar cache anterior enquanto busca novos dados
    placeholderData: (previousData) => previousData,
  });
};
