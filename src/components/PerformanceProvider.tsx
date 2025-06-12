
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePerformanceMonitor, PerformanceBudget, PerformanceMetrics } from '@/hooks/usePerformanceMonitor';

interface PerformanceContextType {
  metrics: PerformanceMetrics[];
  averageRenderTime: number;
  budget: PerformanceBudget;
  setBudget: (budget: Partial<PerformanceBudget>) => void;
  clearMetrics: () => void;
  isMonitoringEnabled: boolean;
  toggleMonitoring: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: ReactNode;
  enabled?: boolean;
  budget?: Partial<PerformanceBudget>;
}

export const PerformanceProvider = ({ 
  children, 
  enabled = process.env.NODE_ENV === 'development',
  budget = {} 
}: PerformanceProviderProps) => {
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(enabled);
  const { 
    getMetrics, 
    getAverageRenderTime, 
    clearMetrics, 
    setBudget, 
    getBudget 
  } = usePerformanceMonitor('PerformanceProvider');
  
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [currentBudget, setCurrentBudget] = useState<PerformanceBudget>(getBudget());

  // Atualiza métricas periodicamente
  useEffect(() => {
    if (!isMonitoringEnabled) return;

    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoringEnabled, getMetrics]);

  // Define budget inicial
  useEffect(() => {
    if (Object.keys(budget).length > 0) {
      setBudget(budget);
      setCurrentBudget(getBudget());
    }
  }, [budget, setBudget, getBudget]);

  const toggleMonitoring = () => {
    setIsMonitoringEnabled(prev => !prev);
  };

  const handleSetBudget = (newBudget: Partial<PerformanceBudget>) => {
    setBudget(newBudget);
    setCurrentBudget(getBudget());
  };

  const contextValue: PerformanceContextType = {
    metrics,
    averageRenderTime: getAverageRenderTime(),
    budget: currentBudget,
    setBudget: handleSetBudget,
    clearMetrics,
    isMonitoringEnabled,
    toggleMonitoring,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformanceContext deve ser usado dentro de um PerformanceProvider');
  }
  return context;
};
