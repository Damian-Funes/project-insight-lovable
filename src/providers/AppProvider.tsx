
import React, { memo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// QueryClient otimizado e memoizado
const createOptimizedQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Memoizar o QueryClient para evitar recriação
const queryClient = createOptimizedQueryClient();

// Performance Provider memoizado
const MemoizedPerformanceProvider = memo(({ children }: { children: React.ReactNode }) => (
  <PerformanceProvider 
    enabled={process.env.NODE_ENV === 'development'}
    budget={{
      maxRenderTime: 50,
      maxLoadTime: 1500,
      maxInteractionTime: 50,
      maxComponentCount: 100,
    }}
  >
    {children}
  </PerformanceProvider>
));

MemoizedPerformanceProvider.displayName = 'MemoizedPerformanceProvider';

// Auth Provider memoizado
const MemoizedAuthProvider = memo(({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
));

MemoizedAuthProvider.displayName = 'MemoizedAuthProvider';

// Global State Provider memoizado
const MemoizedGlobalStateProvider = memo(({ children }: { children: React.ReactNode }) => (
  <GlobalStateProvider>{children}</GlobalStateProvider>
));

MemoizedGlobalStateProvider.displayName = 'MemoizedGlobalStateProvider';

// Tooltip Provider memoizado
const MemoizedTooltipProvider = memo(({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
));

MemoizedTooltipProvider.displayName = 'MemoizedTooltipProvider';

// Toasters memoizados
const MemoizedToasters = memo(() => (
  <>
    <Toaster />
    <Sonner />
  </>
));

MemoizedToasters.displayName = 'MemoizedToasters';

// Provider consolidado principal
export const AppProvider = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <MemoizedPerformanceProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MemoizedAuthProvider>
            <MemoizedGlobalStateProvider>
              <MemoizedTooltipProvider>
                {children}
                <MemoizedToasters />
              </MemoizedTooltipProvider>
            </MemoizedGlobalStateProvider>
          </MemoizedAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </MemoizedPerformanceProvider>
  );
});

AppProvider.displayName = 'AppProvider';
