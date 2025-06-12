
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Projects from "./pages/Projects";
import Areas from "./pages/Areas";
import AreaManagement from "./pages/AreaManagement";
import Reports from "./pages/Reports";
import CostDashboard from "./pages/CostDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/area-management" element={<AreaManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/cost-dashboard" element={<CostDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
