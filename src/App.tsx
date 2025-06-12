
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppRoutes } from "@/components/app/AppRoutes";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";
import { PerformanceMonitor } from "@/components/dev/PerformanceMonitor";

// Configuração otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <PerformanceProvider 
        enabled={process.env.NODE_ENV === 'development'}
        budget={{
          maxRenderTime: 100,
          maxLoadTime: 3000,
          maxInteractionTime: 50,
          maxComponentCount: 100,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <GlobalStateProvider>
                <TooltipProvider>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <AppRoutes />
                  </Suspense>
                  <Toaster />
                  <Sonner />
                  {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
                </TooltipProvider>
              </GlobalStateProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </PerformanceProvider>
    </ErrorBoundary>
  );
}

export default App;
