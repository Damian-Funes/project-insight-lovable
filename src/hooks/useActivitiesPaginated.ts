
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    pageSize = 20,
    dateFrom,
    dateTo,
    projectId,
    searchTerm
  } = options;

  return useQuery({
    queryKey: ["activities-paginated", page, pageSize, dateFrom, dateTo, projectId, searchTerm],
    queryFn: async () => {
      console.log("Buscando atividades paginadas...", options);
      
      let query = supabase
        .from("registros_atividades")
        .select(`
          *,
          projetos (
            nome_projeto
          ),
          areas_produtivas (
            nome_area
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (dateFrom) {
        query = query.gte("data_registro", dateFrom);
      }
      if (dateTo) {
        query = query.lte("data_registro", dateTo);
      }
      if (projectId) {
        query = query.eq("projeto_id", projectId);
      }
      if (searchTerm) {
        query = query.or(`descricao_atividade.ilike.%${searchTerm}%,projetos.nome_projeto.ilike.%${searchTerm}%`);
      }

      // Aplicar paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order("data_registro", { ascending: false });

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
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
