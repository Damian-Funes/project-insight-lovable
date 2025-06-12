import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  component: string;
  renderTime: number;
  mountTime: number;
  updateTime?: number;
  timestamp: number;
}

interface PerformanceBudget {
  maxRenderTime: number;
  maxLoadTime: number;
  maxInteractionTime: number;
  maxComponentCount: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxRenderTime: 100, // 100ms
  maxLoadTime: 3000, // 3s
  maxInteractionTime: 50, // 50ms
  maxComponentCount: 100,
};

class PerformanceLogger {
  private static instance: PerformanceLogger;
  private metrics: PerformanceMetrics[] = [];
  private budget: PerformanceBudget = DEFAULT_BUDGET;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceLogger {
    if (!PerformanceLogger.instance) {
      PerformanceLogger.instance = new PerformanceLogger();
    }
    return PerformanceLogger.instance;
  }

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observer para métricas de navegação
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.logNavigationMetrics(entry as PerformanceNavigationTiming);
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);

        // Observer para métricas de recursos
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.logResourceMetrics(entry as PerformanceResourceTiming);
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);

        // Observer para Long Tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.logLongTask(entry);
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Performance Observer não suportado:', error);
      }
    }
  }

  private logNavigationMetrics(entry: PerformanceNavigationTiming) {
    const loadTime = entry.loadEventEnd - entry.startTime;
    const domContentLoadedTime = entry.domContentLoadedEventEnd - entry.startTime;
    
    console.log('📊 Métricas de Navegação:', {
      loadTime: `${loadTime}ms`,
      domContentLoadedTime: `${domContentLoadedTime}ms`,
      dnsLookup: `${entry.domainLookupEnd - entry.domainLookupStart}ms`,
      tcpConnection: `${entry.connectEnd - entry.connectStart}ms`,
      serverResponse: `${entry.responseEnd - entry.requestStart}ms`,
    });

    // Verifica se excedeu o budget
    if (loadTime > this.budget.maxLoadTime) {
      this.triggerAlert('loadTime', loadTime, this.budget.maxLoadTime);
    }
  }

  private logResourceMetrics(entry: PerformanceResourceTiming) {
    const loadTime = entry.responseEnd - entry.startTime;
    
    if (loadTime > 1000) { // Log apenas recursos que demoram mais de 1s
      console.log('📦 Recurso Lento:', {
        name: entry.name,
        loadTime: `${loadTime}ms`,
        size: entry.transferSize || 'unknown',
        type: entry.initiatorType,
      });
    }
  }

  private logLongTask(entry: PerformanceEntry) {
    console.warn('🐌 Long Task Detectada:', {
      duration: `${entry.duration}ms`,
      startTime: `${entry.startTime}ms`,
    });

    if (entry.duration > this.budget.maxInteractionTime) {
      this.triggerAlert('longTask', entry.duration, this.budget.maxInteractionTime);
    }
  }

  logComponentMetrics(metrics: PerformanceMetrics) {
    this.metrics.push(metrics);
    
    console.log('⚛️ Performance do Componente:', {
      component: metrics.component,
      renderTime: `${metrics.renderTime}ms`,
      mountTime: `${metrics.mountTime}ms`,
      updateTime: metrics.updateTime ? `${metrics.updateTime}ms` : 'N/A',
    });

    // Verifica se excedeu o budget de renderização
    if (metrics.renderTime > this.budget.maxRenderTime) {
      this.triggerAlert('renderTime', metrics.renderTime, this.budget.maxRenderTime);
    }

    // Limita o histórico de métricas
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  private triggerAlert(type: string, value: number, budget: number) {
    console.warn(`🚨 Performance Alert: ${type} (${value}ms) excedeu o budget (${budget}ms)`);
    
    // Emite evento customizado para alertas
    window.dispatchEvent(new CustomEvent('performance-alert', {
      detail: { type, value, budget }
    }));
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageRenderTime(component?: string): number {
    const filtered = component 
      ? this.metrics.filter(m => m.component === component)
      : this.metrics;
    
    if (filtered.length === 0) return 0;
    
    const total = filtered.reduce((sum, m) => sum + m.renderTime, 0);
    return total / filtered.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  setBudget(budget: Partial<PerformanceBudget>) {
    this.budget = { ...this.budget, ...budget };
  }

  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const { toast } = useToast();
  const logger = PerformanceLogger.getInstance();

  // Mede o tempo de mount
  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    return () => {
      const mountTime = performance.now() - mountTimeRef.current;
      logger.logComponentMetrics({
        component: componentName,
        renderTime: 0,
        mountTime,
        timestamp: Date.now(),
      });
    };
  }, [componentName, logger]);

  // Hook para medir render time
  const measureRender = useCallback(() => {
    renderStartRef.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      logger.logComponentMetrics({
        component: componentName,
        renderTime,
        mountTime: 0,
        timestamp: Date.now(),
      });
    };
  }, [componentName, logger]);

  // Escuta alertas de performance
  useEffect(() => {
    const handlePerformanceAlert = (event: CustomEvent) => {
      const { type, value, budget } = event.detail;
      
      toast({
        title: "Alerta de Performance",
        description: `${type} (${Math.round(value)}ms) excedeu o budget (${budget}ms)`,
        variant: "destructive",
      });
    };

    window.addEventListener('performance-alert', handlePerformanceAlert as EventListener);
    
    return () => {
      window.removeEventListener('performance-alert', handlePerformanceAlert as EventListener);
    };
  }, [toast]);

  return {
    measureRender,
    getMetrics: () => logger.getMetrics(),
    getAverageRenderTime: (component?: string) => logger.getAverageRenderTime(component),
    clearMetrics: () => logger.clearMetrics(),
    setBudget: (budget: Partial<PerformanceBudget>) => logger.setBudget(budget),
    getBudget: () => logger.getBudget(),
  };
};

export { PerformanceLogger, type PerformanceMetrics, type PerformanceBudget };
