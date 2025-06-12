
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, AlertTriangle } from "lucide-react";
import { OptimizedAreaChart } from "@/components/charts/OptimizedAreaChart";
import { OptimizedBarChart } from "@/components/charts/OptimizedBarChart";
import { OptimizedPieChart } from "@/components/charts/OptimizedPieChart";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { memo, Suspense } from "react";

// Memoizar dados mockados para evitar recriação desnecessária
const kpis = [
  {
    title: "Receita Total",
    value: "R$ 485.2K",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-metric-revenue"
  },
  {
    title: "Custo Total",
    value: "R$ 324.8K",
    change: "-3.2%",
    trend: "down",
    icon: TrendingDown,
    color: "text-metric-cost"
  },
  {
    title: "Horas Trabalhadas",
    value: "2,847h",
    change: "+8.1%",
    trend: "up",
    icon: Clock,
    color: "text-metric-efficiency"
  },
  {
    title: "Taxa de Retrabalho",
    value: "8.4%",
    change: "+2.1%",
    trend: "up",
    icon: AlertTriangle,
    color: "text-metric-warning"
  }
];

const monthlyData = [
  { month: "Jan", receita: 45000, custo: 28000, lucro: 17000 },
  { month: "Feb", receita: 52000, custo: 31000, lucro: 21000 },
  { month: "Mar", receita: 48000, custo: 29000, lucro: 19000 },
  { month: "Apr", receita: 61000, custo: 35000, lucro: 26000 },
  { month: "May", receita: 55000, custo: 32000, lucro: 23000 },
  { month: "Jun", receita: 67000, custo: 38000, lucro: 29000 }
];

const projectCosts = [
  { name: "Projeto Alpha", value: 35, color: "#3B82F6" },
  { name: "Projeto Beta", value: 28, color: "#8B5CF6" },
  { name: "Projeto Gamma", value: 22, color: "#10B981" },
  { name: "Projeto Delta", value: 15, color: "#F59E0B" }
];

const areaEfficiency = [
  { area: "Desenvolvimento", horas: 180, custo: 25200 },
  { area: "Design", horas: 120, custo: 14400 },
  { area: "QA", horas: 95, custo: 9500 },
  { area: "DevOps", horas: 75, custo: 11250 }
];

// Componente memoizado para KPIs
const KPICard = memo(({ kpi }: { kpi: typeof kpis[0] }) => (
  <Card className="metric-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {kpi.title}
      </CardTitle>
      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
      <div className="flex items-center space-x-1 text-xs">
        {kpi.trend === "up" ? (
          <TrendingUp className="w-3 h-3 text-metric-profit" />
        ) : (
          <TrendingDown className="w-3 h-3 text-metric-cost" />
        )}
        <span className={kpi.trend === "up" ? "text-metric-profit" : "text-metric-cost"}>
          {kpi.change}
        </span>
        <span className="text-muted-foreground">vs mês anterior</span>
      </div>
    </CardContent>
  </Card>
));

KPICard.displayName = 'KPICard';

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Visão geral dos indicadores estratégicos</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-metric-profit/10 text-metric-profit border-metric-profit">
          Em Tempo Real
        </Badge>
      </div>

      {/* KPIs Cards - Otimizados */}
      <div className="dashboard-grid">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Charts Grid - Carregamento direto para melhor performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost Trend */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Receita vs Custo (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <OptimizedAreaChart
              data={monthlyData}
              dataKey="receita"
              xAxisKey="month"
              color="#3B82F6"
              maxDataPoints={12}
            />
          </CardContent>
        </Card>

        {/* Project Costs Distribution */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição de Custos por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton type="pie" showTitle={false} />}>
              <OptimizedPieChart
                data={projectCosts}
                dataKey="value"
                nameKey="name"
                maxDataPoints={8}
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* Area Efficiency */}
        <Card className="chart-container lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Eficiência por Área Produtiva</CardTitle>
          </CardHeader>
          <CardContent>
            <OptimizedBarChart
              data={areaEfficiency}
              bars={[
                { dataKey: "horas", color: "#8B5CF6", name: "Horas" },
                { dataKey: "custo", color: "#10B981", name: "Custo" }
              ]}
              xAxisKey="area"
              maxDataPoints={10}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
