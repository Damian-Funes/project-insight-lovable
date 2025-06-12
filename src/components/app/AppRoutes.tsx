
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Lazy loading otimizado com prefetch hints
const Dashboard = lazy(() => 
  import("@/pages/Dashboard").then(module => {
    // Preload relacionados após carregamento
    setTimeout(() => {
      import("@/pages/CostDashboard");
      import("@/pages/Activities");
    }, 100);
    return module;
  })
);

const DashboardOPs = lazy(() => 
  import("@/pages/DashboardOPs").then(module => {
    setTimeout(() => {
      import("@/pages/Activities");
      import("@/pages/OrdemProducaoManagement");
    }, 100);
    return module;
  })
);

const Activities = lazy(() => 
  import("@/pages/Activities").then(module => {
    setTimeout(() => {
      import("@/pages/Projects");
      import("@/pages/Areas");
    }, 100);
    return module;
  })
);

const Projects = lazy(() => 
  import("@/pages/Projects").then(module => {
    setTimeout(() => {
      import("@/pages/CostDashboard");
    }, 100);
    return module;
  })
);

const Areas = lazy(() => import("@/pages/Areas"));
const AreaManagement = lazy(() => import("@/pages/AreaManagement"));
const TvCorporativa = lazy(() => import("@/pages/TvCorporativa"));
const Reports = lazy(() => import("@/pages/Reports"));

const CostDashboard = lazy(() => 
  import("@/pages/CostDashboard").then(module => {
    setTimeout(() => {
      import("@/pages/RevenueManagement");
      import("@/pages/FinancialProjection");
    }, 100);
    return module;
  })
);

const RevenueManagement = lazy(() => import("@/pages/RevenueManagement"));
const FinancialProjection = lazy(() => import("@/pages/FinancialProjection"));

const PredictiveModels = lazy(() => 
  import("@/pages/PredictiveModels").then(module => {
    setTimeout(() => {
      import("@/pages/ScenarioAnalysis");
    }, 100);
    return module;
  })
);

const ScenarioAnalysis = lazy(() => import("@/pages/ScenarioAnalysis"));
const AlertsConfiguration = lazy(() => import("@/pages/AlertsConfiguration"));
const OperationalAlertsManagement = lazy(() => import("@/pages/OperationalAlertsManagement"));
const OrdemProducaoManagement = lazy(() => import("@/pages/OrdemProducaoManagement"));
const MinhasTarefas = lazy(() => import("@/pages/MinhasTarefas"));

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    {children}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas - não lazy para melhor performance inicial */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Rotas protegidas com lazy loading otimizado */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route 
          path="dashboard" 
          element={<LazyRoute><Dashboard /></LazyRoute>} 
        />
        <Route 
          path="dashboard-ops" 
          element={<LazyRoute><DashboardOPs /></LazyRoute>} 
        />
        <Route 
          path="activities" 
          element={<LazyRoute><Activities /></LazyRoute>} 
        />
        <Route 
          path="projects" 
          element={<LazyRoute><Projects /></LazyRoute>} 
        />
        <Route 
          path="areas" 
          element={<LazyRoute><Areas /></LazyRoute>} 
        />
        <Route 
          path="area-management" 
          element={<LazyRoute><AreaManagement /></LazyRoute>} 
        />
        <Route 
          path="minhas-tarefas" 
          element={<LazyRoute><MinhasTarefas /></LazyRoute>} 
        />
        <Route 
          path="tv-corporativa" 
          element={<LazyRoute><TvCorporativa /></LazyRoute>} 
        />
        <Route 
          path="reports" 
          element={<LazyRoute><Reports /></LazyRoute>} 
        />
        <Route 
          path="cost-dashboard" 
          element={<LazyRoute><CostDashboard /></LazyRoute>} 
        />
        <Route 
          path="revenue-management" 
          element={<LazyRoute><RevenueManagement /></LazyRoute>} 
        />
        <Route 
          path="financial-projection" 
          element={<LazyRoute><FinancialProjection /></LazyRoute>} 
        />
        <Route 
          path="predictive-models" 
          element={<LazyRoute><PredictiveModels /></LazyRoute>} 
        />
        <Route 
          path="scenario-analysis" 
          element={<LazyRoute><ScenarioAnalysis /></LazyRoute>} 
        />
        <Route 
          path="alerts-configuration" 
          element={<LazyRoute><AlertsConfiguration /></LazyRoute>} 
        />
        <Route 
          path="operational-alerts" 
          element={<LazyRoute><OperationalAlertsManagement /></LazyRoute>} 
        />
        <Route 
          path="ordem-producao" 
          element={<LazyRoute><OrdemProducaoManagement /></LazyRoute>} 
        />
      </Route>
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
