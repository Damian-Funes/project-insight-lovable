
import { useState, useCallback, useMemo } from "react";
import { useProjectsPaginated } from "@/hooks/useProjectsPaginated";
import { useProjectMutations } from "@/hooks/useProjectMutations";
import { useProjectStats } from "@/hooks/useProjectStats";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProjectFormData } from "@/components/ProjectFormModal";

export const useProjectsPageState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
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

  return {
    // Estado
    isModalOpen,
    selectedProject,
    modalMode,
    currentPage,
    searchTerm,
    status,
    
    // Dados
    projects,
    totalCount,
    totalPages,
    projectStats,
    isLoading,
    error,
    formInitialData,
    
    // Ações
    handleNewProject,
    handleEditProject,
    handleDeleteProject,
    handleModalClose,
    handleFormSubmit,
    handlePageChange,
    handleClearFilters,
    
    // Setters para filtros
    setSearchTerm,
    setStatus,
    
    // Estados de loading das mutações
    isSubmitting: createProject.isPending || updateProject.isPending,
  };
};
