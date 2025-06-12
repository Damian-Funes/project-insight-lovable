
import { Suspense } from "react";
import { AppProvider } from "@/providers/AppProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRoutes } from "@/components/app/AppRoutes";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";
import { PerformanceMonitor } from "@/components/dev/PerformanceMonitor";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Suspense fallback={<PageLoadingFallback />}>
          <AppRoutes />
        </Suspense>
        {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
