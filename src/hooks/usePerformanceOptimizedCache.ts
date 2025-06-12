
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export const usePerformanceOptimizedCache = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  // Cache persistente - salvar no localStorage
  const persistCriticalData = useCallback(async () => {
    const criticalQueries = [
      ['projects'],
      ['areas'],
      ['activities'],
      ['user-profile']
    ];

    criticalQueries.forEach(queryKey => {
      const data = queryClient.getQueryData(queryKey);
      if (data) {
        try {
          localStorage.setItem(
            `cache_${queryKey.join('_')}`,
            JSON.stringify({
              data,
              timestamp: Date.now(),
              expiry: Date.now() + (15 * 60 * 1000) // 15 minutos
            })
          );
        } catch (error) {
          console.warn('Failed to persist cache:', error);
        }
      }
    });
  }, [queryClient]);

  // Restaurar cache persistente
  const restorePersistedCache = useCallback(() => {
    const criticalQueries = [
      ['projects'],
      ['areas'],
      ['activities'],
      ['user-profile']
    ];

    criticalQueries.forEach(queryKey => {
      try {
        const cached = localStorage.getItem(`cache_${queryKey.join('_')}`);
        if (cached) {
          const { data, expiry } = JSON.parse(cached);
          if (Date.now() < expiry) {
            queryClient.setQueryData(queryKey, data);
            console.log(`Cache restored for: ${queryKey.join('_')}`);
          } else {
            localStorage.removeItem(`cache_${queryKey.join('_')}`);
          }
        }
      } catch (error) {
        console.warn('Failed to restore cache:', error);
      }
    });
  }, [queryClient]);

  // Prefetch baseado na rota atual
  const prefetchRouteData = useCallback(async () => {
    const routeMapping = {
      '/dashboard': [
        () => queryClient.prefetchQuery({
          queryKey: ['projects'],
          staleTime: 15 * 60 * 1000
        }),
        () => queryClient.prefetchQuery({
          queryKey: ['activities'],
          staleTime: 15 * 60 * 1000
        })
      ],
      '/projects': [
        () => queryClient.prefetchQuery({
          queryKey: ['areas'],
          staleTime: 15 * 60 * 1000
        }),
        () => queryClient.prefetchQuery({
          queryKey: ['costs-by-project'],
          staleTime: 15 * 60 * 1000
        })
      ],
      '/activities': [
        () => queryClient.prefetchQuery({
          queryKey: ['projects'],
          staleTime: 15 * 60 * 1000
        }),
        () => queryClient.prefetchQuery({
          queryKey: ['areas'],
          staleTime: 15 * 60 * 1000
        })
      ]
    };

    const prefetchers = routeMapping[location.pathname];
    if (prefetchers) {
      // Executar prefetch com delay para não bloquear a UI
      setTimeout(() => {
        prefetchers.forEach(prefetcher => {
          prefetcher().catch(() => {
            // Silenciar erros de prefetch
          });
        });
      }, 100);
    }
  }, [location.pathname, queryClient]);

  // Limpeza agressiva de cache
  const aggressiveCacheCleanup = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    let cleanedCount = 0;
    queries.forEach(query => {
      if (query.state.dataUpdatedAt < oneHourAgo) {
        queryClient.removeQueries({ queryKey: query.queryKey });
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`🧹 Aggressive cache cleanup: ${cleanedCount} queries removed`);
    }
  }, [queryClient]);

  // Inicialização na montagem
  useEffect(() => {
    restorePersistedCache();
  }, [restorePersistedCache]);

  // Prefetch na mudança de rota
  useEffect(() => {
    prefetchRouteData();
  }, [prefetchRouteData]);

  // Persistir cache periodicamente
  useEffect(() => {
    const interval = setInterval(persistCriticalData, 5 * 60 * 1000); // A cada 5 minutos
    return () => clearInterval(interval);
  }, [persistCriticalData]);

  // Limpeza periódica
  useEffect(() => {
    const interval = setInterval(aggressiveCacheCleanup, 30 * 60 * 1000); // A cada 30 minutos
    return () => clearInterval(interval);
  }, [aggressiveCacheCleanup]);

  return {
    persistCriticalData,
    restorePersistedCache,
    prefetchRouteData,
    aggressiveCacheCleanup
  };
};
