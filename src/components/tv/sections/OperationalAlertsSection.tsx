
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, Bell } from "lucide-react";
import { useOperationalAlerts } from "@/hooks/useOperationalAlerts";
import { Database } from "@/integrations/supabase/types";

type AlertaOperacional = Database["public"]["Tables"]["alertas_operacionais"]["Row"];

interface OperationalAlertsSectionProps {
  areaId: string;
}

export const OperationalAlertsSection = ({ areaId }: OperationalAlertsSectionProps) => {
  const { data: alerts, isLoading } = useOperationalAlerts(areaId);

  const getPriorityIcon = (prioridade: number) => {
    switch (prioridade) {
      case 3: return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 2: return <Bell className="w-8 h-8 text-yellow-500" />;
      default: return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getPriorityColor = (prioridade: number) => {
    switch (prioridade) {
      case 3: return "border-red-500 bg-red-50 dark:bg-red-950";
      case 2: return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      default: return "border-blue-500 bg-blue-50 dark:bg-blue-950";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="w-16 h-16 text-chart-primary mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Carregando Alertas...
          </h3>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="bg-card border border-dashed border-chart-secondary/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="w-16 h-16 text-chart-secondary mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Nenhum Alerta Ativo
          </h3>
          <p className="text-lg text-muted-foreground text-center">
            Não há alertas operacionais ativos para esta área no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">
          Alertas Operacionais
        </h2>
        <p className="text-xl text-muted-foreground">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} ativo{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`border-2 transition-all duration-1000 hover:scale-105 ${getPriorityColor(alert.prioridade)}`}
          >
            <CardContent className="flex items-center space-x-6 py-8">
              <div className="flex-shrink-0">
                {getPriorityIcon(alert.prioridade)}
              </div>
              
              <div className="flex-1">
                <div className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {alert.mensagem}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {alert.data_inicio && (
                      <span>Desde: {new Date(alert.data_inicio).toLocaleDateString('pt-BR')}</span>
                    )}
                    {alert.data_fim && (
                      <span> • Até: {new Date(alert.data_fim).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                  
                  <div className="text-sm font-semibold">
                    {alert.prioridade === 3 && (
                      <span className="text-red-600 bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full">
                        ALTA PRIORIDADE
                      </span>
                    )}
                    {alert.prioridade === 2 && (
                      <span className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                        MÉDIA PRIORIDADE
                      </span>
                    )}
                    {alert.prioridade === 1 && (
                      <span className="text-blue-600 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                        BAIXA PRIORIDADE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {alerts.map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full bg-chart-primary animate-pulse"
                style={{ animationDelay: `${index * 500}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
