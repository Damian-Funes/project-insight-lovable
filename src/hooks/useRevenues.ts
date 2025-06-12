
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RevenueFilters {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export const useRevenues = (filters?: RevenueFilters) => {
  return useQuery({
    queryKey: ["revenues", filters],
    queryFn: async () => {
      console.log("Buscando receitas com filtros:", filters);
      
      let query = supabase
        .from("receitas")
        .select(`
          *,
          projetos (
            nome_projeto
          )
        `)
        .order("data_receita", { ascending: false });

      // Aplicar filtros de data
      if (filters?.startDate) {
        query = query.gte('data_receita', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte('data_receita', filters.endDate.toISOString().split('T')[0]);
      }

      // Aplicar filtro de projeto
      if (filters?.projectId && filters.projectId !== 'all') {
        query = query.eq('projeto_id', filters.projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar receitas:", error);
        throw error;
      }

      console.log("Receitas encontradas:", data);
      return data;
    },
  });
};
