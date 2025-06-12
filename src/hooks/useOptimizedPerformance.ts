
import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export const useOptimizedPerformance = () => {
  const setLoading = useAppStore((state) => state.setLoading);
  const loadingStates = useAppStore((state) => state.loadingStates);

  // Throttled loading setter simples
  const throttledSetLoading = useCallback((key: string, loading: boolean) => {
    setLoading(key, loading);
  }, [setLoading]);

  // Métricas simples
  const performanceMetrics = useMemo(() => ({
    isAnyLoading: Object.values(loadingStates).some(Boolean),
    activeLoadingStates: Object.keys(loadingStates).filter(key => loadingStates[key]),
  }), [loadingStates]);

  // Função simples para medir operações
  const measureOperation = useCallback(<T,>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    throttledSetLoading(operationName, true);
    
    return operation()
      .finally(() => {
        throttledSetLoading(operationName, false);
      });
  }, [throttledSetLoading]);

  return {
    performanceMetrics,
    measureOperation,
    throttledSetLoading,
  };
};
