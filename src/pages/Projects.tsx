
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjectMutations";
import { ProjectFormModal, type ProjectFormData } from "@/components/ProjectFormModal";
import { useState } from "react";

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-chart-primary/10 text-chart-primary border-chart-primary";
      case "Concluído": return "bg-metric-profit/10 text-metric-profit border-metric-profit";
      case "Cancelado": return "bg-metric-cost/10 text-metric-cost border-metric-cost";
      default: return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject({
      ...project,
      data_inicio: project.data_inicio ? new Date(project.data_inicio) : undefined,
      data_termino_prevista: project.data_termino_prevista ? new Date(project.data_termino_prevista) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, data });
      } else {
        await createProject.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-chart-primary" />
          <span className="ml-2 text-muted-foreground">Carregando projetos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Erro ao carregar projetos</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Projetos</h1>
            <p className="text-muted-foreground">Gerencie todos os projetos da empresa</p>
          </div>
        </div>
        <Button 
          onClick={handleCreateProject}
          className="bg-chart-primary hover:bg-chart-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <Card className="metric-card">
        <CardHeader>
          <CardTitle>Lista de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {projects && projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Orçamento Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{project.nome_projeto}</p>
                        {project.descricao_projeto && (
                          <p className="text-sm text-muted-foreground">
                            {project.descricao_projeto}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(project.status_projeto)}>
                        {project.status_projeto}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(project.data_inicio)}</TableCell>
                    <TableCell>
                      {project.orcamento_total ? formatCurrency(project.orcamento_total) : "Não definido"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o projeto "{project.nome_projeto}"? 
                                Esta ação não pode ser desfeita e todos os registros de atividades 
                                relacionados também serão removidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum projeto encontrado</p>
              <Button 
                onClick={handleCreateProject}
                className="bg-chart-primary hover:bg-chart-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        initialData={editingProject}
        isLoading={createProject.isPending || updateProject.isPending}
      />
    </div>
  );
};

export default Projects;
