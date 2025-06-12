
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Projects from "./pages/Projects";
import Areas from "./pages/Areas";
import AreaManagement from "./pages/AreaManagement";
import TvCorporativa from "./pages/TvCorporativa";
import Reports from "./pages/Reports";
import CostDashboard from "./pages/CostDashboard";
import RevenueManagement from "./pages/RevenueManagement";
import FinancialProjection from "./pages/FinancialProjection";
import PredictiveModels from "./pages/PredictiveModels";
import ScenarioAnalysis from "./pages/ScenarioAnalysis";
import AlertsConfiguration from "./pages/AlertsConfiguration";
import OperationalAlertsManagement from "./pages/OperationalAlertsManagement";
import OrdemProducaoManagement from "./pages/OrdemProducaoManagement";
import NotFound from "./pages/NotFound";

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
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Todas as rotas protegidas usam o ProtectedLayout */}
              <Route path="/" element={<ProtectedLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="activities" element={<Activities />} />
                <Route path="projects" element={<Projects />} />
                <Route path="areas" element={<Areas />} />
                <Route path="area-management" element={<AreaManagement />} />
                <Route path="tv-corporativa" element={<TvCorporativa />} />
                <Route path="reports" element={<Reports />} />
                <Route path="cost-dashboard" element={<CostDashboard />} />
                <Route path="revenue-management" element={<RevenueManagement />} />
                <Route path="financial-projection" element={<FinancialProjection />} />
                <Route path="predictive-models" element={<PredictiveModels />} />
                <Route path="scenario-analysis" element={<ScenarioAnalysis />} />
                <Route path="alerts-configuration" element={<AlertsConfiguration />} />
                <Route path="operational-alerts" element={<OperationalAlertsManagement />} />
                <Route path="ordem-producao" element={<OrdemProducaoManagement />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
