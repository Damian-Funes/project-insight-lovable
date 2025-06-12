
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AreaFormData {
  nome_area: string;
  descricao_area?: string;
  custo_hora_padrao?: number;
}

export const useCreateArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AreaFormData) => {
      const { error } = await supabase
        .from("areas_produtivas")
        .insert([{
          nome_area: data.nome_area,
          descricao_area: data.descricao_area || null,
          custo_hora_padrao: data.custo_hora_padrao || 0,
        }]);

      if (error) {
        console.error("Erro ao criar área:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast({
        title: "Sucesso!",
        description: "Área criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar área.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AreaFormData }) => {
      const { error } = await supabase
        .from("areas_produtivas")
        .update({
          nome_area: data.nome_area,
          descricao_area: data.descricao_area || null,
          custo_hora_padrao: data.custo_hora_padrao || 0,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar área:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast({
        title: "Sucesso!",
        description: "Área atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar área.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("areas_produtivas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar área:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast({
        title: "Sucesso!",
        description: "Área excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir área.",
        variant: "destructive",
      });
    },
  });
};
