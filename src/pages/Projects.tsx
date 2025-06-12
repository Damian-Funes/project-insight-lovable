
import React, { useMemo, useCallback, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useProjectsPaginated } from "@/hooks/useProjectsPaginated";
import { useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjectMutations";
import { ProjectFormModal, type ProjectFormData } from "@/components/ProjectFormModal";
import { ProjectsFilters } from "@/components/ProjectsFilters";
import { ProjectsPagination } from "@/components/ProjectsPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Estados de filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  // Usar debounce para otimizar buscas
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedStatus = useDebounce(status, 100);

  const { data, isLoading, error } = useProjectsPaginated({
    page: currentPage,
    pageSize: 10,
    status: debouncedStatus || undefined,
    searchTerm: debouncedSearchTerm || undefined,
  });

  const projects = data?.projects || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Ativo": return "bg-chart-primary/10 text-chart-primary border-chart-primary";
      case "Concluído": return "bg-metric-profit/10 text-metric-profit border-metric-profit";
      case "Cancelado": return "bg-metric-cost/10 text-metric-cost border-metric-cost";
      default: return "bg-muted/10 text-muted-foreground border-border";
    }
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString('pt-BR');
  }, []);

  const handleCreateProject = useCallback(() => {
    setEditingProject(null);
    setIsModalOpen(true);
  }, []);

  const handleEditProject = useCallback((project: any) => {
    setEditingProject({
      ...project,
      data_inicio: project.data_inicio ? new Date(project.data_inicio) : undefined,
      data_termino_prevista: project.data_termino_prevista ? new Date(project.data_termino_prevista) : undefined,
    });
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (data: ProjectFormData) => {
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
  }, [editingProject, updateProject, createProject]);

  const handleDeleteProject = useCallback(async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
    }
  }, [deleteProject]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingProject(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("");
    setCurrentPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
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
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os projetos da empresa • {totalCount} projetos
            </p>
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

      <ProjectsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-chart-secondary" />
            <span>Lista de Projetos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
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
              <Button 
                onClick={handleCreateProject}
                className="bg-chart-primary hover:bg-chart-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Projeto
              </Button>
            </div>
          ) : (
            <>
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
              <ProjectsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={10}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ProjectFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSubmit={handleSubmit}
        initialData={editingProject}
        isLoading={createProject.isPending || updateProject.isPending}
      />
    </div>
  );
};

export default Projects;
