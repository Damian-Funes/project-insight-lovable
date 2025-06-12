
import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  data_registro: string;
  horas_gastas: number;
  tipo_atividade: string;
  descricao_atividade?: string;
  projetos?: { nome_projeto: string };
  areas_produtivas?: { nome_area: string };
  ordem_producao?: { numero_op: string };
}

interface OptimizedActivitiesTableProps {
  activities: Activity[];
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export const OptimizedActivitiesTable = React.memo(({ 
  activities, 
  onEditActivity, 
  onDeleteActivity 
}: OptimizedActivitiesTableProps) => {
  const memoizedActivities = useMemo(() => {
    return activities.map((activity) => ({
      ...activity,
      formattedDate: format(new Date(activity.data_registro), "dd/MM/yyyy"),
      badgeVariant: activity.tipo_atividade === "Padrão" ? "default" : "destructive",
      badgeClass: activity.tipo_atividade === "Padrão" 
        ? "bg-metric-profit/10 text-metric-profit border-metric-profit" 
        : "bg-metric-cost/10 text-metric-cost border-metric-cost"
    }));
  }, [activities]);

  const handleEdit = React.useCallback((activity: Activity) => {
    onEditActivity(activity);
  }, [onEditActivity]);

  const handleDelete = React.useCallback((id: string) => {
    onDeleteActivity(id);
  }, [onDeleteActivity]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-muted-foreground">Data</TableHead>
            <TableHead className="text-muted-foreground">Projeto</TableHead>
            <TableHead className="text-muted-foreground">Área</TableHead>
            <TableHead className="text-muted-foreground">OP</TableHead>
            <TableHead className="text-muted-foreground">Horas</TableHead>
            <TableHead className="text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-muted-foreground">Descrição</TableHead>
            <TableHead className="text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memoizedActivities.map((activity) => (
            <TableRow key={activity.id} className="border-border hover:bg-muted/50">
              <TableCell className="text-foreground">
                {activity.formattedDate}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {activity.projetos?.nome_projeto || "N/A"}
              </TableCell>
              <TableCell className="text-foreground">
                {activity.areas_produtivas?.nome_area || "N/A"}
              </TableCell>
              <TableCell className="text-foreground">
                {activity.ordem_producao?.numero_op || "-"}
              </TableCell>
              <TableCell className="text-foreground">{activity.horas_gastas}h</TableCell>
              <TableCell>
                <Badge 
                  variant={activity.badgeVariant as "default" | "destructive"}
                  className={activity.badgeClass}
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
                    onClick={() => handleEdit(activity)}
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
                          onClick={() => handleDelete(activity.id)}
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
  );
});

OptimizedActivitiesTable.displayName = "OptimizedActivitiesTable";
