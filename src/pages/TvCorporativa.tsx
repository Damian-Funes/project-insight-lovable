
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Tv, FolderOpen, RotateCcw, TrendingUp } from "lucide-react";
import { AreaFilter } from "@/components/AreaFilter";
import { useAreas } from "@/hooks/useAreas";
import { useReworkMetrics } from "@/hooks/useReworkMetrics";
import { useAreaProjects } from "@/hooks/useAreaProjects";
import { ReworkChart } from "@/components/ReworkChart";
import { ProjectProgressCard } from "@/components/ProjectProgressCard";

const TvCorporativa = () => {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  const { data: areas } = useAreas();
  const { data: reworkMetrics, isLoading: isLoadingRework } = useReworkMetrics(selectedArea);
  const { data: areaProjects, isLoading: isLoadingProjects } = useAreaProjects(selectedArea);

  const selectedAreaName = selectedArea === "all" 
    ? "Nenhuma Área Selecionada" 
    : areas?.find(area => area.id === selectedArea)?.nome_area || "Área Desconhecida";

  // Configuração da rotação automática
  const ROTATION_INTERVAL = 12000; // 12 segundos
  const TRANSITION_DURATION = 500; // 0.5 segundos

  // Seções disponíveis quando uma área está selecionada
  const sections = [
    {
      id: 'rework',
      title: 'Indicadores de Retrabalho',
      icon: RotateCcw,
    },
    {
      id: 'projects',
      title: 'Projetos Ativos',
      icon: FolderOpen,
    },
    {
      id: 'performance',
      title: 'Indicadores de Performance',
      icon: TrendingUp,
    },
  ];

  // Effect para rotação automática
  useEffect(() => {
    if (selectedArea === "all") return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSection((prev) => (prev + 1) % sections.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedArea]);

  // Reset da seção atual quando área muda
  useEffect(() => {
    setCurrentSection(0);
    setIsTransitioning(false);
  }, [selectedArea]);

  const renderCurrentSection = () => {
    const currentSectionData = sections[currentSection];
    
    switch (currentSectionData.id) {
      case 'rework':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ReworkChart
                reworkPercentage={reworkMetrics?.reworkPercentage || 0}
                reworkHours={reworkMetrics?.reworkHours || 0}
                standardHours={reworkMetrics?.standardHours || 0}
                isLoading={isLoadingRework}
              />
            </div>
            
            {/* Cards complementares para a seção de retrabalho */}
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
        
      case 'projects':
        return (
          <div>
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
        );
        
      case 'performance':
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
        
      default:
        return null;
    }
  };

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
            {/* Indicador da seção atual */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-3">
                {sections[currentSection].icon && React.createElement(sections[currentSection].icon, {
                  className: "w-10 h-10 text-chart-primary"
                })}
                <h2 className="text-3xl font-bold text-foreground">
                  {sections[currentSection].title}
                </h2>
              </div>
              
              {/* Indicadores de paginação */}
              <div className="flex space-x-2 ml-8">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentSection 
                        ? 'bg-chart-primary' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Conteúdo da seção atual com transições */}
            <div 
              className={`transition-all duration-500 ${
                isTransitioning 
                  ? 'opacity-0 transform scale-95' 
                  : 'opacity-100 transform scale-100'
              }`}
            >
              {renderCurrentSection()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvCorporativa;
