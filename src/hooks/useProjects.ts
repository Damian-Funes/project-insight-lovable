
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log("Buscando projetos com métricas...");
      
      try {
        const { data, error } = await supabase
          .from("projetos")
          .select(`
            id,
            nome_projeto,
            descricao_projeto,
            status_projeto,
            data_inicio,
            data_termino_prevista,
            orcamento_total,
            created_at,
            registros_atividades (
              horas_gastas,
              area_id,
              areas_produtivas (
                custo_hora_padrao
              )
            )
          `)
          .order("created_at", { ascending: false })
          .limit(50); // Limitar para melhor performance

        if (error) {
          console.error("Erro ao buscar projetos:", error);
          throw new Error(`Falha ao carregar projetos: ${error.message}`);
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

        console.log(`Projetos com métricas carregados: ${projectsWithMetrics.length}`);
        return projectsWithMetrics;
      } catch (error) {
        console.error("Erro na query projetos:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
