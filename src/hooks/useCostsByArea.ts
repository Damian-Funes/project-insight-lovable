
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCostsByArea = () => {
  return useQuery({
    queryKey: ["costs-by-area"],
    queryFn: async () => {
      console.log("Buscando custos por área...");
      
      const { data, error } = await supabase
        .from("registros_atividades")
        .select(`
          area_id,
          horas_gastas,
          areas_produtivas (
            nome_area,
            custo_hora_padrao
          )
        `);

      if (error) {
        console.error("Erro ao buscar custos por área:", error);
        throw error;
      }

      console.log("Dados brutos encontrados para áreas:", data);

      // Agrupar e calcular custos por área
      const areaCosts = data.reduce((acc, record) => {
        const areaName = record.areas_produtivas?.nome_area;
        const hourCost = record.areas_produtivas?.custo_hora_padrao || 0;
        const hours = Number(record.horas_gastas);
        const totalCost = hours * Number(hourCost);

        if (areaName) {
          if (!acc[areaName]) {
            acc[areaName] = {
              nome_area: areaName,
              custo_total: 0
            };
          }
          acc[areaName].custo_total += totalCost;
        }

        return acc;
      }, {} as Record<string, { nome_area: string; custo_total: number }>);

      const result = Object.values(areaCosts).map(area => ({
        ...area,
        custo_total: Math.round(area.custo_total * 100) / 100 // Arredondar para 2 casas decimais
      }));

      console.log("Custos calculados por área:", result);
      return result;
    },
  });
};
