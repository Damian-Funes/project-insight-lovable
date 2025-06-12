
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRevenueMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createRevenue = useMutation({
    mutationFn: async (revenue: {
      data_receita: string;
      valor_receita: number;
      projeto_id: string;
      descricao_receita?: string;
      tipo_receita?: string;
    }) => {
      const { data, error } = await supabase
        .from("receitas")
        .insert([revenue])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar receita:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateRevenue = useMutation({
    mutationFn: async ({ 
      id, 
      ...revenue 
    }: {
      id: string;
      data_receita: string;
      valor_receita: number;
      projeto_id: string;
      descricao_receita?: string;
      tipo_receita?: string;
    }) => {
      const { data, error } = await supabase
        .from("receitas")
        .update(revenue)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar receita:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteRevenue = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("receitas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir receita:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createRevenue,
    updateRevenue,
    deleteRevenue,
  };
};
