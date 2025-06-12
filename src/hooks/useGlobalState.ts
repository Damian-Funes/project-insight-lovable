
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { QUERY_KEYS, INVALIDATION_PATTERNS } from "@/config/queryClient";

export const useGlobalState = () => {
  const queryClient = useQueryClient();

  // Função para prefetching de dados comuns
  const prefetchCommonData = useCallback(async () => {
    const prefetchPromises = [
      // Prefetch dados estáticos mais usados
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.OPTIMIZED_AREAS,
        queryFn: async () => {
          // Simular busca de áreas
          return [];
        },
      }),
      
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.OPTIMIZED_PROJECTS,
        queryFn: async () => {
          // Simular busca de projetos
          return [];
        },
      }),
    ];

    await Promise.allSettled(prefetchPromises);
  }, [queryClient]);

  // Função para atualizar dados sem refetching
  const updateQueryData = useCallback(<T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T
  ) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient]);

  // Função para invalidação seletiva com tipos simplificados
  const invalidateQueries = useCallback((pattern: keyof typeof INVALIDATION_PATTERNS, ...args: unknown[]) => {
    let queryKeys: unknown[][] = [];
    
    if (pattern === 'PROJECT_RELATED' && args.length > 0) {
      const projectKeys = INVALIDATION_PATTERNS.PROJECT_RELATED(args[0] as string);
      queryKeys = projectKeys.map(key => Array.from(key));
    } else if (pattern === 'AREA_RELATED' && args.length > 0) {
      const areaKeys = INVALIDATION_PATTERNS.AREA_RELATED(args[0] as string);
      queryKeys = areaKeys.map(key => Array.from(key));
    } else {
      const patternFunction = INVALIDATION_PATTERNS[pattern];
      if (typeof patternFunction === 'function') {
        const keys = patternFunction();
        queryKeys = keys.map(key => Array.from(key));
      }
    }
    
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  // Função para invalidar dados relacionados a uma atividade
  const invalidateActivityRelated = useCallback((activityData: {
    projeto_id?: string;
    area_id?: string;
  }) => {
    // Invalidar atividades
    invalidateQueries('ACTIVITIES_ALL');
    
    // Invalidar dashboards
    invalidateQueries('DASHBOARDS_ALL');
    
    // Invalidar dados específicos do projeto
    if (activityData.projeto_id) {
      invalidateQueries('PROJECT_RELATED', activityData.projeto_id);
    }
    
    // Invalidar dados específicos da área
    if (activityData.area_id) {
      invalidateQueries('AREA_RELATED', activityData.area_id);
    }
  }, [invalidateQueries]);

  // Função para invalidar dados relacionados a um projeto
  const invalidateProjectRelated = useCallback((projectId: string) => {
    invalidateQueries('PROJECTS_ALL');
    invalidateQueries('PROJECT_RELATED', projectId);
    invalidateQueries('DASHBOARDS_ALL');
  }, [invalidateQueries]);

  // Função para limpar cache antigo
  const cleanupCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  // Função para obter dados do cache sem trigger de fetch
  const getCachedData = useCallback(<T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  }, [queryClient]);

  // Métricas do cache
  const cacheMetrics = useMemo(() => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    return {
      totalQueries: queries.length,
      staleQueries: queries.filter(q => q.isStale()).length,
      loadingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
    };
  }, [queryClient]);

  return {
    // Prefetching
    prefetchCommonData,
    
    // Atualização de dados
    updateQueryData,
    
    // Invalidação
    invalidateQueries,
    invalidateActivityRelated,
    invalidateProjectRelated,
    
    // Cache management
    getCachedData,
    cleanupCache,
    
    // Métricas
    cacheMetrics,
  };
};
