
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type ModelosPreditivos = Database["public"]["Tables"]["modelos_preditivos"]["Row"];
type ModelosPreditivosInsert = Database["public"]["Tables"]["modelos_preditivos"]["Insert"];
type ModelosPreditivosUpdate = Database["public"]["Tables"]["modelos_preditivos"]["Update"];

export const usePredictiveModels = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: models,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["predictive-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modelos_preditivos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ModelosPreditivos[];
    },
    enabled: !!user,
  });

  const createModel = useMutation({
    mutationFn: async (modelData: Omit<ModelosPreditivosInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("modelos_preditivos")
        .insert([modelData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo preditivo criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar modelo preditivo: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateModel = useMutation({
    mutationFn: async ({ id, ...modelData }: ModelosPreditivosUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("modelos_preditivos")
        .update(modelData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo preditivo atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo preditivo: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteModel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("modelos_preditivos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo preditivo excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir modelo preditivo: " + error.message,
        variant: "destructive",
      });
    },
  });

  const toggleModelStatus = useMutation({
    mutationFn: async ({ id, status_modelo }: { id: string; status_modelo: string }) => {
      const { data, error } = await supabase
        .from("modelos_preditivos")
        .update({ status_modelo })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictive-models"] });
      toast({
        title: "Sucesso",
        description: "Status do modelo atualizado!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    models,
    isLoading,
    error,
    createModel,
    updateModel,
    deleteModel,
    toggleModelStatus,
  };
};
