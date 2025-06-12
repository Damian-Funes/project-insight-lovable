
import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCostsByProject } from "@/hooks/useCostsByProject";
import { useCostsByArea } from "@/hooks/useCostsByArea";
import { useProfitabilityData } from "@/hooks/useProfitabilityData";
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

const CostDashboard = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Debounce filtros para melhor performance
  const debouncedStartDate = useDebounce(startDate, 300);
  const debouncedEndDate = useDebounce(endDate, 300);
  const debouncedSelectedProject = useDebounce(selectedProject, 300);
  const debouncedSelectedArea = useDebounce(selectedArea, 300);

  const projectFilters = {
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    projectId: debouncedSelectedProject,
  };

  const areaFilters = {
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    areaId: debouncedSelectedArea,
  };

  const profitabilityFilters = {
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    projectId: debouncedSelectedProject,
  };

  const { data: costData = [], isLoading: isLoadingProjects, error: projectError } = useCostsByProject(projectFilters);
  const { data: areaCostData = [], isLoading: isLoadingAreas, error: areaError } = useCostsByArea(areaFilters);
  const { data: profitabilityData = [], isLoading: isLoadingProfitability, error: profitabilityError } = useProfitabilityData(profitabilityFilters);

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
            <h3 className="text-lg font-semibold text-foreground mb-2">Carregando Dashboard</h3>
            <p className="text-muted-foreground">Buscando dados de custos e rentabilidade...</p>
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
            <div className="mt-4 text-xs text-muted-foreground">
              Erro técnico: {
                projectError instanceof Error ? projectError.message : 
                areaError instanceof Error ? areaError.message :
                profitabilityError instanceof Error ? profitabilityError.message : "Erro desconhecido"
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalCost = costData?.reduce((sum, project) => sum + project.custo_total, 0) || 0;
  const totalRevenue = profitabilityData?.reduce((sum, project) => sum + project.receita_total, 0) || 0;
  const totalProfit = profitabilityData?.reduce((sum, project) => sum + project.lucro, 0) || 0;

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-chart-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-chart-primary to-chart-secondary bg-clip-text text-transparent">
            Dashboard de Custos & Rentabilidade
          </h2>
          <p className="text-muted-foreground">
            Análise detalhada dos custos e rentabilidade por projeto e área produtiva
          </p>
        </div>
      </div>

      {/* Alerta para dados vazios */}
      {!hasAnyData && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Nenhum dado encontrado!</strong> Para visualizar as análises, é necessário cadastrar:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Projetos na seção "Projetos"</li>
              <li>Áreas Produtivas na seção "Áreas Produtivas"</li>
              <li>Registros de Atividades na seção "Atividades"</li>
              <li>Receitas na seção "Gestão de Receitas"</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros - Componente memoizado */}
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

      {/* KPIs - Componente memoizado */}
      <DashboardKPIs
        totalRevenue={totalRevenue}
        totalCost={totalCost}
        totalProfit={totalProfit}
        hasProfitabilityData={hasProfitabilityData}
        hasProjectData={hasProjectData}
      />

      {/* Gráfico de Rentabilidade - Lazy loaded */}
      <Card className="border-t-4 border-t-chart-accent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-chart-accent" />
            <CardTitle className="text-xl">Rentabilidade por Projeto</CardTitle>
          </div>
          <CardDescription>
            Comparação entre receita, custo e lucro/prejuízo por projeto
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
                <p className="text-sm">Cadastre projetos, receitas e atividades para visualizar a análise</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos de Custo - Lazy loaded */}
      <div className="grid gap-6 lg:grid-cols-1">
        <Card className="border-t-4 border-t-chart-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-primary" />
              <CardTitle className="text-xl">Análise de Custos por Projeto</CardTitle>
            </div>
            <CardDescription>
              Distribuição dos custos totais baseada nas horas registradas e custo/hora das áreas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasProjectData ? (
              <Suspense fallback={<OptimizedLoadingSpinner />}>
                <CostChart data={costData} />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum dado de custo disponível</p>
                  <p className="text-sm">Registre atividades nos projetos para visualizar os custos</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-chart-secondary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-chart-secondary" />
              <CardTitle className="text-xl">Análise de Custos por Área Produtiva</CardTitle>
            </div>
            <CardDescription>
              Distribuição dos custos por área baseada nas horas registradas e custo/hora padrão
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasAreaData ? (
              <Suspense fallback={<OptimizedLoadingSpinner />}>
                <AreaCostChart data={areaCostData} />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum dado de custo por área disponível</p>
                  <p className="text-sm">Configure áreas produtivas e registre atividades</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabelas - Lazy loaded */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-accent" />
              Detalhamento - Rentabilidade por Projeto
            </CardTitle>
            <CardDescription>
              Valores detalhados de receita, custo, lucro e margem de lucro por projeto
            </CardDescription>
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
                Detalhamento - Custos por Projeto
              </CardTitle>
              <CardDescription>
                Valores detalhados dos custos calculados por projeto
              </CardDescription>
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
                Detalhamento - Custos por Área
              </CardTitle>
              <CardDescription>
                Valores detalhados dos custos calculados por área produtiva
              </CardDescription>
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

export default CostDashboard;
