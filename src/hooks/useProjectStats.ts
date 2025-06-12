
import { useMemo } from "react";

interface Project {
  status_projeto: string;
}

interface ProjectStats {
  total: number;
  ativo: number;
  concluido: number;
  cancelado: number;
}

export const useProjectStats = (projects: Project[]): ProjectStats => {
  return useMemo(() => {
    if (!Array.isArray(projects)) {
      return {
        total: 0,
        ativo: 0,
        concluido: 0,
        cancelado: 0,
      };
    }

    const stats = projects.reduce((acc, project) => {
      if (project?.status_projeto) {
        acc[project.status_projeto] = (acc[project.status_projeto] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: projects.length,
      ativo: stats['Ativo'] || 0,
      concluido: stats['Concluído'] || 0,
      cancelado: stats['Cancelado'] || 0,
    };
  }, [projects]);
};
