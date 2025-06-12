
import { AppProvider } from "@/providers/AppProvider";
import { AppRoutes } from "@/components/app/AppRoutes";

function App() {
  console.log('App iniciando...');
  
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
