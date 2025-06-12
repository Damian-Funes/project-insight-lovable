
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedAreaChart } from "@/components/charts/OptimizedAreaChart";
import { OptimizedLineChart } from "@/components/charts/OptimizedLineChart";

interface ReportsChartsProps {
  monthlyTrends: Array<{
    month: string;
    custoTotal: number;
    horasTrabalhadas: number;
    retrabalho: number;
    eficiencia: number;
  }>;
}

export const ReportsCharts = memo(({ monthlyTrends }: ReportsChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-foreground">Tendência de Custos vs Horas</CardTitle>
        </CardHeader>
        <CardContent>
          <OptimizedAreaChart
            data={monthlyTrends}
            dataKey="custoTotal"
            xAxisKey="month"
            color="#3B82F6"
            maxDataPoints={24}
          />
        </CardContent>
      </Card>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-foreground">Eficiência vs Retrabalho</CardTitle>
        </CardHeader>
        <CardContent>
          <OptimizedLineChart
            data={monthlyTrends}
            lines={[
              { dataKey: "eficiencia", color: "#10B981", name: "Eficiência (%)" },
              { dataKey: "retrabalho", color: "#EF4444", name: "Retrabalho (%)" }
            ]}
            xAxisKey="month"
            maxDataPoints={24}
          />
        </CardContent>
      </Card>
    </div>
  );
});

ReportsCharts.displayName = 'ReportsCharts';
