
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTaskStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      dataInicioReal, 
      dataFimReal 
    }: { 
      id: string; 
      status: string; 
      dataInicioReal?: string;
      dataFimReal?: string;
    }) => {
      const updateData: any = { 
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

      if (error) {
        console.error("Erro ao atualizar status da OP:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
      toast({
        title: "Sucesso!",
        description: "Status da OP atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status da OP.",
        variant: "destructive",
      });
    },
  });

  const iniciarOP = (id: string) => {
    updateTaskStatus.mutate({
      id,
      status: "Em Andamento",
      dataInicioReal: new Date().toISOString(),
    });
  };

  const concluirOP = (id: string) => {
    updateTaskStatus.mutate({
      id,
      status: "Concluída",
      dataFimReal: new Date().toISOString(),
    });
  };

  return {
    iniciarOP,
    concluirOP,
    isLoading: updateTaskStatus.isPending,
  };
};
