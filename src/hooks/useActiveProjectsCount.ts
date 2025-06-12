
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

      // Buscar projetos que têm atividades registradas para esta área e estão ativos
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
        throw error;
      }

      // Contar projetos únicos
      const uniqueProjects = new Set(data.map(project => project.id));
      const activeProjectsCount = uniqueProjects.size;

      console.log("Projetos ativos encontrados:", activeProjectsCount);
      return activeProjectsCount;
    },
    enabled: !!areaId && areaId !== "all",
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
