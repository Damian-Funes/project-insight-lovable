
import React, { useMemo, useCallback, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import { ActivityFormModal } from "@/components/ActivityFormModal";
import { useActivitiesPaginated } from "@/hooks/useActivitiesPaginated";
import { useDeleteActivity } from "@/hooks/useActivityMutations";
import { OptimizedActivitiesTable } from "@/components/OptimizedActivitiesTable";
import { ActivitiesFilters } from "@/components/ActivitiesFilters";
import { ActivitiesPagination } from "@/components/ActivitiesPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Estados de filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [projectId, setProjectId] = useState("");

  // Usar debounce para otimizar buscas
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedProjectId = useDebounce(projectId, 100);

  // Configurar filtros padrão para os últimos 30 dias se não houver filtro de data
  const defaultDateFrom = useMemo(() => {
    if (dateFrom) return dateFrom;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  }, [dateFrom]);

  const { data, isLoading } = useActivitiesPaginated({
    page: currentPage,
    pageSize: 20,
    dateFrom: defaultDateFrom,
    dateTo: dateTo || undefined,
    projectId: debouncedProjectId || undefined,
    searchTerm: debouncedSearchTerm || undefined,
  });

  const activities = data?.activities || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const deleteMutation = useDeleteActivity();

  // Calcular horas do dia atual (otimizado)
  const totalHoursToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return activities
      .filter(activity => activity.data_registro === today)
      .reduce((sum, activity) => sum + Number(activity.horas_gastas), 0);
  }, [activities]);

  const handleNewActivity = useCallback(() => {
    setSelectedActivity(null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const handleEditActivity = useCallback((activity: any) => {
    setSelectedActivity(activity);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleDeleteActivity = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setProjectId("");
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
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-32" />
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

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Atividades</h1>
            <p className="text-muted-foreground">
              Registre as horas trabalhadas em projetos • {totalCount} atividades
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
            <Clock className="w-3 h-3 mr-1" />
            Hoje: {totalHoursToday.toFixed(1)}h registradas
          </Badge>
          <Button onClick={handleNewActivity} className="bg-chart-primary hover:bg-chart-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <ActivitiesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        projectId={projectId}
        onProjectChange={setProjectId}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-chart-secondary" />
            <span>Atividades Registradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || projectId || dateFrom || dateTo 
                  ? "Nenhuma atividade encontrada" 
                  : "Nenhuma atividade registrada"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || projectId || dateFrom || dateTo
                  ? "Tente ajustar os filtros ou limpar a busca."
                  : "Comece registrando sua primeira atividade."
                }
              </p>
              <Button onClick={handleNewActivity} className="bg-chart-primary hover:bg-chart-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Atividade
              </Button>
            </div>
          ) : (
            <>
              <OptimizedActivitiesTable
                activities={activities}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
              />
              <ActivitiesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={20}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={selectedActivity}
        mode={modalMode}
      />
    </div>
  );
};

export default Activities;
