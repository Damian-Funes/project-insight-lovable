
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Play, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useUserTasks } from "@/hooks/useUserTasks";
import { useTaskMutations } from "@/hooks/useTaskMutations";

const statusColors = {
  'Pendente': 'bg-gray-100 text-gray-800',
  'Em Andamento': 'bg-blue-100 text-blue-800',
  'Concluída': 'bg-green-100 text-green-800',
  'Atrasada': 'bg-red-100 text-red-800',
  'Cancelada': 'bg-red-100 text-red-800',
};

export default function MinhasTarefas() {
  const { data: tasks, isLoading, error } = useUserTasks();
  const { iniciarOP, concluirOP, isLoading: isUpdating } = useTaskMutations();

  const getDateStatus = (dataInicio: string) => {
    const hoje = new Date();
    const dataInicioDate = new Date(dataInicio);
    const diffDays = Math.ceil((dataInicioDate.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { icon: AlertTriangle, color: "text-red-600", label: "Atrasada" };
    } else if (diffDays === 0) {
      return { icon: Clock, color: "text-orange-600", label: "Hoje" };
    } else {
      return { icon: Clock, color: "text-blue-600", label: `${diffDays} dias` };
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar tarefas</h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Minhas Tarefas (OPs)
        </h1>
        <p className="text-muted-foreground">
          Ordens de Produção sob sua responsabilidade que precisam de atenção
        </p>
      </div>

      {!tasks || tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa pendente</h3>
            <p className="text-muted-foreground">
              Você não possui Ordens de Produção pendentes no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const dateStatus = getDateStatus(task.data_inicio_prevista);
            const DateIcon = dateStatus.icon;

            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{task.numero_op}</CardTitle>
                      <Badge
                        className={statusColors[task.status_op as keyof typeof statusColors]}
                      >
                        {task.status_op}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <DateIcon className={`w-4 h-4 ${dateStatus.color}`} />
                      <span className={`text-sm font-medium ${dateStatus.color}`}>
                        {dateStatus.label}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Descrição</h4>
                      <p className="text-muted-foreground">{task.descricao_op}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Projeto</h4>
                        <p className="text-muted-foreground">{task.projetos?.nome_projeto}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Data Início Prevista</h4>
                        <p className="text-muted-foreground">
                          {format(new Date(task.data_inicio_prevista), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {task.status_op === "Pendente" && (
                        <Button
                          onClick={() => iniciarOP(task.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Play className="w-4 h-4" />
                          Marcar como Iniciada
                        </Button>
                      )}
                      
                      {task.status_op === "Em Andamento" && (
                        <Button
                          onClick={() => concluirOP(task.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-2"
                          size="sm"
                          variant="outline"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Marcar como Concluída
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
