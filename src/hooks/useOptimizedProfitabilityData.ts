
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface OptimizedProfitabilityFilters {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export interface OptimizedProjectProfitability {
  projeto_id: string;
  nome_projeto: string;
  receita_total: number;
  custo_total: number;
  lucro: number;
  margem_lucro: number;
}

export const useOptimizedProfitabilityData = (filters?: OptimizedProfitabilityFilters) => {
  // Debounce dos filtros para evitar muitas requisições
  const debouncedFilters = useDebounce(filters, 300);

  const query = useQuery({
    queryKey: ["optimized-profitability-data", debouncedFilters],
    queryFn: async (): Promise<OptimizedProjectProfitability[]> => {
      console.log("Buscando dados de rentabilidade otimizada com filtros:", debouncedFilters);
      
      try {
        const { data, error } = await supabase.rpc('calcular_rentabilidade_projetos', {
          filtro_projeto_id: debouncedFilters?.projectId && debouncedFilters.projectId !== 'all' 
            ? debouncedFilters.projectId 
            : null,
          filtro_data_inicio: debouncedFilters?.startDate?.toISOString().split('T')[0] || null,
          filtro_data_fim: debouncedFilters?.endDate?.toISOString().split('T')[0] || null
        });

        if (error) {
          console.error("Erro ao buscar dados de rentabilidade:", error);
          throw error;
        }

        console.log("Dados de rentabilidade otimizados:", data);
        return data || [];
      } catch (error) {
        console.error("Erro no hook useOptimizedProfitabilityData:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Memoizar métricas agregadas para evitar recálculos
  const aggregatedMetrics = useMemo(() => {
    if (!query.data || query.data.length === 0) {
      return {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        averageMargin: 0,
        profitableProjects: 0,
        totalProjects: 0
      };
    }

    const data = query.data;
    const totalRevenue = data.reduce((sum, project) => sum + Number(project.receita_total), 0);
    const totalCost = data.reduce((sum, project) => sum + Number(project.custo_total), 0);
    const totalProfit = data.reduce((sum, project) => sum + Number(project.lucro), 0);
    const profitableProjects = data.filter(project => Number(project.lucro) > 0).length;
    const averageMargin = data.length > 0 
      ? data.reduce((sum, project) => sum + Number(project.margem_lucro), 0) / data.length 
      : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      averageMargin: Math.round(averageMargin * 100) / 100,
      profitableProjects,
      totalProjects: data.length
    };
  }, [query.data]);

  return {
    ...query,
    aggregatedMetrics
  };
};
