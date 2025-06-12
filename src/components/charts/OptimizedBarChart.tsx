
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOptimizedCharts } from '@/hooks/useOptimizedCharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedLoadingSpinner } from '@/components/OptimizedLoadingSpinner';

interface OptimizedBarChartProps {
  data: Array<{
    [key: string]: any;
  }>;
  bars: Array<{
    dataKey: string;
    color: string;
    name?: string;
  }>;
  xAxisKey: string;
  title?: string;
  maxDataPoints?: number;
}

export const OptimizedBarChart = React.memo(({
  data,
  bars,
  xAxisKey,
  title,
  maxDataPoints = 30
}: OptimizedBarChartProps) => {
  const isMobile = useIsMobile();
  const { optimizedData, chartConfig, isLoading } = useOptimizedCharts({
    data,
    maxDataPoints,
    isMobile,
  });

  if (isLoading || optimizedData.length === 0) {
    return <OptimizedLoadingSpinner />;
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <BarChart data={optimizedData} margin={chartConfig.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#94A3B8"
            fontSize={isMobile ? 10 : 12}
            tickMargin={isMobile ? 5 : 10}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
          />
          <YAxis 
            stroke="#94A3B8"
            fontSize={isMobile ? 10 : 12}
            tickMargin={isMobile ? 5 : 10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(220, 20%, 12%)', 
              border: '1px solid hsl(220, 20%, 20%)',
              borderRadius: '8px',
              fontSize: isMobile ? '12px' : '14px'
            }} 
          />
          {bars.map((bar, index) => (
            <Bar 
              key={bar.dataKey}
              dataKey={bar.dataKey} 
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              animationDuration={chartConfig.animationDuration}
              name={bar.name || bar.dataKey}
              isAnimationActive={false} // Desabilitar animação para melhor performance
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {isMobile && optimizedData.length < data.length && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Exibindo {optimizedData.length} de {data.length} itens
        </p>
      )}
    </div>
  );
});

OptimizedBarChart.displayName = 'OptimizedBarChart';
