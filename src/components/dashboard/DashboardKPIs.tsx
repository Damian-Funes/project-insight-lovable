
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardKPIsProps {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  hasProfitabilityData: boolean;
  hasProjectData: boolean;
}

export const DashboardKPIs = memo(({ 
  totalRevenue, 
  totalCost, 
  totalProfit, 
  hasProfitabilityData, 
  hasProjectData 
}: DashboardKPIsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-chart-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receita Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-chart-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-primary">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasProfitabilityData ? 'Total de receitas dos projetos' : 'Nenhuma receita cadastrada'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-chart-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Custo Total
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-chart-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-secondary">
            R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasProjectData ? 'Total de custos dos projetos' : 'Nenhum custo calculado'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-chart-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lucro Total
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-accent" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasProfitabilityData ? 'Receita menos custos' : 'Dados insuficientes'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-chart-highlight">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Margem Média
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-highlight" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-highlight">
            {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%
          </div>
          <p className="text-xs text-muted-foreground">
            {totalRevenue > 0 ? 'Margem de lucro geral' : 'Sem dados para cálculo'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

DashboardKPIs.displayName = 'DashboardKPIs';
