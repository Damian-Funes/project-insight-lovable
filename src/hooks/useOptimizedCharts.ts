
import { useMemo } from 'react';

interface ChartData {
  [key: string]: any;
}

interface UseOptimizedChartsProps {
  data: ChartData[];
  maxDataPoints: number;
  isMobile: boolean;
}

interface ChartConfig {
  height: number;
  margin: { top: number; right: number; left: number; bottom: number };
  strokeWidth: number;
  dotSize: number;
  animationDuration: number;
}

export const useOptimizedCharts = ({
  data,
  maxDataPoints,
  isMobile,
}: UseOptimizedChartsProps) => {
  const optimizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Se há poucos dados, retornar todos
    if (data.length <= maxDataPoints) {
      return data;
    }

    // Para datasets grandes, fazer sampling inteligente
    const step = Math.ceil(data.length / maxDataPoints);
    const sampled: ChartData[] = [];
    
    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }
    
    // Sempre incluir o último ponto se não foi incluído
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }
    
    return sampled;
  }, [data, maxDataPoints]);

  const chartConfig: ChartConfig = useMemo(() => ({
    height: isMobile ? 200 : 300,
    margin: isMobile 
      ? { top: 10, right: 20, left: 10, bottom: 20 }
      : { top: 20, right: 30, left: 20, bottom: 20 },
    strokeWidth: isMobile ? 1.5 : 2,
    dotSize: isMobile ? 2 : 3,
    animationDuration: 300, // Reduzido para melhor performance
  }), [isMobile]);

  const isLoading = useMemo(() => {
    return !data || data.length === 0;
  }, [data]);

  return {
    optimizedData,
    chartConfig,
    isLoading,
  };
};
