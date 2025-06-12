
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

  const invalidateQueries = useCallback((queryKeys: string[][]) => {
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  const invalidateProjectRelatedQueries = useCallback((projectId?: string) => {
    const baseQueries = [
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
    const baseQueries = [
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
    const allQueries = [
      ["activities", "paginated"],
      ["activities"],
      ["projects"],
      ["areas"],
      ["dashboards"],
    ];
    
    invalidateQueries(allQueries);
  }, [invalidateQueries]);

  return {
    invalidateProjectRelatedQueries,
    invalidateAreaRelatedQueries,
    refreshAllQueries,
  };
};
