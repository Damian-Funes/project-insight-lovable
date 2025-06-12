
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostChart } from "@/components/CostChart";
import { CostTable } from "@/components/CostTable";
import { AreaCostChart } from "@/components/AreaCostChart";
import { AreaCostTable } from "@/components/AreaCostTable";
import { ProfitabilityChart } from "@/components/ProfitabilityChart";
import { ProfitabilityTable } from "@/components/ProfitabilityTable";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ProjectFilter } from "@/components/ProjectFilter";
import { AreaFilter } from "@/components/AreaFilter";
import { useCostsByProject } from "@/hooks/useCostsByProject";
import { useCostsByArea } from "@/hooks/useCostsByArea";
import { useProfitabilityData } from "@/hooks/useProfitabilityData";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, TrendingUp, Building2, Filter, Calendar, DollarSign, TrendingDown, Database, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const totalAreaCost = areaCostData?.reduce((sum, area) => sum + area.custo_total, 0) || 0;
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

      {/* Filtros */}
      <Card className="border-l-4 border-l-chart-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-chart-primary" />
            <CardTitle className="text-lg">Filtros de Análise</CardTitle>
          </div>
          <CardDescription>
            Utilize os filtros abaixo para refinar sua análise de custos e rentabilidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
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

      {/* Gráfico de Rentabilidade */}
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
            <ProfitabilityChart data={profitabilityData} />
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

      {/* Gráficos de Custo */}
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
              <CostChart data={costData} />
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
              <AreaCostChart data={areaCostData} />
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

      {/* Tabelas */}
      <div className="grid gap-6">
        {/* Tabela de Rentabilidade */}
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
            <ProfitabilityTable data={profitabilityData} />
          </CardContent>
        </Card>

        {/* Tabelas de Custo */}
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
              <CostTable data={costData} />
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
              <AreaCostTable data={areaCostData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CostDashboard;
