
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMonths, format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface ProjectionFilters {
  analysisMonths?: number; // 3 ou 6 meses para análise histórica
  projectionHorizon?: number; // 3, 6 ou 12 meses para projeção
}

export interface ProjectionData {
  month: string;
  costs: number;
  revenues: number;
  isProjected: boolean;
}

export const useFinancialProjection = (filters?: ProjectionFilters) => {
  const analysisMonths = filters?.analysisMonths || 6;
  const projectionHorizon = filters?.projectionHorizon || 6;

  return useQuery({
    queryKey: ["financial-projection", analysisMonths, projectionHorizon],
    queryFn: async () => {
      console.log("Calculando projeções financeiras...");
      
      // Definir período de análise histórica
      const endDate = new Date();
      const startDate = subMonths(endDate, analysisMonths);
      
      // Buscar dados históricos de custos
      const { data: costData, error: costError } = await supabase
        .from("registros_atividades")
        .select(`
          data_registro,
          horas_gastas,
          areas_produtivas (
            custo_hora_padrao
          )
        `)
        .gte('data_registro', format(startDate, 'yyyy-MM-dd'))
        .lte('data_registro', format(endDate, 'yyyy-MM-dd'));

      if (costError) {
        console.error("Erro ao buscar dados de custo:", costError);
        throw costError;
      }

      // Buscar dados históricos de receitas
      const { data: revenueData, error: revenueError } = await supabase
        .from("receitas")
        .select(`
          data_receita,
          valor_receita
        `)
        .gte('data_receita', format(startDate, 'yyyy-MM-dd'))
        .lte('data_receita', format(endDate, 'yyyy-MM-dd'));

      if (revenueError) {
        console.error("Erro ao buscar dados de receita:", revenueError);
        throw revenueError;
      }

      // Agrupar custos por mês
      const monthlyCosts = costData.reduce((acc, record) => {
        const month = format(new Date(record.data_registro), 'yyyy-MM');
        const cost = Number(record.horas_gastas) * Number(record.areas_produtivas?.custo_hora_padrao || 0);
        
        if (!acc[month]) acc[month] = 0;
        acc[month] += cost;
        
        return acc;
      }, {} as Record<string, number>);

      // Agrupar receitas por mês
      const monthlyRevenues = revenueData.reduce((acc, record) => {
        const month = format(new Date(record.data_receita), 'yyyy-MM');
        const revenue = Number(record.valor_receita);
        
        if (!acc[month]) acc[month] = 0;
        acc[month] += revenue;
        
        return acc;
      }, {} as Record<string, number>);

      // Calcular médias mensais
      const avgMonthlyCost = Object.values(monthlyCosts).length > 0 
        ? Object.values(monthlyCosts).reduce((sum, cost) => sum + cost, 0) / Object.values(monthlyCosts).length
        : 0;
      
      const avgMonthlyRevenue = Object.values(monthlyRevenues).length > 0
        ? Object.values(monthlyRevenues).reduce((sum, revenue) => sum + revenue, 0) / Object.values(monthlyRevenues).length
        : 0;

      // Gerar dados históricos + projeções
      const projectionData: ProjectionData[] = [];
      
      // Adicionar dados históricos
      for (let i = analysisMonths - 1; i >= 0; i--) {
        const month = subMonths(endDate, i);
        const monthKey = format(month, 'yyyy-MM');
        const monthLabel = format(month, 'MMM/yyyy');
        
        projectionData.push({
          month: monthLabel,
          costs: Math.round((monthlyCosts[monthKey] || 0) * 100) / 100,
          revenues: Math.round((monthlyRevenues[monthKey] || 0) * 100) / 100,
          isProjected: false
        });
      }
      
      // Adicionar projeções futuras
      for (let i = 1; i <= projectionHorizon; i++) {
        const month = addMonths(endDate, i);
        const monthLabel = format(month, 'MMM/yyyy');
        
        projectionData.push({
          month: monthLabel,
          costs: Math.round(avgMonthlyCost * 100) / 100,
          revenues: Math.round(avgMonthlyRevenue * 100) / 100,
          isProjected: true
        });
      }

      console.log("Dados de projeção calculados:", projectionData);
      return {
        data: projectionData,
        averages: {
          monthlyCost: Math.round(avgMonthlyCost * 100) / 100,
          monthlyRevenue: Math.round(avgMonthlyRevenue * 100) / 100
        }
      };
    },
  });
};
