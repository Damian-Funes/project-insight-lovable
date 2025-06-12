
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CostsByAreaFilters {
  startDate?: Date;
  endDate?: Date;
  areaId?: string;
}

export const useCostsByArea = (filters?: CostsByAreaFilters) => {
  return useQuery({
    queryKey: ["costs-by-area", filters],
    queryFn: async () => {
      console.log("Buscando custos por área com filtros:", filters);
      
      let query = supabase
        .from("registros_atividades")
        .select(`
          area_id,
          horas_gastas,
          data_registro,
          areas_produtivas (
            nome_area,
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

      // Aplicar filtro de área
      if (filters?.areaId && filters.areaId !== 'all') {
        query = query.eq('area_id', filters.areaId);
      }

      const { data, error } = await query;

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
