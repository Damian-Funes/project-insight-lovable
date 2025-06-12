
import React, { createContext, useContext, useEffect } from "react";
import { useGlobalState } from "@/hooks/useGlobalState";
import { usePerformanceOptimizedCache } from "@/hooks/usePerformanceOptimizedCache";

interface GlobalStateContextType {
  prefetchCommonData: () => Promise<void>;
  updateQueryData: <T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T
  ) => void;
  invalidateQueries: (queryKeys: (string | number | object)[][]) => void;
  invalidateActivityRelated: (activityData: {
    projeto_id?: string;
    area_id?: string;
  }) => void;
  invalidateProjectRelated: (projectId: string) => void;
  getCachedData: <T>(queryKey: readonly unknown[]) => T | undefined;
  cleanupCache: () => void;
  cacheMetrics: {
    totalQueries: number;
    staleQueries: number;
    loadingQueries: number;
    errorQueries: number;
  };
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const globalState = useGlobalState();
  const performanceCache = usePerformanceOptimizedCache();

  // Prefetch dados comuns na inicialização com cache otimizado
  useEffect(() => {
    // Usar cache otimizado primeiro, depois prefetch
    performanceCache.restorePersistedCache();
    
    // Delay para não bloquear o carregamento inicial
    setTimeout(() => {
      globalState.prefetchCommonData();
    }, 500);
  }, [globalState.prefetchCommonData, performanceCache]);

  const contextValue: GlobalStateContextType = {
    prefetchCommonData: globalState.prefetchCommonData,
    updateQueryData: globalState.updateQueryData,
    invalidateQueries: globalState.invalidateQueries,
    invalidateActivityRelated: globalState.invalidateActivityRelated,
    invalidateProjectRelated: globalState.invalidateProjectRelatedQueries,
    getCachedData: globalState.getCachedData,
    cleanupCache: () => {
      globalState.cleanupCache();
      performanceCache.aggressiveCacheCleanup();
    },
    cacheMetrics: globalState.cacheMetrics,
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalStateContext deve ser usado dentro de um GlobalStateProvider');
  }
  return context;
};
