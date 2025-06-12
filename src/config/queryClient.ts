
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys centralizadas
export const QUERY_KEYS = {
  ACTIVITIES_PAGINATED: ['activities', 'paginated'] as const,
  ACTIVITIES_ALL: ['activities'] as const,
  PROJECTS_ALL: ['projects'] as const,
  AREAS_ALL: ['areas'] as const,
  DASHBOARDS_ALL: ['dashboards'] as const,
  OPTIMIZED_AREAS: ['areas', 'optimized'] as const,
  OPTIMIZED_PROJECTS: ['projects', 'optimized'] as const,
} as const;

// Padrões de invalidação com tipos mais simples
export const INVALIDATION_PATTERNS = {
  ACTIVITIES_ALL: () => [
    QUERY_KEYS.ACTIVITIES_ALL,
    QUERY_KEYS.ACTIVITIES_PAGINATED,
  ],
  PROJECTS_ALL: () => [
    QUERY_KEYS.PROJECTS_ALL,
  ],
  AREAS_ALL: () => [
    QUERY_KEYS.AREAS_ALL,
  ],
  DASHBOARDS_ALL: () => [
    QUERY_KEYS.DASHBOARDS_ALL,
  ],
  PROJECT_RELATED: (projectId: string) => [
    ['projects', projectId] as const,
    ['activities', { projeto_id: projectId }] as const,
    QUERY_KEYS.DASHBOARDS_ALL,
  ],
  AREA_RELATED: (areaId: string) => [
    ['areas', areaId] as const,
    ['activities', { area_id: areaId }] as const,
    QUERY_KEYS.DASHBOARDS_ALL,
  ],
} as const;
