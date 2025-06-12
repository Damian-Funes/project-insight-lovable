
import { useCallback, useMemo, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export const useOptimizedPerformance = () => {
  const setLoading = useAppStore((state) => state.setLoading);
  const loadingStates = useAppStore((state) => state.loadingStates);
  
  const performanceRef = useRef({
    renderCount: 0,
    lastRenderTime: 0,
  });

  // Throttled loading setter para evitar updates excessivos
  const throttledSetLoading = useCallback((key: string, loading: boolean) => {
    const now = Date.now();
    if (now - performanceRef.current.lastRenderTime > 16) { // ~60fps
      setLoading(key, loading);
      performanceRef.current.lastRenderTime = now;
    }
  }, [setLoading]);

  // Memoizar métricas de performance
  const performanceMetrics = useMemo(() => {
    performanceRef.current.renderCount++;
    
    return {
      renderCount: performanceRef.current.renderCount,
      isAnyLoading: Object.values(loadingStates).some(Boolean),
      activeLoadingStates: Object.keys(loadingStates).filter(key => loadingStates[key]),
    };
  }, [loadingStates]);

  // Função para medir tempo de operações
  const measureOperation = useCallback(<T,>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    throttledSetLoading(operationName, true);
    
    return operation()
      .finally(() => {
        const end = performance.now();
        console.log(`⚡ ${operationName} took ${(end - start).toFixed(2)}ms`);
        throttledSetLoading(operationName, false);
      });
  }, [throttledSetLoading]);

  return {
    performanceMetrics,
    measureOperation,
    throttledSetLoading,
  };
};
