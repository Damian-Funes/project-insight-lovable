
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Areas = () => {
  const areas = [
    {
      id: 1,
      name: "Desenvolvimento",
      description: "Equipe responsável pela implementação de software",
      members: 8,
      hourlyRate: 140,
      monthlyHours: 1280,
      monthlyCost: 179200,
      efficiency: 92,
      reworkRate: 6.2,
      activeProjects: ["Projeto Alpha", "Projeto Beta", "Projeto Delta"]
    },
    {
      id: 2,
      name: "Design",
      description: "Criação de interfaces e experiência do usuário",
      members: 4,
      hourlyRate: 120,
      monthlyHours: 640,
      monthlyCost: 76800,
      efficiency: 88,
      reworkRate: 12.5,
      activeProjects: ["Projeto Alpha", "Projeto Beta"]
    },
    {
      id: 3,
      name: "QA",
      description: "Garantia de qualidade e testes",
      members: 3,
      hourlyRate: 100,
      monthlyHours: 480,
      monthlyCost: 48000,
      efficiency: 95,
      reworkRate: 3.8,
      activeProjects: ["Projeto Alpha", "Projeto Delta"]
    },
    {
      id: 4,
      name: "DevOps",
      description: "Infraestrutura e operações",
      members: 2,
      hourlyRate: 150,
      monthlyHours: 320,
      monthlyCost: 48000,
      efficiency: 90,
      reworkRate: 8.1,
      activeProjects: ["Projeto Gamma", "Projeto Delta"]
    }
  ];

  const productivityData = areas.map(area => ({
    name: area.name,
    efficiency: area.efficiency,
    rework: area.reworkRate,
    cost: area.monthlyCost / 1000
  }));

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-metric-profit";
    if (efficiency >= 80) return "text-chart-primary";
    if (efficiency >= 70) return "text-metric-warning";
    return "text-metric-cost";
  };

  const getReworkColor = (rework: number) => {
    if (rework <= 5) return "text-metric-profit";
    if (rework <= 10) return "text-metric-warning";
    return "text-metric-cost";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Áreas Produtivas</h1>
            <p className="text-muted-foreground">Gerencie equipes e monitore performance</p>
          </div>
        </div>
        <Button className="bg-chart-primary hover:bg-chart-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Área
        </Button>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {areas.map((area) => (
          <Card key={area.id} className="metric-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-chart-secondary to-chart-tertiary rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{area.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
                  {area.members} membros
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-metric-revenue" />
                    <span className="text-sm text-muted-foreground">Custo/Hora</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    R$ {area.hourlyRate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Custo mensal: R$ {(area.monthlyCost / 1000).toFixed(0)}K
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-metric-efficiency" />
                    <span className="text-sm text-muted-foreground">Horas/Mês</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {area.monthlyHours}h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(area.monthlyHours / area.members).toFixed(0)}h por membro
                  </p>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-metric-profit" />
                    <span className="text-sm text-muted-foreground">Eficiência</span>
                  </div>
                  <p className={`text-lg font-bold ${getEfficiencyColor(area.efficiency)}`}>
                    {area.efficiency}%
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-metric-warning" />
                    <span className="text-sm text-muted-foreground">Retrabalho</span>
                  </div>
                  <p className={`text-lg font-bold ${getReworkColor(area.reworkRate)}`}>
                    {area.reworkRate}%
                  </p>
                </div>
              </div>

              {/* Active Projects */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Projetos Ativos</span>
                <div className="flex flex-wrap gap-2">
                  {area.activeProjects.map((project, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-chart-tertiary/10 text-chart-tertiary border-chart-tertiary/20"
                    >
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cost per Member */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Custo por Membro/Mês</span>
                <span className="text-sm font-medium text-foreground">
                  R$ {((area.monthlyCost / area.members) / 1000).toFixed(1)}K
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Productivity Analysis Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-foreground">Análise de Produtividade por Área</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 20%, 12%)', 
                  border: '1px solid hsl(220, 20%, 20%)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="efficiency" fill="#10B981" radius={[4, 4, 0, 0]} name="Eficiência %" />
              <Bar dataKey="cost" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Custo Mensal (K)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Areas;
