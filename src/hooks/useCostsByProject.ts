
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCostsByProject = () => {
  return useQuery({
    queryKey: ["costs-by-project"],
    queryFn: async () => {
      console.log("Buscando custos por projeto...");
      
      const { data, error } = await supabase
        .from("registros_atividades")
        .select(`
          projeto_id,
          horas_gastas,
          projetos (
            nome_projeto
          ),
          areas_produtivas (
            custo_hora_padrao
          )
        `);

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
