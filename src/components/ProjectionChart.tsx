
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProjectionData } from "@/hooks/useFinancialProjection";

interface ProjectionChartProps {
  data: ProjectionData[];
  title: string;
  type: 'costs' | 'revenues';
}

const chartConfig = {
  costs: {
    label: "Custos",
    color: "hsl(var(--chart-secondary))",
  },
  revenues: {
    label: "Receitas", 
    color: "hsl(var(--chart-primary))",
  },
  projected_costs: {
    label: "Custos Projetados",
    color: "hsl(var(--chart-secondary))",
  },
  projected_revenues: {
    label: "Receitas Projetadas",
    color: "hsl(var(--chart-primary))",
  },
};

export const ProjectionChart = ({ data, title, type }: ProjectionChartProps) => {
  const processedData = data.map(item => ({
    ...item,
    historical_value: !item.isProjected ? (type === 'costs' ? item.costs : item.revenues) : null,
    projected_value: item.isProjected ? (type === 'costs' ? item.costs : item.revenues) : null,
  }));

  // Encontrar o índice onde começam as projeções
  const projectionStartIndex = data.findIndex(item => item.isProjected);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
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
            {projectionStartIndex > 0 && (
              <ReferenceLine 
                x={data[projectionStartIndex - 1]?.month} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: "Projeção", position: "top" }}
              />
            )}
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    const isProjected = name?.toString().includes('projected');
                    const label = type === 'costs' ? 'Custos' : 'Receitas';
                    const status = isProjected ? ' (Projetado)' : ' (Histórico)';
                    return [
                      `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      label + status
                    ];
                  }}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
              }
            />
            <Legend />
            <Line 
              dataKey="historical_value" 
              stroke={type === 'costs' ? 'var(--color-costs)' : 'var(--color-revenues)'} 
              strokeWidth={2}
              dot={{ r: 4 }}
              name={type === 'costs' ? 'Custos Históricos' : 'Receitas Históricas'}
              connectNulls={false}
            />
            <Line 
              dataKey="projected_value" 
              stroke={type === 'costs' ? 'var(--color-projected_costs)' : 'var(--color-projected_revenues)'} 
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ r: 4 }}
              name={type === 'costs' ? 'Custos Projetados' : 'Receitas Projetadas'}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
