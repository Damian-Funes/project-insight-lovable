
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedAreas = () => {
  return useQuery({
    queryKey: ["areas-optimized"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("areas_produtivas")
        .select(`
          id,
          nome_area,
          custo_hora_padrao,
          descricao_area
        `)
        .order("nome_area", { ascending: true });

      if (error) {
        console.error("Erro ao buscar áreas:", error);
        throw error;
      }

      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutos - áreas raramente mudam
    gcTime: 2 * 60 * 60 * 1000, // 2 horas no cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
