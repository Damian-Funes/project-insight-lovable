
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedProjects = () => {
  return useQuery({
    queryKey: ["projects-optimized"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projetos")
        .select(`
          id,
          nome_projeto,
          status_projeto,
          data_inicio,
          data_termino_prevista,
          orcamento_total
        `)
        .order("created_at", { ascending: false })
        .limit(100); // Limitar para melhor performance

      if (error) {
        console.error("Erro ao buscar projetos:", error);
        throw error;
      }

      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutos - projetos mudam pouco
    gcTime: 60 * 60 * 1000, // 1 hora no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
