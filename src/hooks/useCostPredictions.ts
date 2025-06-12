
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useCostPredictions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: predictions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cost-predictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resultados_preditivos")
        .select(`
          *,
          modelos_preditivos!inner(nome_modelo, tipo_modelo)
        `)
        .eq("tipo_previsao", "Custo")
        .gte("data_previsao", new Date().toISOString().split('T')[0])
        .order("data_previsao", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const updatePredictions = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("atualizar_previsoes_custos");
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cost-predictions"] });
      queryClient.invalidateQueries({ queryKey: ["predictive-models"] });
      toast({
        title: "Sucesso",
        description: data?.mensagem || "Previsões de custo atualizadas com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar previsões:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar previsões de custo: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    predictions,
    isLoading,
    error,
    updatePredictions,
  };
};
