
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimeMetrics {
  hoursToday: number;
  hoursThisWeek: number;
}

export const useTimeMetrics = (areaId: string) => {
  return useQuery({
    queryKey: ["time-metrics", areaId],
    queryFn: async (): Promise<TimeMetrics> => {
      console.log("Buscando métricas de tempo para área:", areaId);
      
      if (!areaId || areaId === "all") {
        return {
          hoursToday: 0,
          hoursThisWeek: 0,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Calcular início da semana (segunda-feira)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const weekStart = monday.toISOString().split('T')[0];

      // Buscar horas de hoje
      const { data: todayData, error: todayError } = await supabase
        .from("registros_atividades")
        .select("horas_gastas")
        .eq("area_id", areaId)
        .eq("data_registro", today);

      if (todayError) {
        console.error("Erro ao buscar horas de hoje:", todayError);
        throw todayError;
      }

      // Buscar horas da semana
      const { data: weekData, error: weekError } = await supabase
        .from("registros_atividades")
        .select("horas_gastas")
        .eq("area_id", areaId)
        .gte("data_registro", weekStart)
        .lte("data_registro", today);

      if (weekError) {
        console.error("Erro ao buscar horas da semana:", weekError);
        throw weekError;
      }

      const hoursToday = todayData.reduce((sum, record) => sum + Number(record.horas_gastas), 0);
      const hoursThisWeek = weekData.reduce((sum, record) => sum + Number(record.horas_gastas), 0);

      console.log("Métricas de tempo calculadas:", { hoursToday, hoursThisWeek });

      return {
        hoursToday,
        hoursThisWeek,
      };
    },
    enabled: !!areaId && areaId !== "all",
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};
