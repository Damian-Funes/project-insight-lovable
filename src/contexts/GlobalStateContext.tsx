
import React, { createContext, useContext, useEffect } from "react";
import { useGlobalState } from "@/hooks/useGlobalState";

interface GlobalStateContextType {
  prefetchCommonData: () => Promise<void>;
  updateQueryData: <T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T
  ) => void;
  invalidateQueries: (pattern: string, ...args: any[]) => void;
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

  // Prefetch dados comuns na inicialização
  useEffect(() => {
    globalState.prefetchCommonData();
  }, [globalState.prefetchCommonData]);

  return (
    <GlobalStateContext.Provider value={globalState}>
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
