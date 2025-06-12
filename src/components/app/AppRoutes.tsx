
import { Routes, Route } from "react-router-dom";
import { ProtectedLayout } from "@/components/ProtectedLayout";

// IMPORTS DIRETOS - sem lazy loading para evitar problemas
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Activities from "@/pages/Activities";
import Projects from "@/pages/Projects";
import Areas from "@/pages/Areas";
import TvCorporativa from "@/pages/TvCorporativa";
import NotFound from "@/pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="activities" element={<Activities />} />
        <Route path="projects" element={<Projects />} />
        <Route path="areas" element={<Areas />} />
        <Route path="tv-corporativa" element={<TvCorporativa />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
