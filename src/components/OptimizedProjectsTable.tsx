
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface OptimizedProjectsTableProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

// Componente da linha do projeto memoizado para evitar re-renders desnecessários
const ProjectRow = React.memo(({ 
  project, 
  onEditProject, 
  onDeleteProject 
}: { 
  project: Project;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}) => {
  const getStatusColor = React.useMemo(() => {
    switch (project.status_projeto) {
      case "Ativo":
        return "bg-chart-primary/10 text-chart-primary border-chart-primary";
      case "Concluído":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }, [project.status_projeto]);

  const formattedDates = React.useMemo(() => ({
    inicio: project.data_inicio 
      ? format(new Date(project.data_inicio), "dd/MM/yyyy", { locale: ptBR })
      : "-",
    termino: project.data_termino_prevista
      ? format(new Date(project.data_termino_prevista), "dd/MM/yyyy", { locale: ptBR })
      : "-"
  }), [project.data_inicio, project.data_termino_prevista]);

  const formattedBudget = React.useMemo(() => 
    project.orcamento_total 
      ? new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(Number(project.orcamento_total))
      : "-"
  , [project.orcamento_total]);

  const handleEdit = React.useCallback(() => {
    onEditProject(project);
  }, [onEditProject, project]);

  const handleDelete = React.useCallback(() => {
    onDeleteProject(project.id);
  }, [onDeleteProject, project.id]);

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold text-foreground">{project.nome_projeto}</div>
          {project.descricao_projeto && (
            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.descricao_projeto}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor}>
          {project.status_projeto}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span>{formattedDates.inicio}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span>{formattedDates.termino}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1 text-sm">
          <DollarSign className="w-3 h-3 text-muted-foreground" />
          <span>{formattedBudget}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

ProjectRow.displayName = "ProjectRow";

export const OptimizedProjectsTable = React.memo(({
  projects,
  onEditProject,
  onDeleteProject
}: OptimizedProjectsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Término Previsto</TableHead>
            <TableHead>Orçamento</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OptimizedProjectsTable.displayName = "OptimizedProjectsTable";
