
import { useEffect } from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VisualIdentityGuard } from "@/components/VisualIdentityGuard";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check for pending alerts when user logs in
  useEffect(() => {
    if (user) {
      const checkPendingAlerts = async () => {
        try {
          await supabase.rpc('check_pending_alerts_on_login', { user_id: user.id });
        } catch (error) {
          console.error('Error checking pending alerts:', error);
        }
      };
      
      checkPendingAlerts();
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
            {/* Header */}
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
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};
