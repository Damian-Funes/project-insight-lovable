
import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOptimizedProfitabilityData } from "@/hooks/useOptimizedProfitabilityData";
import { useOptimizedCostsByProject } from "@/hooks/useOptimizedCostsByProject";
import { useOptimizedCostsByArea } from "@/hooks/useOptimizedCostsByArea";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, TrendingUp, Building2, AlertCircle, Database, FileText, DollarSign } from "lucide-react";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { OptimizedLoadingSpinner } from "@/components/OptimizedLoadingSpinner";

// Lazy loading dos componentes pesados
const CostChart = lazy(() => import("@/components/CostChart").then(module => ({ default: module.CostChart })));
const AreaCostChart = lazy(() => import("@/components/AreaCostChart").then(module => ({ default: module.AreaCostChart })));
const ProfitabilityChart = lazy(() => import("@/components/ProfitabilityChart").then(module => ({ default: module.ProfitabilityChart })));
const CostTable = lazy(() => import("@/components/CostTable").then(module => ({ default: module.CostTable })));
const AreaCostTable = lazy(() => import("@/components/AreaCostTable").then(module => ({ default: module.AreaCostTable })));
const ProfitabilityTable = lazy(() => import("@/components/ProfitabilityTable").then(module => ({ default: module.ProfitabilityTable })));

const OptimizedCostDashboard = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Debounce filtros para melhor performance (já implementado nos hooks otimizados)
  const projectFilters = {
    startDate,
    endDate,
    projectId: selectedProject,
  };

  const areaFilters = {
    startDate,
    endDate,
    areaId: selectedArea,
  };

  // Usar hooks otimizados
  const { 
    data: profitabilityData = [], 
    isLoading: isLoadingProfitability, 
    error: profitabilityError,
    aggregatedMetrics 
  } = useOptimizedProfitabilityData(projectFilters);

  const { 
    data: costData = [], 
    isLoading: isLoadingProjects, 
    error: projectError,
    costStatistics 
  } = useOptimizedCostsByProject(projectFilters);

  const { 
    data: areaCostData = [], 
    isLoading: isLoadingAreas, 
    error: areaError,
    areaMetrics 
  } = useOptimizedCostsByArea(areaFilters);

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedProject("all");
    setSelectedArea("all");
  };

  const isLoading = isLoadingProjects || isLoadingAreas || isLoadingProfitability;
  const hasError = projectError || areaError || profitabilityError;

  // Verificar se há dados
  const hasProjectData = costData && costData.length > 0;
  const hasAreaData = areaCostData && areaCostData.length > 0;
  const hasProfitabilityData = profitabilityData && profitabilityData.length > 0;
  const hasAnyData = hasProjectData || hasAreaData || hasProfitabilityData;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-chart-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Carregando Dashboard Otimizado</h3>
            <p className="text-muted-foreground">Processando dados de custos e rentabilidade...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao Carregar Dados</h3>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro ao buscar os dados. Verifique sua conexão e tente novamente.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-chart-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-chart-primary to-chart-secondary bg-clip-text text-transparent">
            Dashboard Otimizado - Custos & Rentabilidade
          </h2>
          <p className="text-muted-foreground">
            Análise otimizada com processamento no backend e cache inteligente
          </p>
        </div>
      </div>

      {/* Métricas de Performance */}
      {(aggregatedMetrics || costStatistics || areaMetrics) && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Métricas de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {aggregatedMetrics && (
                <>
                  <div>
                    <p className="text-muted-foreground">Projetos Lucrativos</p>
                    <p className="font-semibold">{aggregatedMetrics.profitableProjects}/{aggregatedMetrics.totalProjects}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margem Média</p>
                    <p className="font-semibold">{aggregatedMetrics.averageMargin.toFixed(1)}%</p>
                  </div>
                </>
              )}
              {costStatistics && (
                <>
                  <div>
                    <p className="text-muted-foreground">Projetos com Custos</p>
                    <p className="font-semibold">{costStatistics.projectsWithCosts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Custo Médio</p>
                    <p className="font-semibold">R$ {costStatistics.averageCost.toLocaleString('pt-BR')}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerta para dados vazios */}
      {!hasAnyData && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Nenhum dado encontrado!</strong> Para visualizar as análises, é necessário cadastrar dados nos módulos do sistema.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        selectedProject={selectedProject}
        selectedArea={selectedArea}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onProjectChange={setSelectedProject}
        onAreaChange={setSelectedArea}
        onClearFilters={clearFilters}
      />

      {/* KPIs Otimizados */}
      <DashboardKPIs
        totalRevenue={aggregatedMetrics?.totalRevenue || 0}
        totalCost={aggregatedMetrics?.totalCost || costStatistics?.totalCost || 0}
        totalProfit={aggregatedMetrics?.totalProfit || 0}
        hasProfitabilityData={hasProfitabilityData}
        hasProjectData={hasProjectData}
      />

      {/* Gráficos com Lazy Loading */}
      <div className="grid gap-6">
        {/* Rentabilidade */}
        <Card className="border-t-4 border-t-chart-accent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-accent" />
              <CardTitle className="text-xl">Rentabilidade Otimizada por Projeto</CardTitle>
            </div>
            <CardDescription>
              Dados calculados no backend com cache inteligente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasProfitabilityData ? (
              <Suspense fallback={<OptimizedLoadingSpinner />}>
                <ProfitabilityChart data={profitabilityData} />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum dado de rentabilidade disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custos por Projeto e Área */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-t-4 border-t-chart-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-primary" />
                <CardTitle className="text-xl">Custos por Projeto</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {hasProjectData ? (
                <Suspense fallback={<OptimizedLoadingSpinner />}>
                  <CostChart data={costData} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>Nenhum dado disponível</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-chart-secondary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-chart-secondary" />
                <CardTitle className="text-xl">Custos por Área</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {hasAreaData ? (
                <Suspense fallback={<OptimizedLoadingSpinner />}>
                  <AreaCostChart data={areaCostData} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>Nenhum dado disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabelas com Lazy Loading */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-accent" />
              Detalhamento Otimizado - Rentabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<OptimizedLoadingSpinner />}>
              <ProfitabilityTable data={profitabilityData} />
            </Suspense>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-primary" />
                Custos por Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<OptimizedLoadingSpinner />}>
                <CostTable data={costData} />
              </Suspense>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-chart-secondary" />
                Custos por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<OptimizedLoadingSpinner />}>
                <AreaCostTable data={areaCostData} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimizedCostDashboard;
