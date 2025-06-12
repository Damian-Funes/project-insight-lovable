
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projetos")
        .select(`
          *,
          registros_atividades (
            horas_gastas,
            area_id,
            areas_produtivas (
              custo_hora_padrao
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar projetos:", error);
        throw error;
      }

      // Calcular métricas para cada projeto
      const projectsWithMetrics = data.map((project) => {
        const activities = project.registros_atividades || [];
        const totalHours = activities.reduce((sum, activity) => sum + Number(activity.horas_gastas), 0);
        const totalCost = activities.reduce((sum, activity) => {
          const hourCost = activity.areas_produtivas?.custo_hora_padrao || 0;
          return sum + (Number(activity.horas_gastas) * Number(hourCost));
        }, 0);

        const progress = project.orcamento_total 
          ? Math.min((totalCost / Number(project.orcamento_total)) * 100, 100)
          : 0;

        return {
          ...project,
          totalHours,
          totalCost,
          progress: Math.round(progress),
          budget: Number(project.orcamento_total) || 0,
          spent: totalCost
        };
      });

      return projectsWithMetrics;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
