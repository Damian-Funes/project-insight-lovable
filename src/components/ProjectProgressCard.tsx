
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Clock } from "lucide-react";

interface ProjectProgressProps {
  id: string;
  nome_projeto: string;
  progress: number;
  totalHours: number;
  orcamento_total: number | null;
  isLoading?: boolean;
}

export const ProjectProgressCard = ({ 
  nome_projeto, 
  progress, 
  totalHours, 
  orcamento_total,
  isLoading 
}: ProjectProgressProps) => {
  if (isLoading) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-2 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border hover:border-chart-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-foreground flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-chart-primary" />
          <span className="truncate">{nome_projeto}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-muted-foreground">Progresso</span>
            <span className="text-2xl font-bold text-chart-primary">
              {progress}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-3"
          />
        </div>

        {/* Informações Adicionais */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{totalHours.toFixed(1)}h trabalhadas</span>
          </div>
          {orcamento_total && (
            <span>
              Orçamento: R$ {orcamento_total.toLocaleString('pt-BR')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
