
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRevenues = () => {
  return useQuery({
    queryKey: ["revenues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receitas")
        .select(`
          *,
          projetos (
            nome_projeto
          )
        `)
        .order("data_receita", { ascending: false });

      if (error) {
        console.error("Erro ao buscar receitas:", error);
        throw error;
      }

      return data;
    },
  });
};
