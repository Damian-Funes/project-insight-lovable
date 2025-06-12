
// Sistema de preload inteligente para chunks críticos
class ChunkPreloader {
  private preloadedChunks = new Set<string>();
  private observer?: IntersectionObserver;

  constructor() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const preloadRoute = target.dataset.preloadRoute;
            if (preloadRoute) {
              this.preloadRoute(preloadRoute);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  // Preload de rota específica
  async preloadRoute(routeName: string) {
    if (this.preloadedChunks.has(routeName)) {
      return;
    }

    this.preloadedChunks.add(routeName);

    try {
      // Mapeamento de rotas para imports dinâmicos
      const routeImports: Record<string, () => Promise<any>> = {
        dashboard: () => import('@/pages/Dashboard'),
        'dashboard-ops': () => import('@/pages/DashboardOPs'),
        activities: () => import('@/pages/Activities'),
        projects: () => import('@/pages/Projects'),
        areas: () => import('@/pages/Areas'),
        'area-management': () => import('@/pages/AreaManagement'),
        'tv-corporativa': () => import('@/pages/TvCorporativa'),
        reports: () => import('@/pages/Reports'),
        'cost-dashboard': () => import('@/pages/CostDashboard'),
        'revenue-management': () => import('@/pages/RevenueManagement'),
        'financial-projection': () => import('@/pages/FinancialProjection'),
        'predictive-models': () => import('@/pages/PredictiveModels'),
        'scenario-analysis': () => import('@/pages/ScenarioAnalysis'),
        'alerts-configuration': () => import('@/pages/AlertsConfiguration'),
        'operational-alerts': () => import('@/pages/OperationalAlertsManagement'),
        'ordem-producao': () => import('@/pages/OrdemProducaoManagement'),
        'minhas-tarefas': () => import('@/pages/MinhasTarefas'),
      };

      const importFunction = routeImports[routeName];
      if (importFunction) {
        await importFunction();
        console.log(`✅ Chunk preloaded: ${routeName}`);
      }
    } catch (error) {
      console.warn(`❌ Failed to preload chunk: ${routeName}`, error);
      this.preloadedChunks.delete(routeName);
    }
  }

  // Preload de chunks críticos baseado na rota atual
  preloadCriticalChunks(currentRoute: string) {
    const criticalChunks: Record<string, string[]> = {
      '/': ['dashboard', 'activities'],
      '/dashboard': ['cost-dashboard', 'activities'],
      '/dashboard-ops': ['activities', 'ordem-producao'],
      '/activities': ['projects', 'areas'],
      '/projects': ['activities', 'cost-dashboard'],
      '/areas': ['activities', 'area-management'],
      '/cost-dashboard': ['revenue-management', 'financial-projection'],
      '/predictive-models': ['scenario-analysis', 'financial-projection'],
    };

    const chunksToPreload = criticalChunks[currentRoute] || [];
    chunksToPreload.forEach(chunk => {
      // Delay para não bloquear a renderização inicial
      setTimeout(() => this.preloadRoute(chunk), 1000);
    });
  }

  // Preload baseado em hover (para navegação)
  preloadOnHover(element: HTMLElement, routeName: string) {
    let timeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      timeout = setTimeout(() => {
        this.preloadRoute(routeName);
      }, 100); // 100ms de delay para evitar preloads desnecessários
    };

    const handleMouseLeave = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }

  // Observar elemento para preload quando visível
  observeForPreload(element: HTMLElement, routeName: string) {
    if (!this.observer) return;

    element.dataset.preloadRoute = routeName;
    this.observer.observe(element);

    return () => {
      if (this.observer) {
        this.observer.unobserve(element);
      }
    };
  }

  // Preload de dependências baseado na priority
  async preloadDependencies(priority: 'high' | 'medium' | 'low' = 'medium') {
    const dependencies = {
      high: [
        // Componentes UI críticos
        () => import('@/components/ui/button'),
        () => import('@/components/ui/card'),
        () => import('@/components/ui/table'),
      ],
      medium: [
        // Charts e visualizações
        () => import('@/components/charts/OptimizedAreaChart'),
        () => import('@/components/charts/OptimizedBarChart'),
        () => import('@/components/charts/OptimizedLineChart'),
      ],
      low: [
        // Componentes menos críticos
        () => import('@/components/charts/OptimizedPieChart'),
        () => import('@/components/ui/tooltip'),
        () => import('@/components/ui/popover'),
      ],
    };

    const depsToLoad = dependencies[priority] || [];
    
    for (const dep of depsToLoad) {
      try {
        await dep();
      } catch (error) {
        console.warn('Failed to preload dependency:', error);
      }
    }
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.preloadedChunks.clear();
  }
}

// Instância singleton
export const chunkPreloader = new ChunkPreloader();

// Hook para usar o preloader
export const useChunkPreloader = () => {
  return {
    preloadRoute: (route: string) => chunkPreloader.preloadRoute(route),
    preloadCriticalChunks: (currentRoute: string) => 
      chunkPreloader.preloadCriticalChunks(currentRoute),
    preloadOnHover: (element: HTMLElement, route: string) => 
      chunkPreloader.preloadOnHover(element, route),
    observeForPreload: (element: HTMLElement, route: string) => 
      chunkPreloader.observeForPreload(element, route),
    preloadDependencies: (priority?: 'high' | 'medium' | 'low') => 
      chunkPreloader.preloadDependencies(priority),
  };
};
