
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Bell } from "lucide-react";
import { useOperationalAlerts, useOperationalAlertsMutations } from "@/hooks/useOperationalAlerts";
import { OperationalAlertFormModal } from "@/components/OperationalAlertFormModal";
import { Database } from "@/integrations/supabase/types";

type AlertaOperacional = Database["public"]["Tables"]["alertas_operacionais"]["Row"];

const OperationalAlertsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertaOperacional | null>(null);
  
  const { data: alerts, isLoading } = useOperationalAlerts();
  const { updateAlert, deleteAlert } = useOperationalAlertsMutations();

  const handleCreateAlert = () => {
    setSelectedAlert(null);
    setIsModalOpen(true);
  };

  const handleEditAlert = (alert: AlertaOperacional) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (alert: AlertaOperacional) => {
    updateAlert.mutate({
      id: alert.id,
      ativo: !alert.ativo,
    });
  };

  const handleDeleteAlert = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este alerta?")) {
      deleteAlert.mutate(id);
    }
  };

  const getPriorityBadge = (prioridade: number) => {
    switch (prioridade) {
      case 3:
        return <Badge variant="destructive">Alta</Badge>;
      case 2:
        return <Badge variant="default" className="bg-yellow-500">Média</Badge>;
      default:
        return <Badge variant="secondary">Baixa</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Bell className="w-8 h-8 text-chart-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestão de Alertas Operacionais
            </h1>
            <p className="text-muted-foreground">
              Gerencie mensagens importantes para o painel operacional
            </p>
          </div>
        </div>
        <Button onClick={handleCreateAlert} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Novo Alerta</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : alerts && alerts.length > 0 ? (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`${!alert.ativo ? 'opacity-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{alert.mensagem}</CardTitle>
                      {getPriorityBadge(alert.prioridade)}
                      <Badge variant={alert.ativo ? "default" : "secondary"}>
                        {alert.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Criado em: {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                      {alert.data_inicio && (
                        <> • Início: {new Date(alert.data_inicio).toLocaleDateString('pt-BR')}</>
                      )}
                      {alert.data_fim && (
                        <> • Fim: {new Date(alert.data_fim).toLocaleDateString('pt-BR')}</>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(alert)}
                      className="flex items-center space-x-1"
                    >
                      {alert.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{alert.ativo ? "Desativar" : "Ativar"}</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAlert(alert)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum alerta criado
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Clique no botão "Novo Alerta" para criar seu primeiro alerta operacional.
            </p>
            <Button onClick={handleCreateAlert} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Alerta</span>
            </Button>
          </CardContent>
        </Card>
      )}

      <OperationalAlertFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedAlert}
      />
    </div>
  );
};

export default OperationalAlertsManagement;
