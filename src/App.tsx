
import { AppProviders } from "@/components/app/AppProviders";
import { AppRoutes } from "@/components/app/AppRoutes";
import { CacheMonitor } from "@/components/dev/CacheMonitor";
import { useRoutePrefetching } from "@/hooks/useRoutePrefetching";
import { queryClient } from "@/config/queryClient";

function AppContent() {
  useRoutePrefetching();
  
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
