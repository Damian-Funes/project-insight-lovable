
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Plus, DollarSign, Clock, Users, TrendingUp } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Projeto Alpha",
      description: "Sistema de gestão de vendas e CRM",
      status: "Em Andamento",
      budget: 150000,
      spent: 87500,
      startDate: "2024-03-15",
      endDate: "2024-08-30",
      progress: 58,
      team: ["Desenvolvimento", "Design", "QA"],
      hoursWorked: 420,
      estimatedHours: 720
    },
    {
      id: 2,
      name: "Projeto Beta",
      description: "Aplicativo móvel para delivery",
      status: "Planejamento",
      budget: 80000,
      spent: 12000,
      startDate: "2024-06-01",
      endDate: "2024-10-15",
      progress: 15,
      team: ["Desenvolvimento", "Design"],
      hoursWorked: 85,
      estimatedHours: 560
    },
    {
      id: 3,
      name: "Projeto Gamma",
      description: "Portal de relatórios executivos",
      status: "Finalizado",
      budget: 95000,
      spent: 92000,
      startDate: "2024-01-10",
      endDate: "2024-05-20",
      progress: 100,
      team: ["Desenvolvimento", "DevOps"],
      hoursWorked: 645,
      estimatedHours: 650
    },
    {
      id: 4,
      name: "Projeto Delta",
      description: "Sistema de integração com APIs",
      status: "Em Andamento",
      budget: 60000,
      spent: 35000,
      startDate: "2024-04-01",
      endDate: "2024-07-15",
      progress: 72,
      team: ["Desenvolvimento", "DevOps", "QA"],
      hoursWorked: 245,
      estimatedHours: 340
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-chart-primary/10 text-chart-primary border-chart-primary";
      case "Planejamento": return "bg-metric-warning/10 text-metric-warning border-metric-warning";
      case "Finalizado": return "bg-metric-profit/10 text-metric-profit border-metric-profit";
      default: return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-metric-profit";
    if (progress >= 70) return "bg-chart-primary";
    if (progress >= 40) return "bg-metric-warning";
    return "bg-metric-cost";
  };

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
        {projects.map((project) => (
          <Card key={project.id} className="metric-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
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
                    R$ {(project.budget / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gasto: R$ {(project.spent / 1000).toFixed(0)}K ({((project.spent / project.budget) * 100).toFixed(0)}%)
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-metric-efficiency" />
                    <span className="text-sm text-muted-foreground">Horas</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {project.hoursWorked}h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {project.estimatedHours}h estimadas
                  </p>
                </div>
              </div>

              {/* Team Areas */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-chart-secondary" />
                  <span className="text-sm text-muted-foreground">Áreas Envolvidas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.team.map((area, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-chart-secondary/10 text-chart-secondary border-chart-secondary/20"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Project Dates */}
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="block">Início</span>
                  <span className="font-medium text-foreground">
                    {new Date(project.startDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="block">Prazo</span>
                  <span className="font-medium text-foreground">
                    {new Date(project.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Cost Efficiency Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Eficiência de Custo</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-metric-profit" />
                  <span className="text-sm font-medium text-metric-profit">
                    {project.spent <= project.budget * 0.9 ? "Dentro do orçamento" : "Atenção"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
