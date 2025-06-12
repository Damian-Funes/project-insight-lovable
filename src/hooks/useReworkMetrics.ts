
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReworkMetrics {
  totalHours: number;
  reworkHours: number;
  standardHours: number;
  reworkPercentage: number;
}

export const useReworkMetrics = (areaId: string) => {
  return useQuery({
    queryKey: ["rework-metrics", areaId],
    queryFn: async (): Promise<ReworkMetrics> => {
      console.log("Buscando métricas de retrabalho para área:", areaId);
      
      if (!areaId || areaId === "all") {
        return {
          totalHours: 0,
          reworkHours: 0,
          standardHours: 0,
          reworkPercentage: 0,
        };
      }

      const { data, error } = await supabase
        .from("registros_atividades")
        .select("horas_gastas, tipo_atividade")
        .eq("area_id", areaId);

      if (error) {
        console.error("Erro ao buscar métricas de retrabalho:", error);
        throw error;
      }

      const totalHours = data.reduce((sum, record) => sum + Number(record.horas_gastas), 0);
      const reworkHours = data
        .filter((record) => record.tipo_atividade === "Retrabalho")
        .reduce((sum, record) => sum + Number(record.horas_gastas), 0);
      const standardHours = totalHours - reworkHours;
      const reworkPercentage = totalHours > 0 ? (reworkHours / totalHours) * 100 : 0;

      console.log("Métricas calculadas:", {
        totalHours,
        reworkHours,
        standardHours,
        reworkPercentage,
      });

      return {
        totalHours,
        reworkHours,
        standardHours,
        reworkPercentage,
      };
    },
    enabled: !!areaId && areaId !== "all",
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
