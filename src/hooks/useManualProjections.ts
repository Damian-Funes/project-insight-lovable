
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface ManualProjection {
  id?: string;
  data_referencia: string;
  tipo: 'custos' | 'receitas';
  valor_projetado: number;
  ajuste_manual: number;
  usuario_id?: string;
}

export const useManualProjections = () => {
  const queryClient = useQueryClient();

  // Buscar ajustes manuais existentes
  const { data: manualProjections = [], isLoading } = useQuery({
    queryKey: ["manual-projections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projecoes_manuais")
        .select("*");

      if (error) {
        console.error("Erro ao buscar projeções manuais:", error);
        throw error;
      }

      return data || [];
    },
  });

  // Mutation para salvar/atualizar ajustes
  const saveProjectionsMutation = useMutation({
    mutationFn: async (projections: ManualProjection[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Preparar dados para upsert
      const projectionsToSave = projections.map(proj => ({
        data_referencia: proj.data_referencia,
        tipo: proj.tipo,
        valor_projetado: proj.valor_projetado,
        ajuste_manual: proj.ajuste_manual,
        usuario_id: user.id,
      }));

      const { error } = await supabase
        .from("projecoes_manuais")
        .upsert(projectionsToSave, {
          onConflict: 'data_referencia,tipo,usuario_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Erro ao salvar projeções:", error);
        throw error;
      }

      return projectionsToSave;
    },
    onSuccess: () => {
      toast.success("Projeções salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["manual-projections"] });
    },
    onError: (error) => {
      console.error("Erro ao salvar projeções:", error);
      toast.error("Erro ao salvar projeções");
    },
  });

  // Função para obter ajuste manual para uma data e tipo específicos
  const getManualAdjustment = (date: string, type: 'custos' | 'receitas'): number => {
    const adjustment = manualProjections.find(
      proj => proj.data_referencia === date && proj.tipo === type
    );
    return adjustment?.ajuste_manual || 0;
  };

  return {
    manualProjections,
    isLoading,
    saveProjections: saveProjectionsMutation.mutate,
    isSaving: saveProjectionsMutation.isPending,
    getManualAdjustment,
  };
};
