import React, { useMemo, useCallback, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen } from "lucide-react";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { useProjectsPaginated } from "@/hooks/useProjectsPaginated";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { ProjectsFilters } from "@/components/ProjectsFilters";
import { ProjectsPagination } from "@/components/ProjectsPagination";
import { OptimizedProjectsTable } from "@/components/OptimizedProjectsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProjectFormData } from "@/components/ProjectFormModal";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Estados de filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  // Usar debounce para otimizar buscas
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, error } = useProjectsPaginated({
    page: currentPage,
    pageSize: 10,
    status: status || undefined,
    searchTerm: debouncedSearchTerm || undefined,
  });

  const projects = data?.projects || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const { createProject, updateProject, deleteProject } = useProjectMutations();

  // Memoizar estatísticas dos projetos
  const projectStats = useMemo(() => {
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

  const handleNewProject = useCallback(() => {
    setSelectedProject(null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const handleEditProject = useCallback((project: any) => {
    setSelectedProject(project);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleDeleteProject = useCallback(async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      await deleteProject.mutateAsync(id);
    }
  }, [deleteProject]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleFormSubmit = useCallback(async (data: ProjectFormData) => {
    try {
      if (modalMode === "create") {
        await createProject.mutateAsync(data);
      } else if (selectedProject) {
        await updateProject.mutateAsync({ id: selectedProject.id, data });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  }, [modalMode, selectedProject, createProject, updateProject]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("");
    setCurrentPage(1);
  }, []);

  // Preparar dados iniciais do form
  const formInitialData = useMemo(() => {
    if (modalMode === "edit" && selectedProject) {
      return {
        nome_projeto: selectedProject.nome_projeto,
        descricao_projeto: selectedProject.descricao_projeto || "",
        status_projeto: selectedProject.status_projeto,
        data_inicio: selectedProject.data_inicio ? new Date(selectedProject.data_inicio) : undefined,
        data_termino_prevista: selectedProject.data_termino_prevista ? new Date(selectedProject.data_termino_prevista) : undefined,
        orcamento_total: selectedProject.orcamento_total || 0,
      };
    }
    return undefined;
  }, [modalMode, selectedProject]);

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
          <div className="flex items-center space-x-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
            <Skeleton className="h-10 w-32" />
          </div>
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
          <Button onClick={handleNewProject} className="bg-chart-primary hover:bg-chart-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      <ProjectsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-chart-secondary" />
            <span>Projetos Cadastrados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
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
              <Button onClick={handleNewProject} className="bg-chart-primary hover:bg-chart-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Criar Projeto
              </Button>
            </div>
          ) : (
            <>
              <OptimizedProjectsTable
                projects={projects}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
              />
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
        onOpenChange={setIsModalOpen}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        isLoading={createProject.isPending || updateProject.isPending}
      />
    </div>
  );
};

export default Projects;
