
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type ResultadosPreditivos = Database["public"]["Tables"]["resultados_preditivos"]["Row"];
type ResultadosPreditivosInsert = Database["public"]["Tables"]["resultados_preditivos"]["Insert"];

export const usePredictiveResults = (modelId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["predictive-results", modelId],
    queryFn: async () => {
      let query = supabase
        .from("resultados_preditivos")
        .select(`
          *,
          modelos_preditivos (
            nome_modelo,
            tipo_modelo
          )
        `)
        .order("data_previsao", { ascending: false });

      if (modelId) {
        query = query.eq("modelo_id", modelId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (ResultadosPreditivos & {
        modelos_preditivos: {
          nome_modelo: string;
          tipo_modelo: string;
        } | null;
      })[];
    },
    enabled: !!user,
  });

  const createResult = useMutation({
    mutationFn: async (resultData: Omit<ResultadosPreditivosInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("resultados_preditivos")
        .insert([resultData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-results"] });
      toast({
        title: "Sucesso",
        description: "Resultado preditivo registrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao registrar resultado preditivo: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteResult = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resultados_preditivos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-results"] });
      toast({
        title: "Sucesso",
        description: "Resultado preditivo excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir resultado preditivo: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    results,
    isLoading,
    error,
    createResult,
    deleteResult,
  };
};
