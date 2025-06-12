
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { OptimizedProjectionChart } from "@/components/OptimizedProjectionChart";
import { OptimizedEditableProjectionTable } from "@/components/OptimizedEditableProjectionTable";
import { useFinancialProjection } from "@/hooks/useFinancialProjection";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FinancialProjection = React.memo(() => {
  const [analysisMonths, setAnalysisMonths] = useState<number>(6);
  const [projectionHorizon, setProjectionHorizon] = useState<number>(6);
  const [costAdjustments, setCostAdjustments] = useState<{ [key: string]: number }>({});
  const [revenueAdjustments, setRevenueAdjustments] = useState<{ [key: string]: number }>({});

  const { data: projectionResult, isLoading, error } = useFinancialProjection({
    analysisMonths,
    projectionHorizon
  });

  const projectionData = projectionResult?.data || [];
  const averages = projectionResult?.averages || { monthlyCost: 0, monthlyRevenue: 0 };

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold tracking-tight">Projeção Financeira</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-destructive">Erro ao carregar dados de projeção</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold tracking-tight">Projeção Financeira</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-4 w-4" />
            Configurações de Projeção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período de Análise Histórica</label>
              <Select value={analysisMonths.toString()} onValueChange={(value) => setAnalysisMonths(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horizonte de Projeção</label>
              <Select value={projectionHorizon.toString()} onValueChange={(value) => setProjectionHorizon(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Próximos 3 meses</SelectItem>
                  <SelectItem value="6">Próximos 6 meses</SelectItem>
                  <SelectItem value="12">Próximos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs de Médias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Mensal de Custos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-xl font-bold text-red-600">
                  R$ {averages.monthlyCost.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseado nos últimos {analysisMonths} meses
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Mensal de Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-xl font-bold text-green-600">
                  R$ {averages.monthlyRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseado nos últimos {analysisMonths} meses
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Projeção de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
            <TrendingDown className="h-4 w-4" />
            Projeção de Custos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <OptimizedProjectionChart 
              data={projectionData} 
              title="Tendência e Projeção de Custos"
              type="costs"
              adjustments={costAdjustments}
            />
          )}
          <Separator />
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <OptimizedEditableProjectionTable 
              data={projectionData}
              title="Custos"
              type="custos"
              onProjectionChange={setCostAdjustments}
            />
          )}
        </CardContent>
      </Card>

      {/* Seção de Projeção de Receitas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
            <TrendingUp className="h-4 w-4" />
            Projeção de Receitas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <OptimizedProjectionChart 
              data={projectionData} 
              title="Tendência e Projeção de Receitas"
              type="revenues"
              adjustments={revenueAdjustments}
            />
          )}
          <Separator />
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <OptimizedEditableProjectionTable 
              data={projectionData}
              title="Receitas"
              type="receitas"
              onProjectionChange={setRevenueAdjustments}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
});

FinancialProjection.displayName = "FinancialProjection";

export default FinancialProjection;
