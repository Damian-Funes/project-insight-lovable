
import { Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const PageLoadingFallback = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Logo/Ícone */}
          <div className="w-16 h-16 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-xl flex items-center justify-center animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          
          {/* Spinner animado */}
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-chart-primary" />
            <span className="text-lg font-medium text-foreground">
              Carregando página...
            </span>
          </div>
          
          {/* Barra de progresso animada */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-chart-primary to-chart-secondary rounded-full animate-pulse"></div>
          </div>
          
          {/* Texto de carregamento */}
          <p className="text-sm text-muted-foreground text-center">
            Preparando sua experiência...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
