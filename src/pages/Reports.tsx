
import React, { lazy, Suspense } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FileText, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { ReportsMetrics } from "@/components/reports/ReportsMetrics";
import { OptimizedLoadingSpinner } from "@/components/OptimizedLoadingSpinner";

// Lazy loading dos componentes pesados
const ReportsCharts = lazy(() => import("@/components/reports/ReportsCharts").then(module => ({ default: module.ReportsCharts })));
const ReportsTable = lazy(() => import("@/components/reports/ReportsTable").then(module => ({ default: module.ReportsTable })));

const Reports = () => {
  const monthlyTrends = [
    { month: "Jan", custoTotal: 285000, horasTrabalhadas: 1950, retrabalho: 8.2, eficiencia: 87 },
    { month: "Feb", custoTotal: 312000, horasTrabalhadas: 2100, retrabalho: 7.8, eficiencia: 89 },
    { month: "Mar", custoTotal: 295000, horasTrabalhadas: 2050, retrabalho: 9.1, eficiencia: 85 },
    { month: "Apr", custoTotal: 358000, horasTrabalhadas: 2400, retrabalho: 6.5, eficiencia: 92 },
    { month: "May", custoTotal: 335000, horasTrabalhadas: 2280, retrabalho: 7.2, eficiencia: 90 },
    { month: "Jun", custoTotal: 324800, horasTrabalhadas: 2200, retrabalho: 8.4, eficiencia: 88 }
  ];

  const reportTypes = [
    {
      title: "Relatório de Custos por Projeto",
      description: "Análise detalhada dos custos alocados em cada projeto",
      icon: BarChart3,
      period: "Último trimestre",
      size: "2.3 MB"
    },
    {
      title: "Relatório de Eficiência por Área",
      description: "Performance e produtividade das áreas produtivas",
      icon: TrendingUp,
      period: "Últimos 6 meses",
      size: "1.8 MB"
    },
    {
      title: "Relatório de Retrabalho",
      description: "Análise de atividades de retrabalho e impacto nos custos",
      icon: FileText,
      period: "Mês atual",
      size: "1.2 MB"
    },
    {
      title: "Relatório Financeiro Executivo",
      description: "Visão consolidada para tomada de decisão estratégica",
      icon: Calendar,
      period: "Ano fiscal",
      size: "5.1 MB"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Insights detalhados para decisões estratégicas</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select>
            <SelectTrigger className="w-48 bg-input border-border">
              <SelectValue placeholder="Período de análise" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="current-month">Mês atual</SelectItem>
              <SelectItem value="last-month">Mês anterior</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Ano fiscal</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border hover:bg-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Trend Analysis Charts - Lazy loaded */}
      <Suspense fallback={<OptimizedLoadingSpinner />}>
        <ReportsCharts monthlyTrends={monthlyTrends} />
      </Suspense>

      {/* Available Reports - Lazy loaded */}
      <Suspense fallback={<OptimizedLoadingSpinner />}>
        <ReportsTable reportTypes={reportTypes} />
      </Suspense>

      {/* Quick Stats - Memoized component */}
      <ReportsMetrics />
    </div>
  );
};

export default Reports;
