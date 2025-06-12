
import { AppProviders } from "@/components/app/AppProviders";
import { AppRoutes } from "@/components/app/AppRoutes";
import { CacheMonitor } from "@/components/dev/CacheMonitor";
import { useOptimizedRoutePrefetching } from "@/hooks/useOptimizedRoutePrefetching";
import { queryClient } from "@/config/queryClient";

function AppContent() {
  useOptimizedRoutePrefetching();
  
  return (
    <>
      <AppRoutes />
      <CacheMonitor />
    </>
  );
}

function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <AppContent />
    </AppProviders>
  );
}

export default App;
