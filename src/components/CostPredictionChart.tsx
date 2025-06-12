
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="mes" 
          className="text-xs fill-muted-foreground"
        />
        <YAxis 
          tickFormatter={formatCurrency}
          className="text-xs fill-muted-foreground"
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === "valorPrevisto" ? "Valor Previsto" :
            name === "minimo" ? "Mínimo" : "Máximo"
          ]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return format(new Date(payload[0].payload.dataCompleta), "MMMM 'de' yyyy", { locale: ptBR });
            }
            return label;
          }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
        
        {/* Área de confiança */}
        <Area
          type="monotone"
          dataKey="maximo"
          stackId="1"
          stroke="hsl(var(--chart-primary))"
          fill="hsl(var(--chart-primary))"
          fillOpacity={0.1}
          strokeWidth={0}
        />
        <Area
          type="monotone"
          dataKey="minimo"
          stackId="1"
          stroke="hsl(var(--chart-primary))"
          fill="hsl(var(--background))"
          fillOpacity={1}
          strokeWidth={0}
        />
        
        {/* Linha principal da previsão */}
        <Line
          type="monotone"
          dataKey="valorPrevisto"
          stroke="hsl(var(--chart-primary))"
          strokeWidth={3}
          dot={{ r: 4, fill: "hsl(var(--chart-primary))" }}
          name="Valor Previsto"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
