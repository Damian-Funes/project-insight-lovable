
import { AlertTriangle, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnomalyDetection } from "@/hooks/useAnomalyDetection";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AnomalyList = () => {
  const { anomalies = [], isLoading, runDetection } = useAnomalyDetection();

  const getAnomalySeverity = (detalhes: string) => {
    if (detalhes.includes("excessivas") || detalhes.includes("sem atividades")) {
      return "high";
    }
    if (detalhes.includes("baixa") || detalhes.includes("insuficientes")) {
      return "medium";
    }
    return "low";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      default:
        return "Baixa";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando anomalias...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Anomalias Detectadas
            </CardTitle>
            <CardDescription>
              Lista das anomalias encontradas nos dados de atividades e receitas
            </CardDescription>
          </div>
          <Button
            onClick={() => runDetection.mutate()}
            disabled={runDetection.isPending}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${runDetection.isPending ? 'animate-spin' : ''}`} />
            {runDetection.isPending ? 'Executando...' : 'Executar Detecção'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium">Nenhuma anomalia detectada</p>
            <p className="text-sm">Todos os dados estão dentro dos padrões esperados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => {
              const severity = getAnomalySeverity(anomaly.detalhes_anomalia || '');
              
              return (
                <div
                  key={anomaly.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(severity)}>
                          {getSeverityText(severity)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(anomaly.data_previsao), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {anomaly.detalhes_anomalia}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
