
import { useState } from "react";
import { Plus, Edit, Trash2, Play, Pause, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PredictiveModelFormModal } from "@/components/PredictiveModelFormModal";
import { CostPredictionDashboard } from "@/components/CostPredictionDashboard";
import { AnomalyDetectionDashboard } from "@/components/AnomalyDetectionDashboard";
import { usePredictiveModels } from "@/hooks/usePredictiveModels";
import { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type ModelosPreditivos = Database["public"]["Tables"]["modelos_preditivos"]["Row"];

export default function PredictiveModels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelosPreditivos | null>(null);

  const { models = [], isLoading, deleteModel, toggleModelStatus } = usePredictiveModels();

  const handleCreateNew = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (model: ModelosPreditivos) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingModel(null);
  };

  const handleDelete = async (id: string) => {
    await deleteModel.mutateAsync(id);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    await toggleModelStatus.mutateAsync({ id, status_modelo: newStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo":
        return "default";
      case "Em Treinamento":
        return "secondary";
      case "Inativo":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTipoModeloBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Regressão":
        return "default";
      case "Classificação":
        return "secondary";
      case "Detecção de Anomalias":
        return "destructive";
      case "Séries Temporais":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Análise Preditiva
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie modelos de machine learning, visualize previsões de custos e detecte anomalias
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Modelo
        </Button>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Previsão de Custos
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Detecção de Anomalias
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Modelos Preditivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <CostPredictionDashboard />
        </TabsContent>

        <TabsContent value="anomalies">
          <AnomalyDetectionDashboard />
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Modelos Preditivos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Carregando modelos...</div>
              ) : models.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum modelo preditivo encontrado. Crie o primeiro modelo!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Modelo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Treinamento</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{model.nome_modelo}</div>
                            {model.descricao_modelo && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {model.descricao_modelo}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTipoModeloBadgeVariant(model.tipo_modelo)}>
                            {model.tipo_modelo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(model.status_modelo)}>
                            {model.status_modelo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {model.data_treinamento 
                            ? format(new Date(model.data_treinamento), "dd/MM/yyyy HH:mm")
                            : "Não treinado"
                          }
                        </TableCell>
                        <TableCell>
                          {format(new Date(model.created_at), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(model.id, model.status_modelo)}
                              disabled={model.status_modelo === "Em Treinamento"}
                            >
                              {model.status_modelo === "Ativo" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(model)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o modelo "{model.nome_modelo}"? 
                                    Esta ação não pode ser desfeita e todos os resultados preditivos 
                                    associados também serão removidos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(model.id)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PredictiveModelFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modelToEdit={editingModel}
      />
    </div>
  );
}
