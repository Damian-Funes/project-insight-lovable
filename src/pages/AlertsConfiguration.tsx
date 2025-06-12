
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AlertFormModal } from "@/components/AlertFormModal";
import { useAlerts } from "@/hooks/useAlerts";
import { Database } from "@/integrations/supabase/types";

type AlertasConfig = Database["public"]["Tables"]["alertas_config"]["Row"];

const AlertsConfiguration = () => {
  const { alerts, isLoading, deleteAlert, toggleAlert } = useAlerts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<AlertasConfig | null>(null);

  const handleEdit = (alert: AlertasConfig) => {
    setAlertToEdit(alert);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setAlertToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteAlert.mutateAsync(id);
  };

  const handleToggleStatus = async (alert: AlertasConfig) => {
    await toggleAlert.mutateAsync({
      id: alert.id,
      ativo: !alert.ativo,
    });
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Orçamento Excedido":
        return "destructive";
      case "Prazo Próximo":
        return "secondary";
      case "Registro Pendente":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuração de Alertas</h1>
          <p className="text-muted-foreground mt-2">
            Configure alertas personalizados para monitorar projetos e atividades
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Alerta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Carregando alertas...</div>
            </div>
          ) : alerts && alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Alerta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destinatários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.nome_alerta}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(alert.tipo_alerta)}>
                        {alert.tipo_alerta}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={alert.condicao}>
                      {alert.condicao}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alert.ativo}
                          onCheckedChange={() => handleToggleStatus(alert)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {alert.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={alert.destinatarios}>
                      {alert.destinatarios}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(alert)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o alerta "{alert.nome_alerta}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(alert.id)}
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum alerta configurado ainda.</p>
              <p className="text-sm mt-2">Clique em "Novo Alerta" para criar seu primeiro alerta.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alertToEdit={alertToEdit}
      />
    </div>
  );
};

export default AlertsConfiguration;
