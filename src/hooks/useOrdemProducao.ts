
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type OrdemProducao = Database["public"]["Tables"]["ordem_producao"]["Row"];
type OrdemProducaoInsert = Database["public"]["Tables"]["ordem_producao"]["Insert"];
type OrdemProducaoUpdate = Database["public"]["Tables"]["ordem_producao"]["Update"];

export const useOrdemProducao = () => {
  const queryClient = useQueryClient();

  const {
    data: ordensProducao,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ordens-producao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordem_producao")
        .select(`
          *,
          projetos!inner(nome_projeto),
          areas_produtivas!inner(nome_area)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createOrdemProducao = useMutation({
    mutationFn: async (ordemData: OrdemProducaoInsert) => {
      const { data, error } = await supabase
        .from("ordem_producao")
        .insert(ordemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
      toast.success("Ordem de Produção criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar ordem de produção:", error);
      toast.error("Erro ao criar ordem de produção");
    },
  });

  const updateOrdemProducao = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & OrdemProducaoUpdate) => {
      const { data, error } = await supabase
        .from("ordem_producao")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
      toast.success("Ordem de Produção atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de produção:", error);
      toast.error("Erro ao atualizar ordem de produção");
    },
  });

  const deleteOrdemProducao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ordem_producao")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
      toast.success("Ordem de Produção excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir ordem de produção:", error);
      toast.error("Erro ao excluir ordem de produção");
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, dataInicioReal, dataFimReal }: { 
      id: string; 
      status: string; 
      dataInicioReal?: string;
      dataFimReal?: string;
    }) => {
      const updateData: OrdemProducaoUpdate = { 
        status_op: status,
        ...(dataInicioReal && { data_inicio_real: dataInicioReal }),
        ...(dataFimReal && { data_fim_real: dataFimReal })
      };

      const { data, error } = await supabase
        .from("ordem_producao")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    },
  });

  return {
    ordensProducao,
    isLoading,
    error,
    createOrdemProducao,
    updateOrdemProducao,
    deleteOrdemProducao,
    updateStatus,
  };
};
