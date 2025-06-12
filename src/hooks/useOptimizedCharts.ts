
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface ChartDataPoint {
  [key: string]: any;
}

interface UseOptimizedChartsProps {
  data: ChartDataPoint[];
  maxDataPoints?: number;
  throttleMs?: number;
  isMobile?: boolean;
}

export const useOptimizedCharts = ({
  data,
  maxDataPoints = 50,
  throttleMs = 300,
  isMobile = false
}: UseOptimizedChartsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Throttle das atualizações de dados
  const debouncedData = useDebounce(data, throttleMs);
  
  // Otimizar dados baseado no dispositivo
  const optimizedData = useMemo(() => {
    if (!debouncedData || debouncedData.length === 0) return [];
    
    // Para mobile, reduzir ainda mais os pontos
    const targetPoints = isMobile ? Math.min(maxDataPoints / 2, 25) : maxDataPoints;
    
    if (debouncedData.length <= targetPoints) {
      return debouncedData;
    }
    
    // Amostragem inteligente para manter pontos importantes
    const step = Math.floor(debouncedData.length / targetPoints);
    const sampledData = [];
    
    for (let i = 0; i < debouncedData.length; i += step) {
      sampledData.push(debouncedData[i]);
    }
    
    // Sempre incluir o último ponto
    if (sampledData[sampledData.length - 1] !== debouncedData[debouncedData.length - 1]) {
      sampledData.push(debouncedData[debouncedData.length - 1]);
    }
    
    return sampledData;
  }, [debouncedData, maxDataPoints, isMobile]);
  
  // Configurações otimizadas baseadas no dispositivo
  const chartConfig = useMemo(() => ({
    height: isMobile ? 250 : 400,
    margin: isMobile ? { top: 5, right: 5, left: 5, bottom: 5 } : { top: 20, right: 30, left: 20, bottom: 5 },
    animationDuration: isMobile ? 300 : 500,
    strokeWidth: isMobile ? 1 : 2,
    dotSize: isMobile ? 2 : 4,
  }), [isMobile]);
  
  // Simular carregamento
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [debouncedData]);
  
  return {
    optimizedData,
    chartConfig,
    isLoading,
    dataCount: optimizedData.length,
    originalCount: data.length,
  };
};
