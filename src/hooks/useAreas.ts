
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      console.log("Buscando áreas produtivas...");
      
      const { data, error } = await supabase
        .from("areas_produtivas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar áreas:", error);
        throw error;
      }

      console.log("Áreas encontradas:", data);
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (areas mudam pouco)
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });
};
