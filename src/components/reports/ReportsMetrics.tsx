
import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, BarChart3, Calendar } from "lucide-react";

export const ReportsMetrics = memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Relatórios Gerados</p>
              <p className="text-2xl font-bold text-foreground">127</p>
            </div>
            <FileText className="w-8 h-8 text-chart-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Economia Identificada</p>
              <p className="text-2xl font-bold text-metric-profit">R$ 45.2K</p>
            </div>
            <TrendingUp className="w-8 h-8 text-metric-profit" />
          </div>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projetos Analisados</p>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
            <BarChart3 className="w-8 h-8 text-chart-secondary" />
          </div>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="text-lg font-bold text-foreground">Hoje</p>
              <p className="text-xs text-muted-foreground">14:35</p>
            </div>
            <Calendar className="w-8 h-8 text-metric-warning" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ReportsMetrics.displayName = 'ReportsMetrics';
