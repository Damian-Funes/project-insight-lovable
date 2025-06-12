
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartSkeletonProps {
  type?: 'area' | 'line' | 'bar' | 'pie';
  showTitle?: boolean;
  height?: number;
}

export const ChartSkeleton = ({ 
  type = 'area', 
  showTitle = true,
  height
}: ChartSkeletonProps) => {
  const isMobile = useIsMobile();
  const skeletonHeight = height || (isMobile ? 250 : 400);

  const renderChartContent = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-between h-full p-4">
            {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-4 md:w-6" 
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>
        );
      
      case 'pie':
        return (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full" />
          </div>
        );
      
      case 'line':
        return (
          <div className="relative h-full p-4">
            <svg className="w-full h-full opacity-30">
              <path
                d={`M 0,${skeletonHeight * 0.7} Q ${skeletonHeight * 0.25},${skeletonHeight * 0.3} ${skeletonHeight * 0.5},${skeletonHeight * 0.5} T ${skeletonHeight},${skeletonHeight * 0.2}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
        );
      
      default: // area
        return (
          <div className="relative h-full p-4">
            <Skeleton className="w-full h-3/4 rounded-lg opacity-30" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
                <Skeleton key={i} className="w-8 h-4" />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height: skeletonHeight }} className="relative">
          {renderChartContent()}
          
          {/* Indicador de carregamento */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Carregando gráfico...</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardChartsSkeleton = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
      <ChartSkeleton type="area" />
      <ChartSkeleton type="line" />
      <ChartSkeleton type="bar" />
      <ChartSkeleton type="pie" />
    </div>
  );
};
