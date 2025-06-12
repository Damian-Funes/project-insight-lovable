
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { OptimizedProjectsTable } from "@/components/OptimizedProjectsTable";
import { ProjectsPagination } from "@/components/ProjectsPagination";
import { ProjectsEmptyState } from "@/components/ProjectsEmptyState";

interface Project {
  id: string;
  nome_projeto: string;
  descricao_projeto?: string;
  status_projeto: string;
  data_inicio?: string;
  data_termino_prevista?: string;
  orcamento_total?: number;
  created_at: string;
}

interface ProjectsContentProps {
  projects: Project[];
  searchTerm: string;
  status: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onPageChange: (page: number) => void;
}

export const ProjectsContent = React.memo(({
  projects,
  searchTerm,
  status,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onEditProject,
  onDeleteProject,
  onNewProject,
  onPageChange
}: ProjectsContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FolderOpen className="w-5 h-5 text-chart-secondary" />
          <span>Projetos Cadastrados</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <ProjectsEmptyState
            searchTerm={searchTerm}
            status={status}
            onNewProject={onNewProject}
          />
        ) : (
          <>
            <OptimizedProjectsTable
              projects={projects}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
});

ProjectsContent.displayName = "ProjectsContent";
