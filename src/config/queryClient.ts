
import { QueryClient } from "@tanstack/react-query";

// Configurações otimizadas por tipo de dados
const DATA_STALE_TIMES = {
  STATIC: 30 * 60 * 1000, // 30 minutos - dados que raramente mudam (áreas, projetos)
  DYNAMIC: 5 * 60 * 1000,  // 5 minutos - dados que mudam com frequência (atividades, OPs)
  REALTIME: 2 * 60 * 1000, // 2 minutos - dados em tempo real (dashboards)
  USER: 15 * 60 * 1000,    // 15 minutos - dados do usuário
} as const;

const CACHE_TIMES = {
  SHORT: 10 * 60 * 1000,   // 10 minutos
  MEDIUM: 30 * 60 * 1000,  // 30 minutos  
  LONG: 60 * 60 * 1000,    // 1 hora
  EXTENDED: 2 * 60 * 60 * 1000, // 2 horas
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DATA_STALE_TIMES.DYNAMIC,
      gcTime: CACHE_TIMES.MEDIUM,
      retry: (failureCount, error) => {
        // Não fazer retry para erros de autenticação ou 4xx
        if (failureCount >= 2) return false;
        if (error?.message?.includes('4')) return false;
        return true;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // Usar dados anteriores enquanto busca novos
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Configurações específicas por tipo de query
export const QUERY_CONFIGS = {
  // Dados estáticos - raramente mudam
  AREAS: {
    staleTime: DATA_STALE_TIMES.STATIC,
    gcTime: CACHE_TIMES.EXTENDED,
  },
  PROJECTS: {
    staleTime: DATA_STALE_TIMES.STATIC,
    gcTime: CACHE_TIMES.LONG,
  },
  // Dados dinâmicos - mudam com frequência
  ACTIVITIES: {
    staleTime: DATA_STALE_TIMES.DYNAMIC,
    gcTime: CACHE_TIMES.MEDIUM,
  },
  OPS: {
    staleTime: DATA_STALE_TIMES.DYNAMIC,
    gcTime: CACHE_TIMES.MEDIUM,
  },
  // Dados em tempo real - dashboards e métricas
  DASHBOARD: {
    staleTime: DATA_STALE_TIMES.REALTIME,
    gcTime: CACHE_TIMES.SHORT,
  },
  METRICS: {
    staleTime: DATA_STALE_TIMES.REALTIME,
    gcTime: CACHE_TIMES.SHORT,
  },
  // Dados do usuário
  USER_DATA: {
    staleTime: DATA_STALE_TIMES.USER,
    gcTime: CACHE_TIMES.LONG,
  },
} as const;

// Chaves centralizadas para queries
export const QUERY_KEYS = {
  // Dados básicos
  AREAS: ['areas'] as const,
  PROJECTS: ['projects'] as const,
  ACTIVITIES: ['activities'] as const,
  OPS: ['ops'] as const,
  REVENUES: ['revenues'] as const,
  
  // Dados paginados
  ACTIVITIES_PAGINATED: ['activities', 'paginated'] as const,
  PROJECTS_PAGINATED: ['projects', 'paginated'] as const,
  
  // Dados otimizados
  OPTIMIZED_AREAS: ['areas', 'optimized'] as const,
  OPTIMIZED_PROJECTS: ['projects', 'optimized'] as const,
  OPTIMIZED_ACTIVITIES: ['activities', 'optimized'] as const,
  OPTIMIZED_OPS: ['ops', 'optimized'] as const,
  OPTIMIZED_REVENUES: ['revenues', 'optimized'] as const,
  
  // Dashboards e métricas
  COSTS_BY_AREA: ['costs', 'area'] as const,
  COSTS_BY_PROJECT: ['costs', 'project'] as const,
  PROFITABILITY: ['profitability'] as const,
  OPS_DASHBOARD: ['ops', 'dashboard'] as const,
  
  // Dados do usuário
  USER_PROFILE: ['user', 'profile'] as const,
  USER_NOTIFICATIONS: ['user', 'notifications'] as const,
} as const;

// Funções utilitárias para invalidação seletiva
export const INVALIDATION_PATTERNS = {
  // Invalidar todos os dados relacionados a atividades
  ACTIVITIES_ALL: () => [
    QUERY_KEYS.ACTIVITIES,
    QUERY_KEYS.ACTIVITIES_PAGINATED,
    QUERY_KEYS.OPTIMIZED_ACTIVITIES,
  ],
  
  // Invalidar todos os dados relacionados a projetos
  PROJECTS_ALL: () => [
    QUERY_KEYS.PROJECTS,
    QUERY_KEYS.PROJECTS_PAGINATED,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
  
  // Invalidar dashboards e métricas
  DASHBOARDS_ALL: () => [
    QUERY_KEYS.COSTS_BY_AREA,
    QUERY_KEYS.COSTS_BY_PROJECT,
    QUERY_KEYS.PROFITABILITY,
    QUERY_KEYS.OPS_DASHBOARD,
  ],
  
  // Invalidar dados específicos por projeto
  PROJECT_RELATED: (projectId: string) => [
    [...QUERY_KEYS.ACTIVITIES, { projeto_id: projectId }],
    [...QUERY_KEYS.OPS, { projeto_id: projectId }],
    [...QUERY_KEYS.REVENUES, { projeto_id: projectId }],
  ],
  
  // Invalidar dados específicos por área
  AREA_RELATED: (areaId: string) => [
    [...QUERY_KEYS.ACTIVITIES, { area_id: areaId }],
    [...QUERY_KEYS.OPS, { area_id: areaId }],
  ],
} as const;
