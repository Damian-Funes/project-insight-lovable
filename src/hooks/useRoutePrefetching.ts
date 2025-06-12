
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIGS } from "@/config/queryClient";

// Mapeamento de rotas para dados que devem ser pré-carregados
const ROUTE_PREFETCH_MAP = {
  '/dashboard': [
    QUERY_KEYS.COSTS_BY_AREA,
    QUERY_KEYS.COSTS_BY_PROJECT,
    QUERY_KEYS.PROFITABILITY,
    QUERY_KEYS.OPTIMIZED_AREAS,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
  '/activities': [
    QUERY_KEYS.ACTIVITIES_PAGINATED,
    QUERY_KEYS.OPTIMIZED_AREAS,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
  '/projects': [
    QUERY_KEYS.PROJECTS_PAGINATED,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
  '/ops': [
    QUERY_KEYS.OPS_DASHBOARD,
    QUERY_KEYS.OPTIMIZED_AREAS,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
  '/revenues': [
    QUERY_KEYS.OPTIMIZED_REVENUES,
    QUERY_KEYS.OPTIMIZED_PROJECTS,
  ],
} as const;

export const useRoutePrefetching = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentRoute = location.pathname as keyof typeof ROUTE_PREFETCH_MAP;
    const prefetchKeys = ROUTE_PREFETCH_MAP[currentRoute];

    if (!prefetchKeys) return;

    // Prefetch dados relevantes para a rota atual
    prefetchKeys.forEach(queryKey => {
      // Verificar se os dados já estão no cache e são válidos
      const queryState = queryClient.getQueryState(queryKey);
      const shouldPrefetch = !queryState || queryState.dataUpdatedAt < (Date.now() - (5 * 60 * 1000));

      if (shouldPrefetch) {
        // Configurar prefetch baseado no tipo de dados
        let config = QUERY_CONFIGS.ACTIVITIES;
        
        if (queryKey.includes('areas') || queryKey.includes('projects')) {
          config = QUERY_CONFIGS.AREAS;
        } else if (queryKey.includes('dashboard') || queryKey.includes('costs')) {
          config = QUERY_CONFIGS.DASHBOARD;
        }

        queryClient.prefetchQuery({
          queryKey,
          ...config,
          queryFn: async () => {
            // Implementação dinâmica baseada na queryKey
            if (queryKey === QUERY_KEYS.OPTIMIZED_AREAS) {
              return [];
            }
            
            if (queryKey === QUERY_KEYS.OPTIMIZED_PROJECTS) {
              return [];
            }

            // Adicionar mais casos conforme necessário
            return [];
          },
        });
      }
    });
  }, [location.pathname, queryClient]);

  // Prefetch dados para rotas comuns quando há inatividade
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const prefetchCommonRoutes = () => {
      const commonRoutes = ['/dashboard', '/activities', '/projects'];
      
      commonRoutes.forEach(route => {
        if (route !== location.pathname) {
          const prefetchKeys = ROUTE_PREFETCH_MAP[route as keyof typeof ROUTE_PREFETCH_MAP];
          
          prefetchKeys?.forEach(queryKey => {
            const queryState = queryClient.getQueryState(queryKey);
            const shouldPrefetch = !queryState || queryState.dataUpdatedAt < (Date.now() - (10 * 60 * 1000));
            
            if (shouldPrefetch) {
              queryClient.prefetchQuery({
                queryKey,
                staleTime: QUERY_CONFIGS.AREAS.staleTime,
                queryFn: async () => [], // Implementação simplificada
              });
            }
          });
        }
      });
    };

    // Prefetch após 3 segundos de inatividade
    timeoutId = setTimeout(prefetchCommonRoutes, 3000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, queryClient]);
};
