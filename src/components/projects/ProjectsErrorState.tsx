
import React from "react";
import { Button } from "@/components/ui/button";

interface ProjectsErrorStateProps {
  error: Error;
}

export const ProjectsErrorState = React.memo(({ error }: ProjectsErrorStateProps) => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Erro ao carregar projetos</p>
          <p className="text-sm text-muted-foreground">
            {error.message || "Erro desconhecido"}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
});

ProjectsErrorState.displayName = "ProjectsErrorState";
