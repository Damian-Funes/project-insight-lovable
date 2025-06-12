
import { useMemo } from "react";

interface Project {
  status_projeto: string;
}

export const useProjectStats = (projects: Project[]) => {
  return useMemo(() => {
    const stats = projects.reduce((acc, project) => {
      acc[project.status_projeto] = (acc[project.status_projeto] || 0) + 1;
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
