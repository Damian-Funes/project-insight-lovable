
import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Play, CheckCircle, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OrdemProducaoFormModal } from "@/components/OrdemProducaoFormModal";
import { useOrdemProducao } from "@/hooks/useOrdemProducao";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { Database } from "@/integrations/supabase/types";

type OrdemProducao = Database["public"]["Tables"]["ordem_producao"]["Row"];

const statusColors = {
  'Pendente': 'bg-gray-100 text-gray-800',
  'Em Andamento': 'bg-blue-100 text-blue-800',
  'Concluída': 'bg-green-100 text-green-800',
  'Atrasada': 'bg-red-100 text-red-800',
  'Cancelada': 'bg-red-100 text-red-800',
};

export default function OrdemProducaoManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrdem, setEditingOrdem] = useState<OrdemProducao | null>(null);
  const [filterProjeto, setFilterProjeto] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const {
    ordensProducao,
    isLoading,
    createOrdemProducao,
    updateOrdemProducao,
    deleteOrdemProducao,
    updateStatus,
  } = useOrdemProducao();

  const { data: projects } = useProjects();
  const { data: areas } = useAreas();

  const filteredOrdens = useMemo(() => {
    if (!ordensProducao) return [];

    return ordensProducao.filter((ordem) => {
      const matchesProjeto = filterProjeto === "all" || ordem.projeto_id === filterProjeto;
      const matchesArea = filterArea === "all" || ordem.area_responsavel_id === filterArea;
      const matchesStatus = filterStatus === "all" || ordem.status_op === filterStatus;

      return matchesProjeto && matchesArea && matchesStatus;
    });
  }, [ordensProducao, filterProjeto, filterArea, filterStatus]);

  const handleCreateOrdem = (data: any) => {
    createOrdemProducao.mutate({
      numero_op: data.numero_op,
      projeto_id: data.projeto_id,
      area_responsavel_id: data.area_responsavel_id,
      data_inicio_prevista: format(data.data_inicio_prevista, "yyyy-MM-dd"),
      data_fim_prevista: format(data.data_fim_prevista, "yyyy-MM-dd"),
      descricao_op: data.descricao_op,
    });
  };

  const handleUpdateOrdem = (data: any) => {
    if (!editingOrdem) return;

    updateOrdemProducao.mutate({
      id: editingOrdem.id,
      numero_op: data.numero_op,
      projeto_id: data.projeto_id,
      area_responsavel_id: data.area_responsavel_id,
      data_inicio_prevista: format(data.data_inicio_prevista, "yyyy-MM-dd"),
      data_fim_prevista: format(data.data_fim_prevista, "yyyy-MM-dd"),
      descricao_op: data.descricao_op,
    });
    setEditingOrdem(null);
  };

  const handleDeleteOrdem = (id: string) => {
    deleteOrdemProducao.mutate(id);
  };

  const handleIniciarOrdem = (id: string) => {
    updateStatus.mutate({
      id,
      status: "Em Andamento",
      dataInicioReal: new Date().toISOString(),
    });
  };

  const handleConcluirOrdem = (id: string) => {
    updateStatus.mutate({
      id,
      status: "Concluída",
      dataFimReal: new Date().toISOString(),
    });
  };

  const openEditModal = (ordem: OrdemProducao) => {
    setEditingOrdem(ordem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrdem(null);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Gestão de OPs (PCP)
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Ordem de Produção
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Projeto</label>
              <Select value={filterProjeto} onValueChange={setFilterProjeto}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os projetos</SelectItem>
                  {projects?.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.nome_projeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Área Responsável</label>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  {areas?.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.nome_area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ordens de Produção */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número da OP</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Área Responsável</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdens.map((ordem) => (
                  <TableRow key={ordem.id}>
                    <TableCell className="font-medium">{ordem.numero_op}</TableCell>
                    <TableCell>{ordem.projetos?.nome_projeto}</TableCell>
                    <TableCell>{ordem.areas_produtivas?.nome_area}</TableCell>
                    <TableCell>
                      {format(new Date(ordem.data_inicio_prevista), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(ordem.data_fim_prevista), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[ordem.status_op as keyof typeof statusColors]}
                      >
                        {ordem.status_op}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ordem.status_op === "Pendente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIniciarOrdem(ordem.id)}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Iniciar
                          </Button>
                        )}
                        
                        {ordem.status_op === "Em Andamento" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConcluirOrdem(ordem.id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Concluir
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(ordem)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a OP "{ordem.numero_op}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrdem(ordem.id)}
                                className="bg-red-600 hover:bg-red-700"
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

            {filteredOrdens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma ordem de produção encontrada com os filtros selecionados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <OrdemProducaoFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingOrdem ? handleUpdateOrdem : handleCreateOrdem}
        ordemProducao={editingOrdem}
        isLoading={createOrdemProducao.isPending || updateOrdemProducao.isPending}
      />
    </div>
  );
}
