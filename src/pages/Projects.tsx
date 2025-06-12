
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { useProjectsPaginated } from "@/hooks/useProjectsPaginated";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { useProjectStats } from "@/hooks/useProjectStats";
import { ProjectsFilters } from "@/components/ProjectsFilters";
import { ProjectsHeader } from "@/components/ProjectsHeader";
import { ProjectsContent } from "@/components/ProjectsContent";
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

  // Usar hook customizado para estatísticas
  const projectStats = useProjectStats(projects);

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
  const formInitialData = React.useMemo(() => {
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
            <Skeleton className="h-6 w-6" />
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
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
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
      <ProjectsHeader
        totalCount={totalCount}
        projectStats={projectStats}
        onNewProject={handleNewProject}
      />

      <ProjectsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      <ProjectsContent
        projects={projects}
        searchTerm={searchTerm}
        status={status}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={10}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onNewProject={handleNewProject}
        onPageChange={handlePageChange}
      />

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
