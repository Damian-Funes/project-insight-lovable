
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { OPWithDetails, useOPsStats } from "@/hooks/useOPsDashboard";

interface OPsChartsSectionProps {
  ops: OPWithDetails[];
}

const STATUS_COLORS = {
  'Pendente': '#F59E0B',
  'Em Andamento': '#3B82F6',
  'Concluída': '#10B981',
  'Atrasada': '#EF4444',
  'Cancelada': '#6B7280',
};

const PRAZO_COLORS = {
  'No Prazo': '#10B981',
  'Adiantada': '#3B82F6',
  'Atrasada': '#EF4444',
};

export const OPsChartsSection = ({ ops }: OPsChartsSectionProps) => {
  const stats = useOPsStats(ops);

  const statusData = Object.entries(stats.statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280',
  }));

  const areaData = Object.entries(stats.areaDistribution).map(([area, count]) => ({
    name: area.length > 20 ? area.substring(0, 20) + '...' : area,
    count,
  }));

  const prazoData = stats.prazoAnalysis.reduce((acc, item) => {
    const existing = acc.find(d => d.categoria === item.categoria);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        categoria: item.categoria,
        count: 1,
        color: PRAZO_COLORS[item.categoria as keyof typeof PRAZO_COLORS],
      });
    }
    return acc;
  }, [] as Array<{ categoria: string; count: number; color: string }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* KPIs Principais */}
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Indicadores Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalOPs}</div>
              <div className="text-sm text-muted-foreground">Total de OPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-metric-efficiency">
                {stats.statusDistribution['Em Andamento'] || 0}
              </div>
              <div className="text-sm text-muted-foreground">Em Andamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-metric-profit">
                {stats.statusDistribution['Concluída'] || 0}
              </div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-metric-warning">
                {stats.tempoMedioExecucao} dias
              </div>
              <div className="text-sm text-muted-foreground">Tempo Médio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {statusData.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: item.color }}
                />
                {item.name}: {item.value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OPs por Área */}
      <Card>
        <CardHeader>
          <CardTitle>OPs por Área Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
              <XAxis type="number" stroke="#94A3B8" />
              <YAxis dataKey="name" type="category" width={100} stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 20%, 12%)', 
                  border: '1px solid hsl(220, 20%, 20%)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Desempenho de Prazo */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho de Prazo (OPs Concluídas)</CardTitle>
        </CardHeader>
        <CardContent>
          {prazoData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prazoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                  <XAxis dataKey="categoria" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 20%, 12%)', 
                      border: '1px solid hsl(220, 20%, 20%)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]}>
                    {prazoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {prazoData.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.categoria}: {item.count}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma OP concluída encontrada para análise de prazo
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
