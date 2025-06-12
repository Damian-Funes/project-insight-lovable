
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChunkPreloader } from '@/utils/chunkPreloader';
import { useQueryClient } from '@tanstack/react-query';

export const useOptimizedRoutePrefetching = () => {
  const location = useLocation();
  const { preloadCriticalChunks, preloadDependencies } = useChunkPreloader();
  const queryClient = useQueryClient();

  // Prefetch de chunks críticos baseado na rota atual
  useEffect(() => {
    console.log('🚀 Initializing route prefetching for:', location.pathname);
    
    // Preload imediato de dependências high priority
    preloadDependencies('high');
    
    // Preload de chunks relacionados com delay
    const timer = setTimeout(() => {
      preloadCriticalChunks(location.pathname);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, preloadCriticalChunks, preloadDependencies]);

  // Prefetch inteligente baseado no tempo na página
  useEffect(() => {
    let engagementTimer: NodeJS.Timeout;
    let lowPriorityTimer: NodeJS.Timeout;
    
    const startTime = Date.now();
    
    const handleEngagement = () => {
      const timeOnPage = Date.now() - startTime;
      
      if (timeOnPage > 3000) {
        // Usuário engajado - preload dependencies medium
        preloadDependencies('medium');
        
        // Após 10 segundos, preload dependencies low priority
        lowPriorityTimer = setTimeout(() => {
          preloadDependencies('low');
        }, 7000);
      }
    };

    engagementTimer = setTimeout(handleEngagement, 3000);

    return () => {
      if (engagementTimer) clearTimeout(engagementTimer);
      if (lowPriorityTimer) clearTimeout(lowPriorityTimer);
    };
  }, [location.pathname, preloadDependencies]);

  // Cleanup de cache a cada mudança de rota
  useEffect(() => {
    const cleanupCache = () => {
      const cacheSize = queryClient.getQueryCache().getAll().length;
      
      // Se há muitas queries em cache (>100), faça limpeza
      if (cacheSize > 100) {
        const queries = queryClient.getQueryCache().getAll();
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        queries.forEach(query => {
          if (query.state.dataUpdatedAt < oneHourAgo) {
            queryClient.removeQueries({ queryKey: query.queryKey });
          }
        });
        
        console.log(`🧹 Cache cleanup: removed ${cacheSize - queryClient.getQueryCache().getAll().length} old queries`);
      }
    };

    const timer = setTimeout(cleanupCache, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname, queryClient]);

  return {
    preloadCriticalChunks,
    preloadDependencies,
  };
};
