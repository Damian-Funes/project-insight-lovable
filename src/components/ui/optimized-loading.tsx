
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = React.memo(() => (
  <div className="flex-1 space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-6 w-[100px]" />
    </div>
    
    <div className="dashboard-grid">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[80px] mb-2" />
            <Skeleton className="h-3 w-[150px]" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="chart-container">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
));

DashboardSkeleton.displayName = "DashboardSkeleton";

export const TableSkeleton = React.memo(() => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[...Array(8)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
));

TableSkeleton.displayName = "TableSkeleton";

export const ChartSkeleton = React.memo(() => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-[200px]" />
    <Skeleton className="h-[300px] w-full" />
  </div>
));

ChartSkeleton.displayName = "ChartSkeleton";
