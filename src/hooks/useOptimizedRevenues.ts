
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedRevenues = () => {
  return useQuery({
    queryKey: ["revenues-optimized"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receitas")
        .select(`
          id,
          data_receita,
          valor_receita,
          tipo_receita,
          descricao_receita,
          projetos!inner (
            nome_projeto
          )
        `)
        .order("data_receita", { ascending: false })
        .limit(100); // Limitar resultados para melhor performance

      if (error) {
        console.error("Erro ao buscar receitas:", error);
        throw error;
      }

      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - dados financeiros mudam menos
    gcTime: 30 * 60 * 1000, // 30 minutos no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
