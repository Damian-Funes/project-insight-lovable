
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostChart } from "@/components/CostChart";
import { CostTable } from "@/components/CostTable";
import { AreaCostChart } from "@/components/AreaCostChart";
import { AreaCostTable } from "@/components/AreaCostTable";
import { useCostsByProject } from "@/hooks/useCostsByProject";
import { useCostsByArea } from "@/hooks/useCostsByArea";
import { Loader2, TrendingUp, Building2 } from "lucide-react";

const CostDashboard = () => {
  const { data: costData, isLoading: isLoadingProjects, error: projectError } = useCostsByProject();
  const { data: areaCostData, isLoading: isLoadingAreas, error: areaError } = useCostsByArea();

  if (isLoadingProjects || isLoadingAreas) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados de custos...</span>
        </div>
      </div>
    );
  }

  if (projectError || areaError) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-2">Erro ao carregar dados de custos</p>
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-chart-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboards de Custos</h2>
          <p className="text-muted-foreground">
            Análise detalhada dos custos por projeto e área
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Total - Projetos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os projetos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{costData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de projetos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Total - Áreas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalAreaCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as áreas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Áreas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areaCostData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de áreas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Custos por Projeto</CardTitle>
            <CardDescription>
              Gráfico de barras mostrando o custo total de cada projeto baseado nas horas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {costData && costData.length > 0 ? (
              <CostChart data={costData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Nenhum dado de custo disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Custos por Área</CardTitle>
            <CardDescription>
              Gráfico de barras mostrando o custo total de cada área produtiva baseado nas horas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {areaCostData && areaCostData.length > 0 ? (
              <AreaCostChart data={areaCostData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Nenhum dado de custo por área disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Custos - Projetos</CardTitle>
            <CardDescription>
              Detalhamento dos custos totais por projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostTable data={costData || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Custos - Áreas</CardTitle>
            <CardDescription>
              Detalhamento dos custos totais por área produtiva
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
