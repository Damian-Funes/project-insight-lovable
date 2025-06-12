
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseActivitiesOptions {
  limit?: number;
  projeto_id?: string;
  area_id?: string;
}

export const useActivities = (options: UseActivitiesOptions = {}) => {
  const { limit = 30, projeto_id, area_id } = options;

  return useQuery({
    queryKey: ["activities", options],
    queryFn: async () => {
      console.log("Buscando atividades com opções:", options);
      
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
            ordem_producao_id,
            created_at,
            projetos (
              nome_projeto
            ),
            areas_produtivas (
              nome_area
            ),
            ordem_producao (
              numero_op
            )
          `);

        // Aplicar filtros se fornecidos
        if (projeto_id && projeto_id !== "all") {
          query = query.eq("projeto_id", projeto_id);
        }

        if (area_id && area_id !== "all") {
          query = query.eq("area_id", area_id);
        }

        const { data, error } = await query
          .order("data_registro", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Erro ao buscar atividades:", error);
          throw new Error(`Falha ao carregar atividades: ${error.message}`);
        }

        console.log(`Atividades encontradas: ${data?.length || 0}`);
        return data || [];
      } catch (error) {
        console.error("Erro na query atividades:", error);
        throw error;
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
