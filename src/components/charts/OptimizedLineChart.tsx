
import React, { lazy, Suspense } from 'react';
import { useOptimizedCharts } from '@/hooks/useOptimizedCharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedLoadingSpinner } from '@/components/OptimizedLoadingSpinner';

const RechartsComponents = lazy(() => 
  import('recharts').then(module => ({
    default: {
      LineChart: module.LineChart,
      Line: module.Line,
      XAxis: module.XAxis,
      YAxis: module.YAxis,
      CartesianGrid: module.CartesianGrid,
      Tooltip: module.Tooltip,
      ResponsiveContainer: module.ResponsiveContainer,
    }
  }))
);

interface OptimizedLineChartProps {
  data: Array<{
    [key: string]: any;
  }>;
  lines: Array<{
    dataKey: string;
    color: string;
    name?: string;
  }>;
  xAxisKey: string;
  title?: string;
  maxDataPoints?: number;
}

export const OptimizedLineChart = ({
  data,
  lines,
  xAxisKey,
  title,
  maxDataPoints = 50
}: OptimizedLineChartProps) => {
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
      <Suspense fallback={<OptimizedLoadingSpinner />}>
        <RechartsComponents>
          {({ LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }) => (
            <ResponsiveContainer width="100%" height={chartConfig.height}>
              <LineChart data={optimizedData} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#94A3B8"
                  fontSize={isMobile ? 10 : 12}
                  tickMargin={isMobile ? 5 : 10}
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
                {lines.map((line, index) => (
                  <Line 
                    key={line.dataKey}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    stroke={line.color} 
                    strokeWidth={chartConfig.strokeWidth}
                    dot={{ 
                      r: chartConfig.dotSize,
                      fill: line.color,
                      strokeWidth: 1
                    }}
                    activeDot={{ 
                      r: chartConfig.dotSize + 2,
                      fill: line.color
                    }}
                    animationDuration={chartConfig.animationDuration}
                    name={line.name || line.dataKey}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </RechartsComponents>
      </Suspense>
      {isMobile && optimizedData.length < data.length && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dados otimizados para mobile ({optimizedData.length}/{data.length} pontos)
        </p>
      )}
    </div>
  );
};
