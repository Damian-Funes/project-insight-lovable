
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RevenueFormData {
  data_receita: Date;
  valor_receita: number;
  projeto_id: string;
  descricao_receita?: string;
  tipo_receita?: string;
  cliente_id?: string;
}

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RevenueFormData) => {
      const { error } = await supabase
        .from("receitas")
        .insert([{
          data_receita: data.data_receita.toISOString().split('T')[0],
          valor_receita: data.valor_receita,
          projeto_id: data.projeto_id,
          descricao_receita: data.descricao_receita || null,
          tipo_receita: data.tipo_receita || null,
          cliente_id: data.cliente_id || null,
        }]);

      if (error) {
        console.error("Erro ao criar receita:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar receita.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RevenueFormData }) => {
      const { error } = await supabase
        .from("receitas")
        .update({
          data_receita: data.data_receita.toISOString().split('T')[0],
          valor_receita: data.valor_receita,
          projeto_id: data.projeto_id,
          descricao_receita: data.descricao_receita || null,
          tipo_receita: data.tipo_receita || null,
          cliente_id: data.cliente_id || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar receita:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar receita.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("receitas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar receita:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "Sucesso!",
        description: "Receita excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir receita.",
        variant: "destructive",
      });
    },
  });
};
