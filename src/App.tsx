
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from "@/pages/Auth";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import Index from "@/pages/Index";
import { DashboardSkeleton, TableSkeleton } from "@/components/ui/optimized-loading";

// Lazy loading otimizado - apenas páginas pesadas
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const CostDashboard = React.lazy(() => import("@/pages/CostDashboard"));
const FinancialProjection = React.lazy(() => import("@/pages/FinancialProjection"));
const ScenarioAnalysis = React.lazy(() => import("@/pages/ScenarioAnalysis"));

// Páginas leves - import direto para melhor performance
import Areas from "@/pages/Areas";
import AreaManagement from "@/pages/AreaManagement";
import RevenueManagement from "@/pages/RevenueManagement";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

// Diferentes skeletons otimizados
const DashboardLoader = () => <DashboardSkeleton />;
const TableLoader = () => (
  <div className="p-4">
    <TableSkeleton />
  </div>
);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 minutos - mais agressivo
        gcTime: 30 * 60 * 1000, // 30 minutos
        refetchOnWindowFocus: false,
        retry: 1,
        // Preload estratégico para dados frequentemente acessados
        refetchOnMount: false,
      },
    },
  });

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Index />} />
                <Route 
                  path="dashboard" 
                  element={
                    <Suspense fallback={<DashboardLoader />}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="cost-dashboard" 
                  element={
                    <Suspense fallback={<DashboardLoader />}>
                      <CostDashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="financial-projection" 
                  element={
                    <Suspense fallback={<DashboardLoader />}>
                      <FinancialProjection />
                    </Suspense>
                  } 
                />
                <Route 
                  path="scenario-analysis" 
                  element={
                    <Suspense fallback={<DashboardLoader />}>
                      <ScenarioAnalysis />
                    </Suspense>
                  } 
                />
                {/* Páginas leves sem lazy loading */}
                <Route path="areas" element={<Areas />} />
                <Route path="area-management" element={<AreaManagement />} />
                <Route path="revenue-management" element={<RevenueManagement />} />
                <Route path="reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
