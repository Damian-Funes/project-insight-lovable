
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, RotateCcw } from "lucide-react";
import { ReworkChart } from "@/components/ReworkChart";

interface ReworkSectionProps {
  reworkMetrics: {
    reworkPercentage: number;
    reworkHours: number;
    standardHours: number;
  } | undefined;
  isLoading: boolean;
}

export const ReworkSection = ({ reworkMetrics, isLoading }: ReworkSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ReworkChart
          reworkPercentage={reworkMetrics?.reworkPercentage || 0}
          reworkHours={reworkMetrics?.reworkHours || 0}
          standardHours={reworkMetrics?.standardHours || 0}
          isLoading={isLoading}
        />
      </div>
      
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-secondary flex items-center space-x-3">
            <Monitor className="w-8 h-8" />
            <span>Horas Totais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl font-bold text-chart-secondary mb-2">
            {(reworkMetrics?.standardHours + reworkMetrics?.reworkHours || 0).toFixed(0)}h
          </div>
          <p className="text-xl text-muted-foreground">
            Trabalhadas no período
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-tertiary flex items-center space-x-3">
            <RotateCcw className="w-8 h-8" />
            <span>Horas de Retrabalho</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl font-bold text-chart-accent mb-2">
            {(reworkMetrics?.reworkHours || 0).toFixed(0)}h
          </div>
          <p className="text-xl text-muted-foreground">
            Retrabalho identificado
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
