
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type AlertasConfig = Database["public"]["Tables"]["alertas_config"]["Row"];
type AlertasConfigInsert = Database["public"]["Tables"]["alertas_config"]["Insert"];
type AlertasConfigUpdate = Database["public"]["Tables"]["alertas_config"]["Update"];

export const useAlerts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: alerts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alertas_config")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AlertasConfig[];
    },
  });

  const createAlert = useMutation({
    mutationFn: async (alertData: Omit<AlertasConfigInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("alertas_config")
        .insert([alertData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateAlert = useMutation({
    mutationFn: async ({ id, ...alertData }: AlertasConfigUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("alertas_config")
        .update(alertData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("alertas_config")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from("alertas_config")
        .update({ ativo })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Sucesso",
        description: "Status do alerta atualizado!",
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
    alerts,
    isLoading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
  };
};
