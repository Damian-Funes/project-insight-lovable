
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectStatsType {
  total: number;
  ativo: number;
  concluido: number;
  cancelado: number;
}

interface ProjectsHeaderProps {
  totalCount: number;
  projectStats: ProjectStatsType;
  onNewProject: () => void;
}

export const ProjectsHeader = React.memo(({
  totalCount,
  projectStats,
  onNewProject
}: ProjectsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos e acompanhe o progresso • {totalCount} projetos
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
          Ativos: {projectStats.ativo}
        </Badge>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          Concluídos: {projectStats.concluido}
        </Badge>
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          Cancelados: {projectStats.cancelado}
        </Badge>
        <Button onClick={onNewProject} className="bg-chart-primary hover:bg-chart-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>
    </div>
  );
});

ProjectsHeader.displayName = "ProjectsHeader";
