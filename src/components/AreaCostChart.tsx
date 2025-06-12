
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AreaCostData {
  nome_area: string;
  custo_total: number;
}

interface AreaCostChartProps {
  data: AreaCostData[];
}

const chartConfig = {
  custo_total: {
    label: "Custo Total",
    color: "hsl(var(--chart-secondary))",
  },
};

export const AreaCostChart = ({ data }: AreaCostChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="nome_area" 
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  "Custo Total"
                ]}
                labelFormatter={(label) => `Área: ${label}`}
              />
            }
          />
          <Bar 
            dataKey="custo_total" 
            fill="var(--color-custo_total)" 
            radius={[4, 4, 0, 0]}
            className="fill-chart-secondary hover:fill-chart-secondary/80 transition-colors"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
