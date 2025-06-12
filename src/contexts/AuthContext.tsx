
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nomeCompleto: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função não-bloqueante para verificar alertas pendentes
  const checkPendingAlertsAsync = async (userId: string) => {
    try {
      console.log('Verificando alertas pendentes em background para:', userId);
      const { error } = await supabase.rpc('check_pending_alerts_on_login', {
        user_id: userId
      });
      
      if (error) {
        console.error('Erro ao verificar alertas pendentes:', error);
      } else {
        console.log('Verificação de alertas pendentes executada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao executar verificação de alertas:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Configurar listener primeiro
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth state changed:', event, !!session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Verificar alertas pendentes em background (não-bloqueante)
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          checkPendingAlertsAsync(session.user.id);
        }, 100);
      }
    });

    // Verificar sessão inicial com timeout
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('Erro ao obter sessão:', error);
        }

        setUser(session?.user ?? null);
        
        // Se há usuário logado, verificar alertas em background
        if (session?.user) {
          setTimeout(() => {
            checkPendingAlertsAsync(session.user.id);
          }, 100);
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Timeout de segurança para evitar carregamento infinito
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Timeout na autenticação - definindo loading como false');
        setLoading(false);
      }
    }, 5000);

    initAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nome_completo: nomeCompleto,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
