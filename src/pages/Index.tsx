
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Index page - Auth state:', { user: !!user, loading });
  }, [user, loading]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Verificando autenticação..." />
      </div>
    );
  }

  // Se usuário está autenticado, redirecionar para dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não está autenticado, redirecionar para auth
  return <Navigate to="/auth" replace />;
};

export default Index;
