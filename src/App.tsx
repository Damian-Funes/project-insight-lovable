
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import Auth from "@/pages/Auth";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import Index from "@/pages/Index";
import { Loader2 } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip"

// Lazy loading para páginas pesadas
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Projects = React.lazy(() => import("@/pages/Projects"));
const Areas = React.lazy(() => import("@/pages/Areas"));
const AreaManagement = React.lazy(() => import("@/pages/AreaManagement"));
const Activities = React.lazy(() => import("@/pages/Activities"));
const RevenueManagement = React.lazy(() => import("@/pages/RevenueManagement"));
const CostDashboard = React.lazy(() => import("@/pages/CostDashboard"));
const FinancialProjection = React.lazy(() => import("@/pages/FinancialProjection"));
const ScenarioAnalysis = React.lazy(() => import("@/pages/ScenarioAnalysis"));
const AlertsConfiguration = React.lazy(() => import("@/pages/AlertsConfiguration"));
const Reports = React.lazy(() => import("@/pages/Reports"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const PredictiveModels = React.lazy(() => import("@/pages/PredictiveModels"));

// Componente de loading personalizado
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Carregando...</span>
    </div>
  </div>
);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
      },
    },
  });

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedLayout />}>
                  <Route index element={<Index />} />
                  <Route 
                    path="dashboard" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="projects" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Projects />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="areas" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Areas />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="area-management" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AreaManagement />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="activities" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Activities />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="revenue-management" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <RevenueManagement />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="cost-dashboard" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <CostDashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="financial-projection" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <FinancialProjection />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="scenario-analysis" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ScenarioAnalysis />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="predictive-models" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PredictiveModels />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="alerts-configuration" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AlertsConfiguration />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="reports" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Reports />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
