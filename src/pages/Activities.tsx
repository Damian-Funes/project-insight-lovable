
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ActivityFormModal } from "@/components/ActivityFormModal";
import { useActivities } from "@/hooks/useActivities";
import { useDeleteActivity } from "@/hooks/useActivityMutations";
import { format } from "date-fns";

const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { data: activities = [], isLoading } = useActivities();
  const deleteMutation = useDeleteActivity();

  const handleNewActivity = () => {
    setSelectedActivity(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const totalHoursToday = activities
    .filter(activity => {
      const activityDate = new Date(activity.data_registro);
      const today = new Date();
      return activityDate.toDateString() === today.toDateString();
    })
    .reduce((sum, activity) => sum + Number(activity.horas_gastas), 0);

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
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="text-muted-foreground">Carregando atividades...</div>
            </div>
          ) : activities.length === 0 ? (
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Data</TableHead>
                    <TableHead className="text-muted-foreground">Projeto</TableHead>
                    <TableHead className="text-muted-foreground">Área</TableHead>
                    <TableHead className="text-muted-foreground">Horas</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Descrição</TableHead>
                    <TableHead className="text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id} className="border-border hover:bg-muted/50">
                      <TableCell className="text-foreground">
                        {format(new Date(activity.data_registro), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {activity.projetos?.nome_projeto || "N/A"}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {activity.areas_produtivas?.nome_area || "N/A"}
                      </TableCell>
                      <TableCell className="text-foreground">{activity.horas_gastas}h</TableCell>
                      <TableCell>
                        <Badge 
                          variant={activity.tipo_atividade === "Padrão" ? "default" : "destructive"}
                          className={activity.tipo_atividade === "Padrão" 
                            ? "bg-metric-profit/10 text-metric-profit border-metric-profit" 
                            : "bg-metric-cost/10 text-metric-cost border-metric-cost"
                          }
                        >
                          {activity.tipo_atividade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {activity.descricao_atividade || "Sem descrição"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteActivity(activity.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
        mode={modalMode}
      />
    </div>
  );
};

export default Activities;
