
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Monitor } from "lucide-react";

interface ReworkMetrics {
  reworkPercentage: number;
}

interface ProjectData {
  progress: number;
}

interface PerformanceSectionProps {
  reworkMetrics: ReworkMetrics | undefined;
  areaProjects: ProjectData[] | undefined;
}

export const PerformanceSection = ({ reworkMetrics, areaProjects }: PerformanceSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-primary flex items-center space-x-3">
            <TrendingUp className="w-8 h-8" />
            <span>Eficiência Operacional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl font-bold text-chart-primary mb-2">
            {reworkMetrics ? (100 - reworkMetrics.reworkPercentage).toFixed(1) : 0}%
          </div>
          <p className="text-xl text-muted-foreground">
            Trabalho eficiente
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-secondary flex items-center space-x-3">
            <Monitor className="w-8 h-8" />
            <span>Projetos Ativos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl font-bold text-chart-secondary mb-2">
            {areaProjects?.length || 0}
          </div>
          <p className="text-xl text-muted-foreground">
            Em andamento
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-tertiary flex items-center space-x-3">
            <Monitor className="w-8 h-8" />
            <span>Progresso Médio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl font-bold text-chart-tertiary mb-2">
            {areaProjects && areaProjects.length > 0
              ? (areaProjects.reduce((sum, project) => sum + project.progress, 0) / areaProjects.length).toFixed(0)
              : 0}%
          </div>
          <p className="text-xl text-muted-foreground">
            Dos projetos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
