
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import Auth from "@/pages/Auth";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Areas from "@/pages/Areas";
import AreaManagement from "@/pages/AreaManagement";
import Activities from "@/pages/Activities";
import RevenueManagement from "@/pages/RevenueManagement";
import CostDashboard from "@/pages/CostDashboard";
import FinancialProjection from "@/pages/FinancialProjection";
import ScenarioAnalysis from "@/pages/ScenarioAnalysis";
import AlertsConfiguration from "@/pages/AlertsConfiguration";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip"
import PredictiveModels from "@/pages/PredictiveModels";

function App() {
  const queryClient = new QueryClient();

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
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="areas" element={<Areas />} />
                <Route path="area-management" element={<AreaManagement />} />
                <Route path="activities" element={<Activities />} />
                <Route path="revenue-management" element={<RevenueManagement />} />
                <Route path="cost-dashboard" element={<CostDashboard />} />
                <Route path="financial-projection" element={<FinancialProjection />} />
                <Route path="scenario-analysis" element={<ScenarioAnalysis />} />
                <Route path="predictive-models" element={<PredictiveModels />} />
                <Route path="alerts-configuration" element={<AlertsConfiguration />} />
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
