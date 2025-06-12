
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProjectProfitability } from "@/hooks/useProfitabilityData";

interface ProfitabilityChartProps {
  data: ProjectProfitability[];
}

const chartConfig = {
  receita_total: {
    label: "Receita Total",
    color: "hsl(var(--chart-primary))",
  },
  custo_total: {
    label: "Custo Total",
    color: "hsl(var(--chart-secondary))",
  },
  lucro: {
    label: "Lucro/Prejuízo",
    color: "hsl(var(--chart-accent))",
  },
};

export const ProfitabilityChart = ({ data }: ProfitabilityChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="nome_projeto" 
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
                formatter={(value, name) => {
                  const labels = {
                    receita_total: "Receita Total",
                    custo_total: "Custo Total", 
                    lucro: "Lucro/Prejuízo"
                  };
                  return [
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    labels[name as keyof typeof labels] || name
                  ];
                }}
                labelFormatter={(label) => `Projeto: ${label}`}
              />
            }
          />
          <Legend />
          <Bar 
            dataKey="receita_total" 
            fill="var(--color-receita_total)" 
            radius={[2, 2, 0, 0]}
            name="Receita Total"
          />
          <Bar 
            dataKey="custo_total" 
            fill="var(--color-custo_total)" 
            radius={[2, 2, 0, 0]}
            name="Custo Total"
          />
          <Bar 
            dataKey="lucro" 
            fill="var(--color-lucro)" 
            radius={[2, 2, 0, 0]}
            name="Lucro/Prejuízo"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
