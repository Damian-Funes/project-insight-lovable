
import { Suspense, lazy, ComponentType } from 'react';
import { OptimizedLoadingSpinner } from '@/components/OptimizedLoadingSpinner';

// Lazy loading dos componentes de gráfico com preload inteligente
const LazyOptimizedAreaChart = lazy(() => 
  import('./OptimizedAreaChart').then(module => {
    // Preload outros charts relacionados
    setTimeout(() => {
      import('./OptimizedLineChart');
      import('./OptimizedBarChart');
    }, 100);
    return { default: module.OptimizedAreaChart };
  })
);

const LazyOptimizedBarChart = lazy(() => 
  import('./OptimizedBarChart').then(module => {
    setTimeout(() => {
      import('./OptimizedAreaChart');
      import('./OptimizedLineChart');
    }, 100);
    return { default: module.OptimizedBarChart };
  })
);

const LazyOptimizedLineChart = lazy(() => 
  import('./OptimizedLineChart').then(module => {
    setTimeout(() => {
      import('./OptimizedAreaChart');
      import('./OptimizedBarChart');
    }, 100);
    return { default: module.OptimizedLineChart };
  })
);

const LazyOptimizedPieChart = lazy(() => 
  import('./OptimizedPieChart').then(module => {
    return { default: module.OptimizedPieChart };
  })
);

// HOC para envolver charts com Suspense
function withLazyChart<T extends object>(Component: ComponentType<T>) {
  return function LazyChartWrapper(props: T) {
    return (
      <Suspense fallback={<OptimizedLoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Exports dos componentes lazy
export const LazyAreaChart = withLazyChart(LazyOptimizedAreaChart);
export const LazyBarChart = withLazyChart(LazyOptimizedBarChart);
export const LazyLineChart = withLazyChart(LazyOptimizedLineChart);
export const LazyPieChart = withLazyChart(LazyOptimizedPieChart);

// Hook para preload de charts específicos
export const useChartPreloader = () => {
  const preloadChart = async (chartType: 'area' | 'bar' | 'line' | 'pie') => {
    const importMap = {
      area: () => import('./OptimizedAreaChart'),
      bar: () => import('./OptimizedBarChart'),
      line: () => import('./OptimizedLineChart'),
      pie: () => import('./OptimizedPieChart'),
    };

    try {
      await importMap[chartType]();
      console.log(`📊 Chart preloaded: ${chartType}`);
    } catch (error) {
      console.warn(`Failed to preload chart: ${chartType}`, error);
    }
  };

  const preloadAllCharts = async () => {
    const charts: Array<'area' | 'bar' | 'line' | 'pie'> = ['area', 'bar', 'line', 'pie'];
    
    for (const chart of charts) {
      await preloadChart(chart);
      // Pequeno delay entre preloads para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  return { preloadChart, preloadAllCharts };
};
