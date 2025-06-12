
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

// Lazy loading otimizado - páginas financeiras
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const CostDashboard = React.lazy(() => import("@/pages/CostDashboard"));
const FinancialProjection = React.lazy(() => import("@/pages/FinancialProjection"));

// Páginas de gestão - import direto
const Areas = React.lazy(() => import("@/pages/Areas"));
const AreaManagement = React.lazy(() => import("@/pages/AreaManagement"));
const RevenueManagement = React.lazy(() => import("@/pages/RevenueManagement"));
const ScenarioAnalysis = React.lazy(() => import("@/pages/ScenarioAnalysis"));
const Reports = React.lazy(() => import("@/pages/Reports"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Diferentes skeletons para diferentes tipos de página
const DashboardLoader = () => <DashboardSkeleton />;
const TableLoader = () => (
  <div className="p-6">
    <TableSkeleton />
  </div>
);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
        retry: 1, // Reduzir tentativas para melhor UX
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
                  path="areas" 
                  element={
                    <Suspense fallback={<TableLoader />}>
                      <Areas />
                    </Suspense>
                  } 
                />
                <Route 
                  path="area-management" 
                  element={
                    <Suspense fallback={<TableLoader />}>
                      <AreaManagement />
                    </Suspense>
                  } 
                />
                <Route 
                  path="revenue-management" 
                  element={
                    <Suspense fallback={<TableLoader />}>
                      <RevenueManagement />
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
                <Route 
                  path="reports" 
                  element={
                    <Suspense fallback={<TableLoader />}>
                      <Reports />
                    </Suspense>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <Suspense fallback={<TableLoader />}>
                      <NotFound />
                    </Suspense>
                  } 
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
