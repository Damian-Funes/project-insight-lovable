
import React, { useMemo } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProjectionData } from "@/hooks/useFinancialProjection";

interface ProjectionChartProps {
  data: ProjectionData[];
  title: string;
  type: 'costs' | 'revenues';
  adjustments?: { [key: string]: number };
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

export const OptimizedProjectionChart = React.memo(({ data, title, type, adjustments = {} }: ProjectionChartProps) => {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      const adjustment = adjustments[item.month] || 0;
      const baseValue = type === 'costs' ? item.costs : item.revenues;
      const adjustedValue = item.isProjected && adjustment !== 0 ? adjustment : baseValue;

      return {
        ...item,
        historical_value: !item.isProjected ? (type === 'costs' ? item.costs : item.revenues) : null,
        projected_value: item.isProjected ? adjustedValue : null,
      };
    });
  }, [data, type, adjustments]);

  const projectionStartIndex = useMemo(() => 
    data.findIndex(item => item.isProjected), [data]
  );

  if (!processedData.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Carregando dados do gráfico...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              className="text-muted-foreground"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            {projectionStartIndex > 0 && (
              <ReferenceLine 
                x={data[projectionStartIndex - 1]?.month} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: "Projeção", position: "top", fontSize: 10 }}
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
                      `R$ ${Number(value).toLocaleString('pt-BR')}`,
                      label + status
                    ];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              dataKey="historical_value" 
              stroke={type === 'costs' ? 'var(--color-costs)' : 'var(--color-revenues)'} 
              strokeWidth={2}
              dot={{ r: 3 }}
              name={type === 'costs' ? 'Custos Históricos' : 'Receitas Históricas'}
              connectNulls={false}
            />
            <Line 
              dataKey="projected_value" 
              stroke={type === 'costs' ? 'var(--color-projected_costs)' : 'var(--color-projected_revenues)'} 
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3 }}
              name={type === 'costs' ? 'Custos Projetados' : 'Receitas Projetadas'}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
});

OptimizedProjectionChart.displayName = "OptimizedProjectionChart";
