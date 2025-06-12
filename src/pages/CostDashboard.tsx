import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostChart } from "@/components/CostChart";
import { CostTable } from "@/components/CostTable";
import { AreaCostChart } from "@/components/AreaCostChart";
import { AreaCostTable } from "@/components/AreaCostTable";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ProjectFilter } from "@/components/ProjectFilter";
import { AreaFilter } from "@/components/AreaFilter";
import { useCostsByProject } from "@/hooks/useCostsByProject";
import { useCostsByArea } from "@/hooks/useCostsByArea";
import { Loader2, TrendingUp, Building2, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CostDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const projectFilters = {
    startDate: dateRange.from,
    endDate: dateRange.to,
    projectId: selectedProject,
  };

  const areaFilters = {
    startDate: dateRange.from,
    endDate: dateRange.to,
    areaId: selectedArea,
  };

  const { data: costData, isLoading: isLoadingProjects, error: projectError } = useCostsByProject(projectFilters);
  const { data: areaCostData, isLoading: isLoadingAreas, error: areaError } = useCostsByArea(areaFilters);

  const clearFilters = () => {
    setDateRange({});
    setSelectedProject("all");
    setSelectedArea("all");
  };

  if (isLoadingProjects || isLoadingAreas) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-chart-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados de custos...</span>
        </div>
      </div>
    );
  }

  if (projectError || areaError) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-2 text-lg font-semibold">Erro ao carregar dados de custos</p>
            <p className="text-muted-foreground text-sm">
              {projectError instanceof Error ? projectError.message : areaError instanceof Error ? areaError.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalCost = costData?.reduce((sum, project) => sum + project.custo_total, 0) || 0;
  const totalAreaCost = areaCostData?.reduce((sum, area) => sum + area.custo_total, 0) || 0;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-chart-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-chart-primary to-chart-secondary bg-clip-text text-transparent">
            Dashboards de Custos
          </h2>
          <p className="text-muted-foreground">
            Análise detalhada dos custos por projeto e área produtiva
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-l-4 border-l-chart-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-chart-primary" />
            <CardTitle className="text-lg">Filtros de Análise</CardTitle>
          </div>
          <CardDescription>
            Utilize os filtros abaixo para refinar sua análise de custos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            <ProjectFilter
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
            />
            <AreaFilter
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
            />
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-chart-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo Total - Projetos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-primary">
              R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os projetos filtrados
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-secondary">{costData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de projetos com atividades
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo Total - Áreas
            </CardTitle>
            <Building2 className="h-4 w-4 text-chart-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-accent">
              R$ {totalAreaCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as áreas filtradas
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-highlight">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Áreas Ativas
            </CardTitle>
            <Building2 className="h-4 w-4 text-chart-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-highlight">{areaCostData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de áreas com atividades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
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
            {costData && costData.length > 0 ? (
              <CostChart data={costData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum dado de custo disponível</p>
                  <p className="text-sm">Ajuste os filtros ou verifique se há atividades registradas</p>
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
            {areaCostData && areaCostData.length > 0 ? (
              <AreaCostChart data={areaCostData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum dado de custo por área disponível</p>
                  <p className="text-sm">Ajuste os filtros ou verifique se há atividades registradas</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabelas */}
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
            <CostTable data={costData || []} />
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
            <AreaCostTable data={areaCostData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostDashboard;
