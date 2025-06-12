
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Tv, FolderOpen } from "lucide-react";
import { AreaFilter } from "@/components/AreaFilter";
import { useAreas } from "@/hooks/useAreas";
import { useReworkMetrics } from "@/hooks/useReworkMetrics";
import { useAreaProjects } from "@/hooks/useAreaProjects";
import { ReworkChart } from "@/components/ReworkChart";
import { ProjectProgressCard } from "@/components/ProjectProgressCard";

const TvCorporativa = () => {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const { data: areas } = useAreas();
  const { data: reworkMetrics, isLoading: isLoadingRework } = useReworkMetrics(selectedArea);
  const { data: areaProjects, isLoading: isLoadingProjects } = useAreaProjects(selectedArea);

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
            {/* Primeira linha - Retrabalho */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ReworkChart
                  reworkPercentage={reworkMetrics?.reworkPercentage || 0}
                  reworkHours={reworkMetrics?.reworkHours || 0}
                  standardHours={reworkMetrics?.standardHours || 0}
                  isLoading={isLoadingRework}
                />
              </div>

              {/* Placeholder para futuras métricas */}
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

            {/* Segunda linha - Projetos Ativos */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground flex items-center space-x-4">
                  <FolderOpen className="w-10 h-10 text-chart-secondary" />
                  <span>Projetos Ativos da Área</span>
                </h2>
                <p className="text-xl text-muted-foreground mt-2">
                  Acompanhe o progresso dos principais projetos em andamento
                </p>
              </div>

              {isLoadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ProjectProgressCard
                      key={index}
                      id=""
                      nome_projeto=""
                      progress={0}
                      totalHours={0}
                      orcamento_total={null}
                      isLoading={true}
                    />
                  ))}
                </div>
              ) : areaProjects && areaProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {areaProjects.map((project) => (
                    <ProjectProgressCard
                      key={project.id}
                      id={project.id}
                      nome_projeto={project.nome_projeto}
                      progress={project.progress}
                      totalHours={project.totalHours}
                      orcamento_total={project.orcamento_total}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-card border border-dashed border-chart-secondary/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FolderOpen className="w-16 h-16 text-chart-secondary mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Nenhum Projeto Ativo
                    </h3>
                    <p className="text-lg text-muted-foreground text-center">
                      Não há projetos ativos com atividades registradas para esta área.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvCorporativa;
