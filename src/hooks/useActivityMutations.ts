
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ActivityFormData {
  data_registro: Date;
  projeto_id: string;
  area_id: string;
  horas_gastas: number;
  descricao_atividade?: string;
  tipo_atividade: 'Padrão' | 'Retrabalho';
  responsavel_id: string;
  ordem_producao_id?: string;
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ActivityFormData) => {
      const { error } = await supabase
        .from("registros_atividades")
        .insert([{
          data_registro: data.data_registro.toISOString().split('T')[0],
          projeto_id: data.projeto_id,
          area_id: data.area_id,
          horas_gastas: data.horas_gastas,
          descricao_atividade: data.descricao_atividade || null,
          tipo_atividade: data.tipo_atividade,
          responsavel_id: data.responsavel_id,
          ordem_producao_id: data.ordem_producao_id || null,
        }]);

      if (error) {
        console.error("Erro ao criar atividade:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Sucesso!",
        description: "Atividade registrada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar atividade.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ActivityFormData }) => {
      const { error } = await supabase
        .from("registros_atividades")
        .update({
          data_registro: data.data_registro.toISOString().split('T')[0],
          projeto_id: data.projeto_id,
          area_id: data.area_id,
          horas_gastas: data.horas_gastas,
          descricao_atividade: data.descricao_atividade || null,
          tipo_atividade: data.tipo_atividade,
          responsavel_id: data.responsavel_id,
          ordem_producao_id: data.ordem_producao_id || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar atividade:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Sucesso!",
        description: "Atividade atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar atividade.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("registros_atividades")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar atividade:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Sucesso!",
        description: "Atividade excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir atividade.",
        variant: "destructive",
      });
    },
  });
};
