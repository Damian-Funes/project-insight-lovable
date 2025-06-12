
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/areas" element={<ProtectedRoute><Areas /></ProtectedRoute>} />
                <Route path="/area-management" element={<ProtectedRoute><AreaManagement /></ProtectedRoute>} />
                <Route path="/tv-corporativa" element={<ProtectedRoute><TvCorporativa /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/cost-dashboard" element={<ProtectedRoute><CostDashboard /></ProtectedRoute>} />
                <Route path="/revenue-management" element={<ProtectedRoute><RevenueManagement /></ProtectedRoute>} />
                <Route path="/financial-projection" element={<ProtectedRoute><FinancialProjection /></ProtectedRoute>} />
                <Route path="/predictive-models" element={<ProtectedRoute><PredictiveModels /></ProtectedRoute>} />
                <Route path="/scenario-analysis" element={<ProtectedRoute><ScenarioAnalysis /></ProtectedRoute>} />
                <Route path="/alerts-configuration" element={<ProtectedRoute><AlertsConfiguration /></ProtectedRoute>} />
                <Route path="/operational-alerts" element={<ProtectedRoute><OperationalAlertsManagement /></ProtectedRoute>} />
                <Route path="/ordem-producao" element={<ProtectedRoute><OrdemProducaoManagement /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
