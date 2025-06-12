
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CostsByProjectFilters {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export const useCostsByProject = (filters?: CostsByProjectFilters) => {
  return useQuery({
    queryKey: ["costs-by-project", filters],
    queryFn: async () => {
      console.log("Buscando custos por projeto com filtros:", filters);
      
      let query = supabase
        .from("registros_atividades")
        .select(`
          projeto_id,
          horas_gastas,
          data_registro,
          projetos (
            nome_projeto
          ),
          areas_produtivas (
            custo_hora_padrao
          )
        `);

      // Aplicar filtros de data
      if (filters?.startDate) {
        query = query.gte('data_registro', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte('data_registro', filters.endDate.toISOString().split('T')[0]);
      }

      // Aplicar filtro de projeto
      if (filters?.projectId && filters.projectId !== 'all') {
        query = query.eq('projeto_id', filters.projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar custos por projeto:", error);
        throw error;
      }

      console.log("Dados brutos encontrados:", data);

      // Agrupar e calcular custos por projeto
      const projectCosts = data.reduce((acc, record) => {
        const projectName = record.projetos?.nome_projeto;
        const hourCost = record.areas_produtivas?.custo_hora_padrao || 0;
        const hours = Number(record.horas_gastas);
        const totalCost = hours * Number(hourCost);

        if (projectName) {
          if (!acc[projectName]) {
            acc[projectName] = {
              nome_projeto: projectName,
              custo_total: 0
            };
          }
          acc[projectName].custo_total += totalCost;
        }

        return acc;
      }, {} as Record<string, { nome_projeto: string; custo_total: number }>);

      const result = Object.values(projectCosts).map(project => ({
        ...project,
        custo_total: Math.round(project.custo_total * 100) / 100 // Arredondar para 2 casas decimais
      }));

      console.log("Custos calculados por projeto:", result);
      return result;
    },
  });
};
