
import { RefreshCw, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CostPredictionChart } from "./CostPredictionChart";
import { useCostPredictions } from "@/hooks/useCostPredictions";
import { DashboardChartsSkeleton } from "./OptimizedLoadingSpinner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const CostPredictionDashboard = () => {
  const { predictions, isLoading, updatePredictions } = useCostPredictions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const nextMonthPrediction = predictions && predictions.length > 0 ? predictions[0] : null;
  const totalPredicted = predictions?.reduce((acc, pred) => acc + (Number(pred.valor_previsto) || 0), 0) || 0;
  const avgMonthly = predictions && predictions.length > 0 ? totalPredicted / predictions.length : 0;

  const handleUpdatePredictions = () => {
    updatePredictions.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Previsão de Custos</h2>
        </div>
        <DashboardChartsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Previsão de Custos</h2>
          <p className="text-muted-foreground">
            Análise preditiva baseada em dados históricos de atividades
          </p>
        </div>
        <Button 
          onClick={handleUpdatePredictions}
          disabled={updatePredictions.isPending}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${updatePredictions.isPending ? 'animate-spin' : ''}`} />
          {updatePredictions.isPending ? 'Atualizando...' : 'Atualizar Previsões'}
        </Button>
      </div>

      {!predictions || predictions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma previsão disponível
            </h3>
            <p className="text-muted-foreground mb-4">
              Clique em "Atualizar Previsões" para gerar as primeiras previsões de custo.
            </p>
            <Button onClick={handleUpdatePredictions} disabled={updatePredictions.isPending}>
              <RefreshCw className={`h-4 w-4 mr-2 ${updatePredictions.isPending ? 'animate-spin' : ''}`} />
              Gerar Previsões
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-primary">
                  {nextMonthPrediction ? formatCurrency(Number(nextMonthPrediction.valor_previsto)) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextMonthPrediction 
                    ? format(new Date(nextMonthPrediction.data_previsao), "MMMM 'de' yyyy", { locale: ptBR })
                    : 'Nenhuma previsão'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-secondary">
                  {formatCurrency(avgMonthly)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Próximos {predictions.length} meses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Previsto</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-accent">
                  {formatCurrency(totalPredicted)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {predictions.length} meses à frente
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de previsões */}
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Custos - Próximos 12 Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <CostPredictionChart predictions={predictions} />
            </CardContent>
          </Card>

          {/* Tabela de detalhes */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes das Previsões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Mês</th>
                      <th className="text-right p-2">Valor Previsto</th>
                      <th className="text-right p-2">Intervalo Min.</th>
                      <th className="text-right p-2">Intervalo Máx.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((prediction) => (
                      <tr key={prediction.id} className="border-b">
                        <td className="p-2">
                          {format(new Date(prediction.data_previsao), "MMMM 'de' yyyy", { locale: ptBR })}
                        </td>
                        <td className="text-right p-2 font-medium">
                          {formatCurrency(Number(prediction.valor_previsto))}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {formatCurrency(Number(prediction.intervalo_confianca_min))}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {formatCurrency(Number(prediction.intervalo_confianca_max))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
