
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";

// IMPORTS DIRETOS para páginas críticas (sem lazy loading)
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Activities from "@/pages/Activities";
import Projects from "@/pages/Projects";
import Areas from "@/pages/Areas";
import NotFound from "@/pages/NotFound";

// GRUPO 1: Páginas operacionais (carregamento conjunto otimizado)
const DashboardOPs = lazy(() => 
  Promise.all([
    import("@/pages/DashboardOPs"),
    import("@/pages/OrdemProducaoManagement"),
    import("@/pages/MinhasTarefas")
  ]).then(([ops]) => ops)
);

const OrdemProducaoManagement = lazy(() => import("@/pages/OrdemProducaoManagement"));
const MinhasTarefas = lazy(() => import("@/pages/MinhasTarefas"));

// GRUPO 2: Páginas administrativas (carregamento conjunto)
const AreaManagement = lazy(() => 
  Promise.all([
    import("@/pages/AreaManagement"),
    import("@/pages/OperationalAlertsManagement"),
    import("@/pages/AlertsConfiguration")
  ]).then(([area]) => area)
);

const OperationalAlertsManagement = lazy(() => import("@/pages/OperationalAlertsManagement"));
const AlertsConfiguration = lazy(() => import("@/pages/AlertsConfiguration"));

// GRUPO 3: Páginas financeiras (carregamento conjunto)
const CostDashboard = lazy(() => 
  Promise.all([
    import("@/pages/CostDashboard"),
    import("@/pages/RevenueManagement"),
    import("@/pages/FinancialProjection")
  ]).then(([cost]) => cost)
);

const RevenueManagement = lazy(() => import("@/pages/RevenueManagement"));
const FinancialProjection = lazy(() => import("@/pages/FinancialProjection"));

// GRUPO 4: Páginas analíticas (menos prioritárias)
const PredictiveModels = lazy(() => import("@/pages/PredictiveModels"));
const ScenarioAnalysis = lazy(() => import("@/pages/ScenarioAnalysis"));
const Reports = lazy(() => import("@/pages/Reports"));
const TvCorporativa = lazy(() => import("@/pages/TvCorporativa"));

// Componente otimizado para rotas lazy
const OptimizedLazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    {children}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas sem lazy loading (críticas) */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/" element={<ProtectedLayout />}>
        {/* Páginas principais - SEM lazy loading */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="activities" element={<Activities />} />
        <Route path="projects" element={<Projects />} />
        <Route path="areas" element={<Areas />} />
        
        {/* Grupo 1: Operacionais - Com lazy loading otimizado */}
        <Route path="dashboard-ops" element={<OptimizedLazyRoute><DashboardOPs /></OptimizedLazyRoute>} />
        <Route path="ordem-producao" element={<OptimizedLazyRoute><OrdemProducaoManagement /></OptimizedLazyRoute>} />
        <Route path="minhas-tarefas" element={<OptimizedLazyRoute><MinhasTarefas /></OptimizedLazyRoute>} />
        
        {/* Grupo 2: Administrativas */}
        <Route path="area-management" element={<OptimizedLazyRoute><AreaManagement /></OptimizedLazyRoute>} />
        <Route path="operational-alerts" element={<OptimizedLazyRoute><OperationalAlertsManagement /></OptimizedLazyRoute>} />
        <Route path="alerts-configuration" element={<OptimizedLazyRoute><AlertsConfiguration /></OptimizedLazyRoute>} />
        
        {/* Grupo 3: Financeiras */}
        <Route path="cost-dashboard" element={<OptimizedLazyRoute><CostDashboard /></OptimizedLazyRoute>} />
        <Route path="revenue-management" element={<OptimizedLazyRoute><RevenueManagement /></OptimizedLazyRoute>} />
        <Route path="financial-projection" element={<OptimizedLazyRoute><FinancialProjection /></OptimizedLazyRoute>} />
        
        {/* Grupo 4: Analíticas (menor prioridade) */}
        <Route path="predictive-models" element={<OptimizedLazyRoute><PredictiveModels /></OptimizedLazyRoute>} />
        <Route path="scenario-analysis" element={<OptimizedLazyRoute><ScenarioAnalysis /></OptimizedLazyRoute>} />
        <Route path="reports" element={<OptimizedLazyRoute><Reports /></OptimizedLazyRoute>} />
        <Route path="tv-corporativa" element={<OptimizedLazyRoute><TvCorporativa /></OptimizedLazyRoute>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
