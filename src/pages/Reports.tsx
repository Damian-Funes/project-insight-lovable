
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Filter, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Reports = () => {
  const monthlyTrends = [
    { month: "Jan", custoTotal: 285000, horasTrabalhadas: 1950, retrabalho: 8.2, eficiencia: 87 },
    { month: "Feb", custoTotal: 312000, horasTrabalhadas: 2100, retrabalho: 7.8, eficiencia: 89 },
    { month: "Mar", custoTotal: 295000, horasTrabalhadas: 2050, retrabalho: 9.1, eficiencia: 85 },
    { month: "Apr", custoTotal: 358000, horasTrabalhadas: 2400, retrabalho: 6.5, eficiencia: 92 },
    { month: "May", custoTotal: 335000, horasTrabalhadas: 2280, retrabalho: 7.2, eficiencia: 90 },
    { month: "Jun", custoTotal: 324800, horasTrabalhadas: 2200, retrabalho: 8.4, eficiencia: 88 }
  ];

  const reportTypes = [
    {
      title: "Relatório de Custos por Projeto",
      description: "Análise detalhada dos custos alocados em cada projeto",
      icon: BarChart3,
      period: "Último trimestre",
      size: "2.3 MB"
    },
    {
      title: "Relatório de Eficiência por Área",
      description: "Performance e produtividade das áreas produtivas",
      icon: TrendingUp,
      period: "Últimos 6 meses",
      size: "1.8 MB"
    },
    {
      title: "Relatório de Retrabalho",
      description: "Análise de atividades de retrabalho e impacto nos custos",
      icon: FileText,
      period: "Mês atual",
      size: "1.2 MB"
    },
    {
      title: "Relatório Financeiro Executivo",
      description: "Visão consolidada para tomada de decisão estratégica",
      icon: Calendar,
      period: "Ano fiscal",
      size: "5.1 MB"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Insights detalhados para decisões estratégicas</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select>
            <SelectTrigger className="w-48 bg-input border-border">
              <SelectValue placeholder="Período de análise" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="current-month">Mês atual</SelectItem>
              <SelectItem value="last-month">Mês anterior</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Ano fiscal</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border hover:bg-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Trend Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Tendência de Custos vs Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(220, 20%, 12%)', 
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="custoTotal" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorCusto)" 
                  strokeWidth={2}
                  name="Custo Total (R$)"
                />
                <Area 
                  type="monotone" 
                  dataKey="horasTrabalhadas" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorHoras)" 
                  strokeWidth={2}
                  name="Horas Trabalhadas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Eficiência vs Retrabalho</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(220, 20%, 12%)', 
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  name="Eficiência (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="retrabalho" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2 }}
                  name="Retrabalho (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportTypes.map((report, index) => (
              <Card key={index} className="border border-border hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-lg flex items-center justify-center">
                        <report.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
                            {report.period}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-chart-primary hover:bg-chart-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Relatórios Gerados</p>
                <p className="text-2xl font-bold text-foreground">127</p>
              </div>
              <FileText className="w-8 h-8 text-chart-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Economia Identificada</p>
                <p className="text-2xl font-bold text-metric-profit">R$ 45.2K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-metric-profit" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projetos Analisados</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <BarChart3 className="w-8 h-8 text-chart-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-lg font-bold text-foreground">Hoje</p>
                <p className="text-xs text-muted-foreground">14:35</p>
              </div>
              <Calendar className="w-8 h-8 text-metric-warning" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
