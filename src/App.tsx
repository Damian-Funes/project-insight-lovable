
import { AppProviders } from "@/components/app/AppProviders";
import { AppRoutes } from "@/components/app/AppRoutes";
import { queryClient } from "@/config/queryClient";

function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
