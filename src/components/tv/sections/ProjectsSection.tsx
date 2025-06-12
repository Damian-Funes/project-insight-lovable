
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { ProjectProgressCard } from "@/components/ProjectProgressCard";

interface ProjectData {
  id: string;
  nome_projeto: string;
  progress: number;
  totalHours: number;
  orcamento_total: number | null;
}

interface ProjectsSectionProps {
  areaProjects: ProjectData[] | undefined;
  isLoading: boolean;
}

export const ProjectsSection = ({ areaProjects, isLoading }: ProjectsSectionProps) => {
  if (isLoading) {
    return (
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
    );
  }

  if (areaProjects && areaProjects.length > 0) {
    return (
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
    );
  }

  return (
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
  );
};
