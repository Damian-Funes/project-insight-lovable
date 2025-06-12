
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface GlobalState {
  selectedProjects: string[];
  selectedAreas: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  refreshTrigger: number;
}

const INITIAL_STATE: GlobalState = {
  selectedProjects: [],
  selectedAreas: [],
  dateRange: {
    start: null,
    end: null,
  },
  refreshTrigger: 0,
};

export const useGlobalState = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback((queryKeys: (string | number | object)[][]) => {
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  const invalidateProjectRelatedQueries = useCallback((projectId?: string) => {
    const baseQueries: (string | number | object)[][] = [
      ["dashboards"],
      ["projects"],
      ["activities"],
    ];

    if (projectId) {
      baseQueries.push(
        ["projects", projectId],
        ["activities", { projeto_id: projectId }]
      );
    }

    invalidateQueries(baseQueries);
  }, [invalidateQueries]);

  const invalidateAreaRelatedQueries = useCallback((areaId?: string) => {
    const baseQueries: (string | number | object)[][] = [
      ["dashboards"],
      ["areas"],
      ["activities"],
    ];

    if (areaId) {
      baseQueries.push(
        ["areas", areaId],
        ["activities", { area_id: areaId }]
      );
    }

    invalidateQueries(baseQueries);
  }, [invalidateQueries]);

  const refreshAllQueries = useCallback(() => {
    const allQueries: (string | number | object)[][] = [
      ["activities", "paginated"],
      ["activities"],
      ["projects"],
      ["areas"],
      ["dashboards"],
    ];
    
    invalidateQueries(allQueries);
  }, [invalidateQueries]);

  const prefetchCommonData = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["projects"],
          staleTime: 5 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: ["areas"],
          staleTime: 5 * 60 * 1000,
        }),
      ]);
    } catch (error) {
      console.error("Erro ao fazer prefetch dos dados:", error);
    }
  }, [queryClient]);

  const updateQueryData = useCallback(<T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T
  ) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient]);

  const invalidateActivityRelated = useCallback((activityData: {
    projeto_id?: string;
    area_id?: string;
  }) => {
    const queries: (string | number | object)[][] = [["activities"]];
    
    if (activityData.projeto_id) {
      queries.push(["projects", activityData.projeto_id]);
    }
    
    if (activityData.area_id) {
      queries.push(["areas", activityData.area_id]);
    }
    
    invalidateQueries(queries);
  }, [invalidateQueries]);

  const getCachedData = useCallback(<T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  }, [queryClient]);

  const cleanupCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const cacheMetrics = {
    totalQueries: queryClient.getQueryCache().getAll().length,
    staleQueries: queryClient.getQueryCache().getAll().filter(q => q.isStale()).length,
    loadingQueries: queryClient.getQueryCache().getAll().filter(q => q.state.fetchStatus === 'fetching').length,
    errorQueries: queryClient.getQueryCache().getAll().filter(q => q.state.status === 'error').length,
  };

  return {
    prefetchCommonData,
    updateQueryData,
    invalidateQueries,
    invalidateActivityRelated,
    invalidateProjectRelatedQueries,
    invalidateAreaRelatedQueries,
    refreshAllQueries,
    getCachedData,
    cleanupCache,
    cacheMetrics,
  };
};
