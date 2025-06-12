
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export const useOptimizedActivities = (filters?: {
  projectId?: string;
  areaId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) => {
  const queryKey = useMemo(() => [
    "activities-optimized",
    filters?.projectId,
    filters?.areaId,
    filters?.startDate?.toISOString(),
    filters?.endDate?.toISOString(),
    filters?.limit
  ], [filters]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log("Buscando atividades otimizadas...");
      
      let query = supabase
        .from("registros_atividades")
        .select(`
          id,
          data_registro,
          horas_gastas,
          descricao_atividade,
          projeto_id,
          area_id,
          projetos!inner (
            nome_projeto
          ),
          areas_produtivas!inner (
            nome_area
          )
        `)
        .order("data_registro", { ascending: false });

      // Aplicar filtros
      if (filters?.projectId && filters.projectId !== "all") {
        query = query.eq("projeto_id", filters.projectId);
      }
      
      if (filters?.areaId && filters.areaId !== "all") {
        query = query.eq("area_id", filters.areaId);
      }
      
      if (filters?.startDate) {
        query = query.gte("data_registro", filters.startDate.toISOString().split('T')[0]);
      }
      
      if (filters?.endDate) {
        query = query.lte("data_registro", filters.endDate.toISOString().split('T')[0]);
      }

      // Limitar resultados para melhor performance
      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100); // Limite padrão
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar atividades:", error);
        throw error;
      }

      console.log("Atividades otimizadas encontradas:", data?.length || 0);
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    enabled: true,
  });
};
