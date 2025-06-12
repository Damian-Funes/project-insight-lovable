
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type AlertaOperacional = Database["public"]["Tables"]["alertas_operacionais"]["Row"];
type AlertaOperacionalInsert = Database["public"]["Tables"]["alertas_operacionais"]["Insert"];
type AlertaOperacionalUpdate = Database["public"]["Tables"]["alertas_operacionais"]["Update"];

export const useOperationalAlerts = (areaId?: string) => {
  return useQuery({
    queryKey: ["operational-alerts", areaId],
    queryFn: async (): Promise<AlertaOperacional[]> => {
      console.log("Buscando alertas operacionais para área:", areaId);
      
      let query = supabase
        .from("alertas_operacionais")
        .select("*")
        .eq("ativo", true)
        .lte("data_inicio", new Date().toISOString().split('T')[0])
        .order("prioridade", { ascending: false })
        .order("created_at", { ascending: false });

      // Se área específica foi selecionada, filtrar por ela
      if (areaId && areaId !== "all") {
        query = query.or(`area_id.eq.${areaId},area_id.is.null`);
      } else {
        // Se "all" ou nenhuma área, mostrar apenas alertas gerais (sem área específica)
        query = query.is("area_id", null);
      }

      // Filtrar por data de fim (se definida)
      query = query.or("data_fim.is.null,data_fim.gte." + new Date().toISOString().split('T')[0]);

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar alertas operacionais:", error);
        throw error;
      }

      console.log("Alertas encontrados:", data);
      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useOperationalAlertsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAlert = useMutation({
    mutationFn: async (alertData: Omit<AlertaOperacionalInsert, "id" | "created_at" | "updated_at" | "created_by">) => {
      const { data, error } = await supabase
        .from("alertas_operacionais")
        .insert([{
          ...alertData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operational-alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta operacional criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateAlert = useMutation({
    mutationFn: async ({ id, ...alertData }: AlertaOperacionalUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("alertas_operacionais")
        .update(alertData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operational-alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta operacional atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("alertas_operacionais")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operational-alerts"] });
      toast({
        title: "Sucesso",
        description: "Alerta operacional excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir alerta: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createAlert,
    updateAlert,
    deleteAlert,
  };
};
