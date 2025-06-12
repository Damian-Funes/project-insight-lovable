
import { AppProviders } from "@/components/app/AppProviders";
import { AppRoutes } from "@/components/app/AppRoutes";
import { CacheMonitor } from "@/components/dev/CacheMonitor";
import { queryClient } from "@/config/queryClient";

function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <AppRoutes />
      <CacheMonitor />
    </AppProviders>
  );
}

export default App;
