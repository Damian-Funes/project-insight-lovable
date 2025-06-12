
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useAnomalyDetection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: anomalies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["anomaly-detection"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resultados_preditivos")
        .select(`
          *,
          modelos_preditivos!inner(nome_modelo, tipo_modelo)
        `)
        .eq("tipo_previsao", "Anomalia")
        .order("data_previsao", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  });

  const runDetection = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("executar_deteccao_anomalias");
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anomaly-detection"] });
      
      const resultado = data as { mensagem?: string; total_anomalias?: number; sucesso?: boolean } | null;
      
      toast({
        title: "Sucesso",
        description: resultado?.mensagem || "Detecção de anomalias executada com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro ao executar detecção de anomalias:", error);
      toast({
        title: "Erro",
        description: "Erro ao executar detecção de anomalias: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    anomalies,
    isLoading,
    error,
    runDetection,
  };
};
