
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useChunkPreloader } from '@/utils/chunkPreloader';
import { useQueryClient } from '@tanstack/react-query';

export const useOptimizedRoutePrefetching = () => {
  const location = useLocation();
  const { preloadCriticalChunks, preloadDependencies } = useChunkPreloader();
  const queryClient = useQueryClient();

  // Prefetch de chunks críticos baseado na rota atual
  useEffect(() => {
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
    let timeoutId: NodeJS.Timeout;
    
    // Se o usuário ficar na página por mais de 3 segundos,
    // assumimos que está engajado e preloadamos mais recursos
    const startTime = Date.now();
    
    const handleEngagement = () => {
      const timeOnPage = Date.now() - startTime;
      
      if (timeOnPage > 3000) {
        // Usuário engajado - preload dependencies medium
        preloadDependencies('medium');
        
        // Após 10 segundos, preload dependencies low priority
        timeoutId = setTimeout(() => {
          preloadDependencies('low');
        }, 7000);
      }
    };

    const timer = setTimeout(handleEngagement, 3000);

    return () => {
      clearTimeout(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname, preloadDependencies]);

  // Invalidação inteligente de cache antigo
  const cleanupOldCache = useCallback(() => {
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
  }, [queryClient]);

  // Cleanup de cache a cada mudança de rota
  useEffect(() => {
    const timer = setTimeout(cleanupOldCache, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname, cleanupOldCache]);

  return {
    preloadCriticalChunks,
    preloadDependencies,
    cleanupOldCache,
  };
};
