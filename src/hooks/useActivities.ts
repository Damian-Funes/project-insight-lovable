
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      console.log("Buscando atividades...");
      
      const { data, error } = await supabase
        .from("registros_atividades")
        .select(`
          *,
          projetos (
            nome_projeto
          ),
          areas_produtivas (
            nome_area
          )
        `)
        .order("data_registro", { ascending: false });

      if (error) {
        console.error("Erro ao buscar atividades:", error);
        throw error;
      }

      console.log("Atividades encontradas:", data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};
