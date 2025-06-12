
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useAreas } from "@/hooks/useAreas";
import { useCreateArea, useUpdateArea, useDeleteArea, type AreaFormData } from "@/hooks/useAreaMutations";
import { AreaFormModal } from "@/components/AreaFormModal";

const AreaManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<any>(null);

  const { data: areas = [], isLoading } = useAreas();
  const createAreaMutation = useCreateArea();
  const updateAreaMutation = useUpdateArea();
  const deleteAreaMutation = useDeleteArea();

  const handleCreateArea = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleEditArea = (area: any) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleDeleteArea = (area: any) => {
    setAreaToDelete(area);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (areaToDelete) {
      deleteAreaMutation.mutate(areaToDelete.id);
      setIsDeleteDialogOpen(false);
      setAreaToDelete(null);
    }
  };

  const handleSubmit = (data: AreaFormData) => {
    if (selectedArea) {
      updateAreaMutation.mutate(
        { id: selectedArea.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createAreaMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Áreas</h1>
            <p className="text-muted-foreground">Gerencie as áreas produtivas da empresa</p>
          </div>
        </div>
        <Button 
          onClick={handleCreateArea}
          className="bg-chart-primary hover:bg-chart-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Área
        </Button>
      </div>

      <Card className="metric-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-chart-secondary to-chart-tertiary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Áreas Produtivas</CardTitle>
              <p className="text-sm text-muted-foreground">
                {areas.length} {areas.length === 1 ? 'área cadastrada' : 'áreas cadastradas'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Carregando áreas...</p>
            </div>
          ) : areas.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Nenhuma área cadastrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Área</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Custo/Hora</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">
                      {area.nome_area}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {area.descricao_area || "Sem descrição"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
                        {formatCurrency(area.custo_hora_padrao || 0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditArea(area)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArea(area)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AreaFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        initialData={selectedArea}
        isLoading={createAreaMutation.isPending || updateAreaMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir a área "{areaToDelete?.nome_area}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AreaManagement;
