
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";
import { Suspense, lazy } from "react";

// Importações diretas (sem lazy loading) para páginas essenciais
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loading para todas as outras páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardOPs = lazy(() => import("./pages/DashboardOPs"));
const Activities = lazy(() => import("./pages/Activities"));
const Projects = lazy(() => import("./pages/Projects"));
const Areas = lazy(() => import("./pages/Areas"));
const AreaManagement = lazy(() => import("./pages/AreaManagement"));
const TvCorporativa = lazy(() => import("./pages/TvCorporativa"));
const Reports = lazy(() => import("./pages/Reports"));
const CostDashboard = lazy(() => import("./pages/CostDashboard"));
const RevenueManagement = lazy(() => import("./pages/RevenueManagement"));
const FinancialProjection = lazy(() => import("./pages/FinancialProjection"));
const PredictiveModels = lazy(() => import("./pages/PredictiveModels"));
const ScenarioAnalysis = lazy(() => import("./pages/ScenarioAnalysis"));
const AlertsConfiguration = lazy(() => import("./pages/AlertsConfiguration"));
const OperationalAlertsManagement = lazy(() => import("./pages/OperationalAlertsManagement"));
const OrdemProducaoManagement = lazy(() => import("./pages/OrdemProducaoManagement"));
const MinhasTarefas = lazy(() => import("./pages/MinhasTarefas"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas sem lazy loading */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Todas as rotas protegidas com lazy loading */}
              <Route path="/" element={<ProtectedLayout />}>
                <Route 
                  path="dashboard" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="dashboard-ops" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardOPs />
                    </Suspense>
                  } 
                />
                <Route 
                  path="activities" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Activities />
                    </Suspense>
                  } 
                />
                <Route 
                  path="projects" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Projects />
                    </Suspense>
                  } 
                />
                <Route 
                  path="areas" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Areas />
                    </Suspense>
                  } 
                />
                <Route 
                  path="area-management" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <AreaManagement />
                    </Suspense>
                  } 
                />
                <Route 
                  path="minhas-tarefas" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <MinhasTarefas />
                    </Suspense>
                  } 
                />
                <Route 
                  path="tv-corporativa" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <TvCorporativa />
                    </Suspense>
                  } 
                />
                <Route 
                  path="reports" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Reports />
                    </Suspense>
                  } 
                />
                <Route 
                  path="cost-dashboard" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <CostDashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="revenue-management" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <RevenueManagement />
                    </Suspense>
                  } 
                />
                <Route 
                  path="financial-projection" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <FinancialProjection />
                    </Suspense>
                  } 
                />
                <Route 
                  path="predictive-models" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <PredictiveModels />
                    </Suspense>
                  } 
                />
                <Route 
                  path="scenario-analysis" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <ScenarioAnalysis />
                    </Suspense>
                  } 
                />
                <Route 
                  path="alerts-configuration" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <AlertsConfiguration />
                    </Suspense>
                  } 
                />
                <Route 
                  path="operational-alerts" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <OperationalAlertsManagement />
                    </Suspense>
                  } 
                />
                <Route 
                  path="ordem-producao" 
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <OrdemProducaoManagement />
                    </Suspense>
                  } 
                />
              </Route>
              
              {/* Rota 404 sem lazy loading */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
