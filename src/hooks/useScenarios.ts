
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scenario {
  id: string;
  nome_cenario: string;
  descricao_cenario: string | null;
  data_criacao: string;
  usuario_id: string;
  parametros_simulacao: any;
  resultados_simulacao: any;
  ativo: boolean;
}

export const useScenarios = () => {
  return useQuery({
    queryKey: ["scenarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cenarios_financeiros")
        .select(`
          *,
          profiles!cenarios_financeiros_usuario_id_fkey(nome_completo)
        `)
        .order("data_criacao", { ascending: false });

      if (error) {
        console.error("Erro ao buscar cenários:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useScenarioMutations = () => {
  const queryClient = useQueryClient();

  const createScenario = useMutation({
    mutationFn: async (scenarioData: Omit<Scenario, "id" | "data_criacao" | "usuario_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("cenarios_financeiros")
        .insert({
          ...scenarioData,
          usuario_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar cenário:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Cenário criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
    onError: (error) => {
      console.error("Erro ao criar cenário:", error);
      toast.error("Erro ao criar cenário");
    },
  });

  const updateScenario = useMutation({
    mutationFn: async ({ id, ...scenarioData }: Partial<Scenario> & { id: string }) => {
      const { data, error } = await supabase
        .from("cenarios_financeiros")
        .update(scenarioData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar cenário:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Cenário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar cenário:", error);
      toast.error("Erro ao atualizar cenário");
    },
  });

  const deleteScenario = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cenarios_financeiros")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir cenário:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Cenário excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
    onError: (error) => {
      console.error("Erro ao excluir cenário:", error);
      toast.error("Erro ao excluir cenário");
    },
  });

  const toggleScenarioStatus = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from("cenarios_financeiros")
        .update({ ativo })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao alterar status do cenário:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(`Cenário ${data.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
    onError: (error) => {
      console.error("Erro ao alterar status do cenário:", error);
      toast.error("Erro ao alterar status do cenário");
    },
  });

  return {
    createScenario,
    updateScenario,
    deleteScenario,
    toggleScenarioStatus,
  };
};
