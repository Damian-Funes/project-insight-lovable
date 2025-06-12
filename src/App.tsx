import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Auth } from "@/pages/Auth";
import { Index } from "@/pages";
import { Projects } from "@/pages/Projects";
import { Areas } from "@/pages/Areas";
import { Activities } from "@/pages/Activities";
import { Reports } from "@/pages/Reports";
import { CostDashboard } from "@/pages/CostDashboard";
import { AreaManagement } from "@/pages/AreaManagement";
import { NotFound } from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Revenues from "@/pages/Revenues";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <div className="p-6">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    <Route path="/areas" element={
                      <ProtectedRoute>
                        <Areas />
                      </ProtectedRoute>
                    } />
                    <Route path="/activities" element={
                      <ProtectedRoute>
                        <Activities />
                      </ProtectedRoute>
                    } />
                    <Route path="/revenues" element={
                      <ProtectedRoute>
                        <Revenues />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/cost-dashboard" element={
                      <ProtectedRoute>
                        <CostDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/area-management" element={
                      <ProtectedRoute>
                        <AreaManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
