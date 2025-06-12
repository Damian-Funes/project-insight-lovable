
import React from "react";
import { OptimizedAreaChart } from "@/components/charts/OptimizedAreaChart";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CostPredictionChartProps {
  predictions: Array<{
    id: string;
    data_previsao: string;
    valor_previsto: number | null;
    intervalo_confianca_min: number | null;
    intervalo_confianca_max: number | null;
  }>;
}

export const CostPredictionChart = ({ predictions }: CostPredictionChartProps) => {
  const chartData = predictions.map((prediction) => ({
    mes: format(new Date(prediction.data_previsao), "MMM/yy", { locale: ptBR }),
    dataCompleta: prediction.data_previsao,
    valorPrevisto: prediction.valor_previsto ? Number(prediction.valor_previsto) : 0,
    minimo: prediction.intervalo_confianca_min ? Number(prediction.intervalo_confianca_min) : 0,
    maximo: prediction.intervalo_confianca_max ? Number(prediction.intervalo_confianca_max) : 0,
  }));

  return (
    <OptimizedAreaChart
      data={chartData}
      dataKey="valorPrevisto"
      xAxisKey="mes"
      color="hsl(var(--chart-primary))"
      maxDataPoints={12}
    />
  );
};
