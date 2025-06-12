import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useOptimizedRevenues } from "@/hooks/useOptimizedRevenues";
import { useRevenueMutations } from "@/hooks/useRevenueMutations";
import { RevenueFormModal } from "@/components/RevenueFormModal";
import { RevenueTableSkeleton } from "@/components/OptimizedLoadingSpinner";

export default function RevenueManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState<string | null>(null);

  const { data: revenues, isLoading } = useOptimizedRevenues();
  const { deleteRevenue } = useRevenueMutations();

  const handleEdit = (revenue: any) => {
    setSelectedRevenue(revenue);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRevenueToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (revenueToDelete) {
      await deleteRevenue.mutateAsync(revenueToDelete);
      setDeleteDialogOpen(false);
      setRevenueToDelete(null);
    }
  };

  const handleNewRevenue = () => {
    setSelectedRevenue(null);
    setIsModalOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold">Gestão de Receitas</h1>
        </div>
        <Button onClick={handleNewRevenue} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nova Receita</span>
        </Button>
      </div>

      {/* Loading com skeleton otimizado */}
      {isLoading ? (
        <RevenueTableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Receitas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenues?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhuma receita encontrada. Clique em "Nova Receita" para adicionar.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  revenues?.map((revenue) => (
                    <TableRow key={revenue.id}>
                      <TableCell>{formatDate(revenue.data_receita)}</TableCell>
                      <TableCell>{revenue.projetos?.nome_projeto || "N/A"}</TableCell>
                      <TableCell>{formatCurrency(Number(revenue.valor_receita))}</TableCell>
                      <TableCell>{revenue.tipo_receita || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {revenue.descricao_receita || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(revenue)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(revenue.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <RevenueFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        revenue={selectedRevenue}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
