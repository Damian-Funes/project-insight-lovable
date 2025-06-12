
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

interface ProjectsEmptyStateProps {
  searchTerm: string;
  status: string;
  onNewProject: () => void;
}

export const ProjectsEmptyState = React.memo(({
  searchTerm,
  status,
  onNewProject
}: ProjectsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        {searchTerm || status 
          ? "Nenhum projeto encontrado" 
          : "Nenhum projeto cadastrado"
        }
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm || status
          ? "Tente ajustar os filtros ou limpar a busca."
          : "Comece criando seu primeiro projeto."
        }
      </p>
      <Button onClick={onNewProject} className="bg-chart-primary hover:bg-chart-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        Criar Projeto
      </Button>
    </div>
  );
});

ProjectsEmptyState.displayName = "ProjectsEmptyState";
