
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostChart } from "@/components/CostChart";
import { CostTable } from "@/components/CostTable";
import { useCostsByProject } from "@/hooks/useCostsByProject";
import { Loader2, TrendingUp } from "lucide-react";

const CostDashboard = () => {
  const { data: costData, isLoading, error } = useCostsByProject();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados de custos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-2">Erro ao carregar dados de custos</p>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalCost = costData?.reduce((sum, project) => sum + project.custo_total, 0) || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-chart-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboards de Custos</h2>
          <p className="text-muted-foreground">
            Análise detalhada dos custos por projeto
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Total
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
            <CardTitle>Tabela de Custos</CardTitle>
            <CardDescription>
              Detalhamento dos custos totais por projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostTable data={costData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostDashboard;
