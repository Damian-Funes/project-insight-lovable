
import { useState } from "react";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useScenarioMutations } from "@/hooks/useScenarios";

interface ScenarioTableProps {
  scenarios: any[];
  isLoading: boolean;
  onEdit: (scenario: any) => void;
  onView: (scenario: any) => void;
}

export const ScenarioTable = ({ scenarios, isLoading, onEdit, onView }: ScenarioTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { deleteScenario, toggleScenarioStatus } = useScenarioMutations();

  const handleDelete = (id: string) => {
    deleteScenario.mutate(id);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleScenarioStatus.mutate({ id, ativo: !currentStatus });
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando cenários...</div>;
  }

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cenário encontrado. Crie seu primeiro cenário para começar.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Cenário</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Criado por</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell className="font-medium">{scenario.nome_cenario}</TableCell>
              <TableCell>
                {format(new Date(scenario.data_criacao), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>{scenario.profiles?.nome_completo || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={scenario.ativo ? "default" : "secondary"}>
                  {scenario.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(scenario)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(scenario)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(scenario.id, scenario.ativo)}
                    >
                      {scenario.ativo ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirm(scenario.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cenário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
