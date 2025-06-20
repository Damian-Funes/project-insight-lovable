
import React, { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, AlertTriangle } from "lucide-react";

// Dados mock financeiros
const mockData = {
  kpis: [
    {
      title: "Receita Total",
      value: "R$ 485.2K",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-metric-revenue"
    },
    {
      title: "Custo Total",
      value: "R$ 324.8K",
      change: "-3.2%",
      trend: "down" as const,
      icon: TrendingDown,
      color: "text-metric-cost"
    },
    {
      title: "Margem de Lucro",
      value: "33.1%",
      change: "+5.8%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-metric-profit"
    },
    {
      title: "Áreas Ativas",
      value: "8",
      change: "+1",
      trend: "up" as const,
      icon: Building2,
      color: "text-metric-efficiency"
    }
  ],
  monthlyData: [
    { month: "Jan", receita: 45000, custo: 28000, lucro: 17000 },
    { month: "Feb", receita: 52000, custo: 31000, lucro: 21000 },
    { month: "Mar", receita: 48000, custo: 29000, lucro: 19000 },
    { month: "Apr", receita: 61000, custo: 35000, lucro: 26000 },
    { month: "May", receita: 55000, custo: 32000, lucro: 23000 },
    { month: "Jun", receita: 67000, custo: 38000, lucro: 29000 }
  ],
  costDistribution: [
    { name: "Desenvolvimento", value: 35, color: "#3B82F6" },
    { name: "Design", value: 28, color: "#8B5CF6" },
    { name: "QA", value: 22, color: "#10B981" },
    { name: "DevOps", value: 15, color: "#F59E0B" }
  ],
  areaMetrics: [
    { area: "Desenvolvimento", custoHora: 45, horasMes: 180 },
    { area: "Design", custoHora: 40, horasMes: 120 },
    { area: "QA", custoHora: 35, horasMes: 95 },
    { area: "DevOps", custoHora: 50, horasMes: 75 }
  ]
};

// Componente KPI memoizado
const KPICard = React.memo(({ kpi }: { kpi: typeof mockData.kpis[0] }) => (
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

KPICard.displayName = "KPICard";

// Componente de chart de receita memoizado
const RevenueChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={mockData.monthlyData}>
      <defs>
        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
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
        dataKey="receita" 
        stroke="#3B82F6" 
        fillOpacity={1} 
        fill="url(#colorReceita)" 
        strokeWidth={2}
      />
      <Area 
        type="monotone" 
        dataKey="custo" 
        stroke="#EF4444" 
        fillOpacity={1} 
        fill="url(#colorCusto)" 
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
));

RevenueChart.displayName = "RevenueChart";

const CostDistributionChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={mockData.costDistribution}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={120}
        paddingAngle={5}
        dataKey="value"
      >
        {mockData.costDistribution.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(220, 20%, 12%)', 
          border: '1px solid hsl(220, 20%, 20%)',
          borderRadius: '8px'
        }} 
      />
    </PieChart>
  </ResponsiveContainer>
));

CostDistributionChart.displayName = "CostDistributionChart";

const AreaMetricsChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={mockData.areaMetrics}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
      <XAxis dataKey="area" stroke="#94A3B8" />
      <YAxis stroke="#94A3B8" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(220, 20%, 12%)', 
          border: '1px solid hsl(220, 20%, 20%)',
          borderRadius: '8px'
        }} 
      />
      <Bar dataKey="custoHora" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

AreaMetricsChart.displayName = "AreaMetricsChart";

const Dashboard = React.memo(() => {
  // Memoizar a legenda do gráfico de pizza
  const costLegend = useMemo(() => 
    mockData.costDistribution.map((area, index) => (
      <div key={index} className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: area.color }}
        />
        <span className="text-sm text-muted-foreground">{area.name}</span>
      </div>
    )), []);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Visão geral dos indicadores financeiros estratégicos</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-metric-profit/10 text-metric-profit border-metric-profit">
          Em Tempo Real
        </Badge>
      </div>

      {/* KPIs Cards */}
      <div className="dashboard-grid">
        {mockData.kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost Trend */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Receita vs Custo (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Cost Distribution by Area */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição de Custos por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <CostDistributionChart />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {costLegend}
            </div>
          </CardContent>
        </Card>

        {/* Area Cost Metrics */}
        <Card className="chart-container lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Custo por Hora por Área Produtiva</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaMetricsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
