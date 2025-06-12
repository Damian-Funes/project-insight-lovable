
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useRoutePrefetching = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Route prefetching initialized for:', location.pathname);
    
    // Cleanup de cache simples a cada mudança de rota
    const cleanupCache = () => {
      const cacheSize = queryClient.getQueryCache().getAll().length;
      
      // Se há muitas queries em cache (>50), faça limpeza básica
      if (cacheSize > 50) {
        const queries = queryClient.getQueryCache().getAll();
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        queries.forEach(query => {
          if (query.state.dataUpdatedAt < oneHourAgo) {
            queryClient.removeQueries({ queryKey: query.queryKey });
          }
        });
        
        console.log(`🧹 Cache cleanup completed`);
      }
    };

    const timer = setTimeout(cleanupCache, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname, queryClient]);
};
