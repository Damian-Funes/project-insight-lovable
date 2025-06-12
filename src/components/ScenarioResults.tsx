
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ScenarioResultsProps {
  results: any;
}

export const ScenarioResults = ({ results }: ScenarioResultsProps) => {
  if (!results) return null;

  const { data, summary } = results;

  const chartConfig = {
    baseline: {
      label: "Cenário Base",
      color: "hsl(var(--chart-1))",
    },
    scenario: {
      label: "Cenário Simulado",
      color: "hsl(var(--chart-2))",
    },
    baselineRevenues: {
      label: "Receitas Base",
      color: "hsl(var(--chart-3))",
    },
    scenarioRevenues: {
      label: "Receitas Simuladas",
      color: "hsl(var(--chart-4))",
    },
    baselineCosts: {
      label: "Custos Base",
      color: "hsl(var(--chart-5))",
    },
    scenarioCosts: {
      label: "Custos Simulados",
      color: "hsl(var(--destructive))",
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number, total: number) => {
    const percentage = total !== 0 ? ((value - total) / total * 100) : 0;
    return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
  };

  const calculateMargin = (revenue: number, cost: number) => {
    return revenue !== 0 ? ((revenue - cost) / revenue * 100).toFixed(1) : "0.0";
  };

  return (
    <div className="space-y-6">
      {/* KPIs Resumidos */}
      <Card>
        <CardHeader>
          <CardTitle>Principais KPIs - Comparação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Cenário Base</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200">Receita Total</h5>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(summary.baselineRevenues)}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-red-800 dark:text-red-200">Custo Total</h5>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(summary.baselineCosts)}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-green-800 dark:text-green-200">Lucro</h5>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(summary.baselineProfit)}
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-purple-800 dark:text-purple-200">Margem</h5>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {calculateMargin(summary.baselineRevenues, summary.baselineCosts)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Cenário Simulado</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200">Receita Total</h5>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(summary.scenarioRevenues)}
                  </p>
                  <Badge variant={summary.revenueChange >= 0 ? "default" : "destructive"} className="mt-1">
                    {formatPercentage(summary.scenarioRevenues, summary.baselineRevenues)}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-red-800 dark:text-red-200">Custo Total</h5>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(summary.scenarioCosts)}
                  </p>
                  <Badge variant={summary.costChange <= 0 ? "default" : "destructive"} className="mt-1">
                    {formatPercentage(summary.scenarioCosts, summary.baselineCosts)}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-green-800 dark:text-green-200">Lucro</h5>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(summary.scenarioProfit)}
                  </p>
                  <Badge variant={summary.scenarioProfit >= summary.baselineProfit ? "default" : "destructive"} className="mt-1">
                    {formatPercentage(summary.scenarioProfit, summary.baselineProfit)}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h5 className="font-medium text-sm text-purple-800 dark:text-purple-200">Margem</h5>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {calculateMargin(summary.scenarioRevenues, summary.scenarioCosts)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receitas */}
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Receitas Comparativa</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenues" 
                    stroke="var(--color-baselineRevenues)" 
                    strokeWidth={2}
                    name="Receitas Base"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scenarioRevenues" 
                    stroke="var(--color-scenarioRevenues)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Receitas Simuladas"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Custos Comparativa</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="costs" 
                    stroke="var(--color-baselineCosts)" 
                    strokeWidth={2}
                    name="Custos Base"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scenarioCosts" 
                    stroke="var(--color-scenarioCosts)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Custos Simulados"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Lucro/Prejuízo */}
      <Card>
        <CardHeader>
          <CardTitle>Lucro/Prejuízo Projetado - Comparação</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Bar 
                  dataKey="baselineProfit" 
                  fill="var(--color-baseline)" 
                  name="Lucro Base"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="scenarioProfit" 
                  fill="var(--color-scenario)" 
                  name="Lucro Simulado"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
