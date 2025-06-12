
import { useEffect, memo, useCallback } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VisualIdentityGuard } from "@/components/VisualIdentityGuard";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/useAppStore";

// Componente memoizado para o header
const MemoizedHeader = memo(({ 
  user, 
  onSignOut 
}: { 
  user: any; 
  onSignOut: () => void; 
}) => (
  <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
    <div className="flex h-16 items-center px-4 gap-4">
      <SidebarTrigger />
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </header>
));

MemoizedHeader.displayName = 'MemoizedHeader';

// Componente memoizado para loading
const MemoizedLoading = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner text="Carregando..." />
  </div>
));

MemoizedLoading.displayName = 'MemoizedLoading';

export const ProtectedLayout = memo(() => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

  // Atualizar rota atual no store
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  // Log para debug (memoizado)
  useEffect(() => {
    console.log('ProtectedLayout - Auth state:', { 
      user: !!user, 
      loading, 
      path: location.pathname 
    });
  }, [user, loading, location.pathname]);

  // Handler memoizado para sign out
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <MemoizedLoading />;
  }

  // Redirecionar para auth se não autenticado
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <VisualIdentityGuard />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <MemoizedHeader user={user} onSignOut={handleSignOut} />
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
});

ProtectedLayout.displayName = 'ProtectedLayout';
