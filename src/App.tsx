
import { Suspense } from "react";
import { AppProvider } from "@/providers/AppProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppRoutes } from "@/components/app/AppRoutes";
import { PageLoadingFallback } from "@/components/PageLoadingFallback";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Suspense fallback={<PageLoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
