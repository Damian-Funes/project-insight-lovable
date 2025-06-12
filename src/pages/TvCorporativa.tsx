
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Tv } from "lucide-react";
import { AreaFilter } from "@/components/AreaFilter";
import { useAreas } from "@/hooks/useAreas";

const TvCorporativa = () => {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const { data: areas } = useAreas();

  const selectedAreaName = selectedArea === "all" 
    ? "Nenhuma Área Selecionada" 
    : areas?.find(area => area.id === selectedArea)?.nome_area || "Área Desconhecida";

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header otimizado para TV */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Tv className="w-12 h-12 text-chart-primary" />
            <div>
              <h1 className="text-6xl font-bold text-foreground leading-tight">
                Painel Operacional
              </h1>
              <p className="text-2xl text-chart-primary font-semibold mt-2">
                {selectedAreaName}
              </p>
            </div>
          </div>
        </div>
        
        {/* Seletor de Área - Tamanho grande para TV */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col gap-3">
            <label className="text-xl font-semibold text-foreground">
              Selecionar Área Produtiva
            </label>
            <div className="w-80">
              <AreaFilter
                selectedArea={selectedArea}
                onAreaChange={setSelectedArea}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1">
        {selectedArea === "all" ? (
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
        ) : (
          <div className="space-y-8">
            {/* Placeholder para futuras métricas da área selecionada */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-chart-primary flex items-center space-x-3">
                    <Monitor className="w-8 h-8" />
                    <span>Métricas em Tempo Real</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    Painel será implementado com métricas específicas da área selecionada.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-chart-secondary flex items-center space-x-3">
                    <Monitor className="w-8 h-8" />
                    <span>Indicadores de Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    KPIs e indicadores específicos serão exibidos aqui.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-chart-tertiary flex items-center space-x-3">
                    <Monitor className="w-8 h-8" />
                    <span>Status Operacional</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    Status e alertas operacionais da área.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvCorporativa;
