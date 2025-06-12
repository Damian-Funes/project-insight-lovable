
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface OptimizedCostsByProjectFilters {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
}

export interface OptimizedProjectCosts {
  nome_projeto: string;
  custo_total: number;
}

export const useOptimizedCostsByProject = (filters?: OptimizedCostsByProjectFilters) => {
  // Debounce dos filtros
  const debouncedFilters = useDebounce(filters, 300);

  const query = useQuery({
    queryKey: ["optimized-costs-by-project", debouncedFilters],
    queryFn: async (): Promise<OptimizedProjectCosts[]> => {
      console.log("Buscando custos por projeto otimizados com filtros:", debouncedFilters);
      
      try {
        const { data, error } = await supabase.rpc('calcular_custos_projetos', {
          filtro_projeto_id: debouncedFilters?.projectId && debouncedFilters.projectId !== 'all' 
            ? debouncedFilters.projectId 
            : null,
          filtro_data_inicio: debouncedFilters?.startDate?.toISOString().split('T')[0] || null,
          filtro_data_fim: debouncedFilters?.endDate?.toISOString().split('T')[0] || null
        });

        if (error) {
          console.error("Erro ao buscar custos por projeto:", error);
          throw error;
        }

        console.log("Custos por projeto otimizados:", data);
        return data || [];
      } catch (error) {
        console.error("Erro no hook useOptimizedCostsByProject:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Memoizar estatísticas dos custos
  const costStatistics = useMemo(() => {
    if (!query.data || query.data.length === 0) {
      return {
        totalCost: 0,
        averageCost: 0,
        maxCost: 0,
        minCost: 0,
        projectsWithCosts: 0
      };
    }

    const costs = query.data.map(project => Number(project.custo_total));
    const totalCost = costs.reduce((sum, cost) => sum + cost, 0);
    const averageCost = totalCost / costs.length;
    const maxCost = Math.max(...costs);
    const minCost = Math.min(...costs);

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      averageCost: Math.round(averageCost * 100) / 100,
      maxCost: Math.round(maxCost * 100) / 100,
      minCost: Math.round(minCost * 100) / 100,
      projectsWithCosts: costs.length
    };
  }, [query.data]);

  return {
    ...query,
    costStatistics
  };
};
