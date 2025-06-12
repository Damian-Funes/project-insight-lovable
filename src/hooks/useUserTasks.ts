
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-tasks", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      console.log("Buscando tarefas do usuário...");

      // Primeiro, buscar o perfil do usuário para obter sua área
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("area_id, areas_produtivas(nome_area)")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.area_id) {
        console.error("Erro ao buscar perfil ou área do usuário:", profileError);
        return [];
      }

      const areaName = profile.areas_produtivas?.nome_area?.toLowerCase();
      let dateFilter = new Date();

      // Definir filtro de data baseado na área
      if (areaName?.includes("almoxarifado") && areaName?.includes("componentes")) {
        // Almoxarifado de Componentes: 3 dias ou menos no futuro
        dateFilter.setDate(dateFilter.getDate() + 3);
      } else if (areaName?.includes("almoxarifado") && areaName?.includes("pintadas")) {
        // Almoxarifado de Peças Pintadas: 2 dias ou menos no futuro
        dateFilter.setDate(dateFilter.getDate() + 2);
      } else {
        // Produção/Montagem e outras áreas: hoje ou já passou
        // dateFilter já está como hoje
      }

      const dateFilterString = dateFilter.toISOString().split('T')[0];

      // Buscar OPs relevantes para o usuário
      const { data, error } = await supabase
        .from("ordem_producao")
        .select(`
          id,
          numero_op,
          descricao_op,
          data_inicio_prevista,
          status_op,
          data_inicio_real,
          data_fim_real,
          projetos!inner (
            nome_projeto
          ),
          areas_produtivas!inner (
            nome_area
          )
        `)
        .eq("area_responsavel_id", profile.area_id)
        .lte("data_inicio_prevista", dateFilterString)
        .in("status_op", ["Pendente", "Em Andamento"])
        .order("data_inicio_prevista", { ascending: true });

      if (error) {
        console.error("Erro ao buscar OPs:", error);
        throw error;
      }

      console.log(`OPs encontradas: ${data?.length || 0}`);
      return data || [];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
