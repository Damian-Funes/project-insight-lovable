
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProjectFormData } from "@/components/ProjectFormModal";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const { error } = await supabase
        .from("projetos")
        .insert([{
          nome_projeto: data.nome_projeto,
          descricao_projeto: data.descricao_projeto || null,
          status_projeto: data.status_projeto,
          data_inicio: data.data_inicio?.toISOString().split('T')[0] || null,
          data_termino_prevista: data.data_termino_prevista?.toISOString().split('T')[0] || null,
          orcamento_total: data.orcamento_total || null,
        }]);

      if (error) {
        console.error("Erro ao criar projeto:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Sucesso!",
        description: "Projeto criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar projeto.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectFormData }) => {
      const { error } = await supabase
        .from("projetos")
        .update({
          nome_projeto: data.nome_projeto,
          descricao_projeto: data.descricao_projeto || null,
          status_projeto: data.status_projeto,
          data_inicio: data.data_inicio?.toISOString().split('T')[0] || null,
          data_termino_prevista: data.data_termino_prevista?.toISOString().split('T')[0] || null,
          orcamento_total: data.orcamento_total || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Sucesso!",
        description: "Projeto atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar projeto.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("projetos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar projeto:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Sucesso!",
        description: "Projeto excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir projeto.",
        variant: "destructive",
      });
    },
  });
};
