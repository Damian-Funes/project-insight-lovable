
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStateContext } from "@/contexts/GlobalStateContext";
import { QUERY_KEYS } from "@/config/queryClient";
import type { ActivityFormData } from "./useActivityMutations";

export const useOptimizedCreateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivityRelated, updateQueryData } = useGlobalStateContext();

  return useMutation({
    mutationFn: async (data: ActivityFormData) => {
      const newActivity = {
        data_registro: data.data_registro.toISOString().split('T')[0],
        projeto_id: data.projeto_id,
        area_id: data.area_id,
        horas_gastas: data.horas_gastas,
        descricao_atividade: data.descricao_atividade || null,
        tipo_atividade: data.tipo_atividade,
        responsavel_id: data.responsavel_id,
        ordem_producao_id: data.ordem_producao_id || null,
      };

      const { data: insertedData, error } = await supabase
        .from("registros_atividades")
        .insert([newActivity])
        .select(`
          *,
          projetos(nome_projeto),
          areas_produtivas(nome_area),
          ordem_producao(numero_op)
        `)
        .single();

      if (error) {
        console.error("Erro ao criar atividade:", error);
        throw error;
      }

      return insertedData;
    },
    onMutate: async (newActivity) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ACTIVITIES_PAGINATED });

      // Salvar estado anterior
      const previousActivities = queryClient.getQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED);

      // Atualizar cache otimisticamente
      updateQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED, (old: any) => {
        if (!old) return old;
        
        const optimisticActivity = {
          id: 'temp-' + Date.now(),
          ...newActivity,
          data_registro: newActivity.data_registro.toISOString().split('T')[0],
          projetos: { nome_projeto: 'Carregando...' },
          areas_produtivas: { nome_area: 'Carregando...' },
          ordem_producao: null,
        };

        return {
          ...old,
          activities: [optimisticActivity, ...old.activities],
          totalCount: old.totalCount + 1,
        };
      });

      return { previousActivities };
    },
    onError: (err, newActivity, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousActivities) {
        queryClient.setQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED, context.previousActivities);
      }
      
      toast({
        title: "Erro",
        description: "Erro ao registrar atividade. Tente novamente.",
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      invalidateActivityRelated({
        projeto_id: variables.projeto_id,
        area_id: variables.area_id,
      });

      toast({
        title: "Sucesso!",
        description: "Atividade registrada com sucesso.",
      });
    },
  });
};

export const useOptimizedUpdateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivityRelated } = useGlobalStateContext();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ActivityFormData }) => {
      const updateData = {
        data_registro: data.data_registro.toISOString().split('T')[0],
        projeto_id: data.projeto_id,
        area_id: data.area_id,
        horas_gastas: data.horas_gastas,
        descricao_atividade: data.descricao_atividade || null,
        tipo_atividade: data.tipo_atividade,
        responsavel_id: data.responsavel_id,
        ordem_producao_id: data.ordem_producao_id || null,
      };

      const { error } = await supabase
        .from("registros_atividades")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar atividade:", error);
        throw error;
      }

      return { id, ...updateData };
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      invalidateActivityRelated({
        projeto_id: variables.data.projeto_id,
        area_id: variables.data.area_id,
      });

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

export const useOptimizedDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivityRelated, updateQueryData } = useGlobalStateContext();

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

      return id;
    },
    onMutate: async (activityId) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ACTIVITIES_PAGINATED });

      // Salvar estado anterior
      const previousActivities = queryClient.getQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED);

      // Atualizar cache otimisticamente removendo a atividade
      updateQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED, (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          activities: old.activities.filter((activity: any) => activity.id !== activityId),
          totalCount: Math.max(0, old.totalCount - 1),
        };
      });

      return { previousActivities };
    },
    onError: (err, activityId, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousActivities) {
        queryClient.setQueryData(QUERY_KEYS.ACTIVITIES_PAGINATED, context.previousActivities);
      }
      
      toast({
        title: "Erro",
        description: "Erro ao excluir atividade. Tente novamente.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas a atividades
      invalidateActivityRelated({});

      toast({
        title: "Sucesso!",
        description: "Atividade excluída com sucesso.",
      });
    },
  });
};
