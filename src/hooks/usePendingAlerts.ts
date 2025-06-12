
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePendingAlerts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Mutation para executar verificação manual de alertas pendentes
  const triggerPendingCheck = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      
      const { error } = await supabase.rpc('check_pending_alerts_on_login', {
        user_id: user.id
      });
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidar queries de notificações para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  // Mutation para executar verificação geral de registros pendentes
  const checkAllPendingActivities = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('check_pending_activity_alerts');
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidar queries de notificações para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  return {
    triggerPendingCheck,
    checkAllPendingActivities,
  };
};
