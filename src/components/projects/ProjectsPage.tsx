
import React from "react";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { ProjectsFilters } from "@/components/ProjectsFilters";
import { ProjectsHeader } from "@/components/ProjectsHeader";
import { ProjectsContent } from "@/components/ProjectsContent";
import { ProjectsLoadingState } from "./ProjectsLoadingState";
import { ProjectsErrorState } from "./ProjectsErrorState";
import { useProjectsPageState } from "@/hooks/useProjectsPageState";

export const ProjectsPage = React.memo(() => {
  const {
    // Estado
    isModalOpen,
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
    isSubmitting,
  } = useProjectsPageState();

  if (isLoading) {
    return <ProjectsLoadingState />;
  }

  if (error) {
    return <ProjectsErrorState error={error} />;
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
        onOpenChange={handleModalClose}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        isLoading={isSubmitting}
      />
    </div>
  );
});

ProjectsPage.displayName = "ProjectsPage";
