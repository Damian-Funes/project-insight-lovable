
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectProgress {
  id: string;
  nome_projeto: string;
  status_projeto: string;
  orcamento_total: number | null;
  totalHours: number;
  totalCost: number;
  progress: number;
  recentActivityCount: number;
}

export const useAreaProjects = (areaId: string) => {
  return useQuery({
    queryKey: ["area-projects", areaId],
    queryFn: async (): Promise<ProjectProgress[]> => {
      console.log("Buscando projetos para área:", areaId);
      
      if (!areaId || areaId === "all") {
        return [];
      }

      try {
        // Query otimizada: selecionar apenas campos necessários
        const { data, error } = await supabase
          .from("projetos")
          .select(`
            id,
            nome_projeto,
            status_projeto,
            orcamento_total,
            registros_atividades!inner (
              horas_gastas,
              data_registro,
              area_id,
              areas_produtivas (
                custo_hora_padrao
              )
            )
          `)
          .eq("registros_atividades.area_id", areaId)
          .eq("status_projeto", "Ativo")
          .limit(10); // Limitar para melhor performance

        if (error) {
          console.error("Erro ao buscar projetos da área:", error);
          throw new Error(`Falha ao carregar projetos da área: ${error.message}`);
        }

        // Calcular métricas para cada projeto
        const projectsWithMetrics = data.map((project) => {
          const activities = project.registros_atividades || [];
          const totalHours = activities.reduce((sum, activity) => sum + Number(activity.horas_gastas), 0);
          
          // Calcular custo total baseado nas horas e custo da área
          const totalCost = activities.reduce((sum, activity) => {
            const hourCost = activity.areas_produtivas?.custo_hora_padrao || 50;
            return sum + (Number(activity.horas_gastas) * Number(hourCost));
          }, 0);

          // Calcular progresso baseado no orçamento
          let progress = 0;
          if (project.orcamento_total && Number(project.orcamento_total) > 0) {
            progress = Math.min((totalCost / Number(project.orcamento_total)) * 100, 100);
          } else {
            // Se não há orçamento, usar uma estimativa baseada nas horas (assumindo 100h como base)
            progress = Math.min((totalHours / 100) * 100, 100);
          }

          // Contar atividades recentes (últimos 30 dias)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentActivityCount = activities.filter(
            activity => new Date(activity.data_registro) >= thirtyDaysAgo
          ).length;

          return {
            id: project.id,
            nome_projeto: project.nome_projeto,
            status_projeto: project.status_projeto,
            orcamento_total: project.orcamento_total ? Number(project.orcamento_total) : null,
            totalHours,
            totalCost,
            progress: Math.round(progress),
            recentActivityCount,
          };
        });

        // Ordenar por atividade recente e depois por progresso
        const sortedProjects = projectsWithMetrics
          .sort((a, b) => {
            if (a.recentActivityCount !== b.recentActivityCount) {
              return b.recentActivityCount - a.recentActivityCount;
            }
            return b.totalHours - a.totalHours;
          })
          .slice(0, 5); // Pegar os 5 primeiros

        console.log("Projetos calculados:", sortedProjects);
        return sortedProjects;
      } catch (error) {
        console.error("Erro na query projetos da área:", error);
        throw error;
      }
    },
    enabled: !!areaId && areaId !== "all",
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error?.message?.includes('4')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
