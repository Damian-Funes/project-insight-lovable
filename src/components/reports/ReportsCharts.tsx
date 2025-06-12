
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 20%, 12%)', 
                  border: '1px solid hsl(220, 20%, 20%)',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="custoTotal" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorCusto)" 
                strokeWidth={2}
                name="Custo Total (R$)"
              />
              <Area 
                type="monotone" 
                dataKey="horasTrabalhadas" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorHoras)" 
                strokeWidth={2}
                name="Horas Trabalhadas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-foreground">Eficiência vs Retrabalho</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 20%, 12%)', 
                  border: '1px solid hsl(220, 20%, 20%)',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="eficiencia" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
                name="Eficiência (%)"
              />
              <Line 
                type="monotone" 
                dataKey="retrabalho" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2 }}
                name="Retrabalho (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
});

ReportsCharts.displayName = 'ReportsCharts';
