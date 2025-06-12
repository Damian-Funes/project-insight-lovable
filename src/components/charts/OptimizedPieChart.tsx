
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useOptimizedCharts } from '@/hooks/useOptimizedCharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedLoadingSpinner } from '@/components/OptimizedLoadingSpinner';

interface OptimizedPieChartProps {
  data: Array<{
    [key: string]: any;
    color?: string;
  }>;
  dataKey: string;
  nameKey: string;
  title?: string;
  maxDataPoints?: number;
}

export const OptimizedPieChart = ({
  data,
  dataKey,
  nameKey,
  title,
  maxDataPoints = 8
}: OptimizedPieChartProps) => {
  const isMobile = useIsMobile();
  const { optimizedData, chartConfig, isLoading } = useOptimizedCharts({
    data,
    maxDataPoints,
    isMobile,
  });

  if (isLoading || optimizedData.length === 0) {
    return <OptimizedLoadingSpinner />;
  }

  const colors = [
    "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", 
    "#EF4444", "#6366F1", "#EC4899", "#14B8A6"
  ];

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <PieChart>
          <Pie
            data={optimizedData}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 40 : 60}
            outerRadius={isMobile ? 80 : 120}
            paddingAngle={5}
            dataKey={dataKey}
            animationDuration={chartConfig.animationDuration}
          >
            {optimizedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(220, 20%, 12%)', 
              border: '1px solid hsl(220, 20%, 20%)',
              borderRadius: '8px',
              fontSize: isMobile ? '12px' : '14px'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legenda customizada para mobile */}
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-wrap justify-center gap-4'} mt-4`}>
        {optimizedData.map((entry, index) => (
          <div key={entry[nameKey]} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color || colors[index % colors.length] }}
            />
            <span className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
              {entry[nameKey]}
            </span>
          </div>
        ))}
      </div>
      
      {isMobile && optimizedData.length < data.length && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Exibindo top {optimizedData.length} de {data.length} itens
        </p>
      )}
    </div>
  );
};
