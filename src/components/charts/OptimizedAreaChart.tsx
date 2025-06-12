
import React, { lazy, Suspense } from 'react';
import { useOptimizedCharts } from '@/hooks/useOptimizedCharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedLoadingSpinner } from '@/components/OptimizedLoadingSpinner';

// Lazy loading da biblioteca de gráficos
const RechartsComponents = lazy(() => 
  import('recharts').then(module => ({
    default: {
      AreaChart: module.AreaChart,
      Area: module.Area,
      XAxis: module.XAxis,
      YAxis: module.YAxis,
      CartesianGrid: module.CartesianGrid,
      Tooltip: module.Tooltip,
      ResponsiveContainer: module.ResponsiveContainer,
    }
  }))
);

interface OptimizedAreaChartProps {
  data: Array<{
    [key: string]: any;
  }>;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  title?: string;
  maxDataPoints?: number;
}

export const OptimizedAreaChart = ({
  data,
  dataKey,
  xAxisKey,
  color = "#3B82F6",
  title,
  maxDataPoints = 50
}: OptimizedAreaChartProps) => {
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
          {({ AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }) => (
            <ResponsiveContainer width="100%" height={chartConfig.height}>
              <AreaChart data={optimizedData} margin={chartConfig.margin}>
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  fillOpacity={1} 
                  fill={`url(#color-${dataKey})`} 
                  strokeWidth={chartConfig.strokeWidth}
                  animationDuration={chartConfig.animationDuration}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </RechartsComponents>
      </Suspense>
      {isMobile && optimizedData.length < data.length && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Exibindo {optimizedData.length} de {data.length} pontos (otimizado para mobile)
        </p>
      )}
    </div>
  );
};
