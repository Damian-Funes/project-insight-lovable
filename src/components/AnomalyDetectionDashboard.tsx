
import { AlertTriangle, Activity, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnomalyList } from "@/components/AnomalyList";
import { useAnomalyDetection } from "@/hooks/useAnomalyDetection";

export const AnomalyDetectionDashboard = () => {
  const { anomalies = [] } = useAnomalyDetection();

  // Calcular estatísticas das anomalias
  const totalAnomalies = anomalies.length;
  const recentAnomalies = anomalies.filter(
    (anomaly) => new Date(anomaly.data_previsao) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  const hoursAnomalies = anomalies.filter(
    (anomaly) => anomaly.detalhes_anomalia?.includes("horas")
  ).length;
  
  const revenueAnomalies = anomalies.filter(
    (anomaly) => anomaly.detalhes_anomalia?.includes("Receita")
  ).length;
  
  const projectAnomalies = anomalies.filter(
    (anomaly) => anomaly.detalhes_anomalia?.includes("Projeto")
  ).length;

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Anomalias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnomalies}</div>
            <p className="text-xs text-muted-foreground">
              Detectadas no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 7 Dias</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAnomalies}</div>
            <p className="text-xs text-muted-foreground">
              Anomalias recentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalias de Horas</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoursAnomalies}</div>
            <p className="text-xs text-muted-foreground">
              Horas excessivas/insuficientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalias de Receitas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueAnomalies + projectAnomalies}</div>
            <p className="text-xs text-muted-foreground">
              Receitas baixas/projetos inativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre o Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona a Detecção de Anomalias</CardTitle>
          <CardDescription>
            Sistema automático de detecção baseado em análise estatística
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Anomalias de Horas
              </h4>
              <p className="text-sm text-muted-foreground">
                Detecta registros de horas que estão 2 desvios padrão acima ou abaixo da média dos últimos 90 dias.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Anomalias de Receitas
              </h4>
              <p className="text-sm text-muted-foreground">
                Identifica receitas anormalmente baixas comparadas ao padrão histórico do período.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Projetos Inativos
              </h4>
              <p className="text-sm text-muted-foreground">
                Monitora projetos ativos que não tiveram atividades registradas há mais de 14 dias.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Anomalias */}
      <AnomalyList />
    </div>
  );
};
