
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface OptimizedCostsByAreaFilters {
  startDate?: Date;
  endDate?: Date;
  areaId?: string;
}

export interface OptimizedAreaCosts {
  nome_area: string;
  custo_total: number;
}

export const useOptimizedCostsByArea = (filters?: OptimizedCostsByAreaFilters) => {
  // Debounce dos filtros
  const debouncedFilters = useDebounce(filters, 300);

  const query = useQuery({
    queryKey: ["optimized-costs-by-area", debouncedFilters],
    queryFn: async (): Promise<OptimizedAreaCosts[]> => {
      console.log("Buscando custos por área otimizados com filtros:", debouncedFilters);
      
      try {
        const { data, error } = await supabase.rpc('calcular_custos_areas', {
          filtro_area_id: debouncedFilters?.areaId && debouncedFilters.areaId !== 'all' 
            ? debouncedFilters.areaId 
            : null,
          filtro_data_inicio: debouncedFilters?.startDate?.toISOString().split('T')[0] || null,
          filtro_data_fim: debouncedFilters?.endDate?.toISOString().split('T')[0] || null
        });

        if (error) {
          console.error("Erro ao buscar custos por área:", error);
          throw error;
        }

        console.log("Custos por área otimizados:", data);
        return data || [];
      } catch (error) {
        console.error("Erro no hook useOptimizedCostsByArea:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Memoizar métricas das áreas
  const areaMetrics = useMemo(() => {
    if (!query.data || query.data.length === 0) {
      return {
        totalCost: 0,
        averageCostPerArea: 0,
        mostExpensiveArea: '',
        leastExpensiveArea: '',
        areasWithActivity: 0
      };
    }

    const data = query.data;
    const totalCost = data.reduce((sum, area) => sum + Number(area.custo_total), 0);
    const averageCostPerArea = totalCost / data.length;
    const sortedByCost = [...data].sort((a, b) => Number(b.custo_total) - Number(a.custo_total));

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      averageCostPerArea: Math.round(averageCostPerArea * 100) / 100,
      mostExpensiveArea: sortedByost[0]?.nome_area || '',
      leastExpensiveArea: sortedByost[sortedByost.length - 1]?.nome_area || '',
      areasWithActivity: data.length
    };
  }, [query.data]);

  return {
    ...query,
    areaMetrics
  };
};
