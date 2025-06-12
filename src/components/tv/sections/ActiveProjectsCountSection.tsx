
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ActiveProjectsCountSectionProps {
  activeProjectsCount: number | undefined;
  isLoading: boolean;
}

export const ActiveProjectsCountSection = ({ activeProjectsCount, isLoading }: ActiveProjectsCountSectionProps) => {
  return (
    <div className="flex justify-center">
      <Card className="bg-card border border-border w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-tertiary flex items-center space-x-3 justify-center">
            <Activity className="w-8 h-8" />
            <span>Projetos em Andamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {isLoading ? (
            <div className="text-8xl font-bold text-muted-foreground mb-2">--</div>
          ) : (
            <div className="text-8xl font-bold text-chart-tertiary mb-2">
              {activeProjectsCount || 0}
            </div>
          )}
          <p className="text-xl text-muted-foreground text-center">
            Projetos ativos nesta área
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
