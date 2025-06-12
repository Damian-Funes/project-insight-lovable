
import { Card, CardContent } from "@/components/ui/card";
import { Monitor } from "lucide-react";

export const TvWelcomeCard = () => {
  return (
    <Card className="bg-card border-2 border-chart-primary/30">
      <CardContent className="flex flex-col items-center justify-center py-24">
        <Monitor className="w-32 h-32 text-chart-primary mb-8" />
        <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
          Selecione uma Área para Visualizar o Painel Operacional
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Escolha uma área produtiva no seletor acima para visualizar 
          as métricas e indicadores operacionais em tempo real.
        </p>
      </CardContent>
    </Card>
  );
};
