
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Plus, DollarSign, Clock, Users, TrendingUp, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-chart-primary/10 text-chart-primary border-chart-primary";
      case "Concluído": return "bg-metric-profit/10 text-metric-profit border-metric-profit";
      case "Cancelado": return "bg-metric-cost/10 text-metric-cost border-metric-cost";
      default: return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-chart-primary" />
          <span className="ml-2 text-muted-foreground">Carregando projetos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Erro ao carregar projetos</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Projetos</h1>
            <p className="text-muted-foreground">Acompanhe o progresso e custos dos projetos</p>
          </div>
        </div>
        <Button className="bg-chart-primary hover:bg-chart-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="metric-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{project.nome_projeto}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.descricao_projeto || "Sem descrição"}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(project.status_projeto)}>
                  {project.status_projeto}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilização do Orçamento</span>
                  <span className="text-foreground font-medium">{project.progress}%</span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="h-2"
                />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-metric-revenue" />
                    <span className="text-sm text-muted-foreground">Orçamento</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(project.budget)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gasto: {formatCurrency(project.spent)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-metric-efficiency" />
                    <span className="text-sm text-muted-foreground">Horas</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {project.totalHours.toFixed(1)}h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    registradas
                  </p>
                </div>
              </div>

              {/* Project Dates */}
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="block">Início</span>
                  <span className="font-medium text-foreground">
                    {formatDate(project.data_inicio)}
                  </span>
                </div>
                <div>
                  <span className="block">Prazo</span>
                  <span className="font-medium text-foreground">
                    {formatDate(project.data_termino_prevista)}
                  </span>
                </div>
              </div>

              {/* Cost Efficiency Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Status Financeiro</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-4 h-4 ${
                    project.progress <= 80 ? "text-metric-profit" : 
                    project.progress <= 100 ? "text-metric-warning" : "text-metric-cost"
                  }`} />
                  <span className={`text-sm font-medium ${
                    project.progress <= 80 ? "text-metric-profit" : 
                    project.progress <= 100 ? "text-metric-warning" : "text-metric-cost"
                  }`}>
                    {project.progress <= 80 ? "Dentro do orçamento" : 
                     project.progress <= 100 ? "Próximo do limite" : "Excedeu orçamento"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects && projects.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">Comece criando seu primeiro projeto</p>
            <Button className="bg-chart-primary hover:bg-chart-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
