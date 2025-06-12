
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useActiveProjectsCount = (areaId: string) => {
  return useQuery({
    queryKey: ["active-projects-count", areaId],
    queryFn: async (): Promise<number> => {
      console.log("Buscando quantidade de projetos ativos para área:", areaId);
      
      if (!areaId || areaId === "all") {
        return 0;
      }

      try {
        // Query otimizada: buscar apenas IDs únicos dos projetos
        const { data, error } = await supabase
          .from("projetos")
          .select(`
            id,
            registros_atividades!inner (
              area_id
            )
          `)
          .eq("status_projeto", "Ativo")
          .eq("registros_atividades.area_id", areaId);

        if (error) {
          console.error("Erro ao buscar projetos ativos:", error);
          throw new Error(`Falha ao contar projetos ativos: ${error.message}`);
        }

        // Contar projetos únicos
        const uniqueProjects = new Set(data.map(project => project.id));
        const activeProjectsCount = uniqueProjects.size;

        console.log("Projetos ativos encontrados:", activeProjectsCount);
        return activeProjectsCount;
      } catch (error) {
        console.error("Erro na query projetos ativos:", error);
        throw error;
      }
    },
    enabled: !!areaId && areaId !== "all",
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
