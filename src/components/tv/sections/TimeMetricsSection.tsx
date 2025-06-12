
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeMetricsData {
  hoursToday: number;
  hoursThisWeek: number;
}

interface TimeMetricsSectionProps {
  timeMetrics: TimeMetricsData | undefined;
  isLoading: boolean;
}

export const TimeMetricsSection = ({ timeMetrics, isLoading }: TimeMetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-primary flex items-center space-x-3">
            <Clock className="w-8 h-8" />
            <span>Horas Registradas Hoje</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {isLoading ? (
            <div className="text-6xl font-bold text-muted-foreground mb-2">--</div>
          ) : (
            <div className="text-6xl font-bold text-chart-primary mb-2">
              {(timeMetrics?.hoursToday || 0).toFixed(1)}h
            </div>
          )}
          <p className="text-xl text-muted-foreground">
            Registradas hoje
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-secondary flex items-center space-x-3">
            <Clock className="w-8 h-8" />
            <span>Horas Registradas (Semana)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {isLoading ? (
            <div className="text-6xl font-bold text-muted-foreground mb-2">--</div>
          ) : (
            <div className="text-6xl font-bold text-chart-secondary mb-2">
              {(timeMetrics?.hoursThisWeek || 0).toFixed(1)}h
            </div>
          )}
          <p className="text-xl text-muted-foreground">
            Registradas nesta semana
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
