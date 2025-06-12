
import React, { useMemo, useCallback, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import { ActivityFormModal } from "@/components/ActivityFormModal";
import { useActivities } from "@/hooks/useActivities";
import { useDeleteActivity } from "@/hooks/useActivityMutations";
import { OptimizedActivitiesTable } from "@/components/OptimizedActivitiesTable";
import { Skeleton } from "@/components/ui/skeleton";

const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { data: activities = [], isLoading } = useActivities();
  const deleteMutation = useDeleteActivity();

  const totalHoursToday = useMemo(() => {
    const today = new Date();
    return activities
      .filter(activity => {
        const activityDate = new Date(activity.data_registro);
        return activityDate.toDateString() === today.toDateString();
      })
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
            <p className="text-muted-foreground">Registre as horas trabalhadas em projetos</p>
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
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma atividade registrada</h3>
              <p className="text-muted-foreground mb-4">Comece registrando sua primeira atividade.</p>
              <Button onClick={handleNewActivity} className="bg-chart-primary hover:bg-chart-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primeira Atividade
              </Button>
            </div>
          ) : (
            <OptimizedActivitiesTable
              activities={activities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
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
