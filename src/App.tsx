
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

// Configuração otimizada do QueryClient com cache agressivo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutos (aumentado drasticamente)
      gcTime: 30 * 60 * 1000, // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Desabilitado para evitar requests desnecessários
      refetchOnMount: false, // Usar cache primeiro
    },
    mutations: {
      retry: 0, // Sem retry para mutations para performance
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <PerformanceProvider 
        enabled={process.env.NODE_ENV === 'development'}
        budget={{
          maxRenderTime: 50, // Reduzido para 50ms
          maxLoadTime: 1500, // Meta agressiva de 1.5s
          maxInteractionTime: 50, // Reduzido para 50ms
          maxComponentCount: 100, // Reduzido para forçar otimização
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
