
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Simulação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Receitas</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(summary.scenarioRevenues)}
              </p>
              <Badge variant={summary.revenueChange >= 0 ? "default" : "destructive"}>
                {formatPercentage(summary.scenarioRevenues, summary.baselineRevenues)}
              </Badge>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200">Custos</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(summary.scenarioCosts)}
              </p>
              <Badge variant={summary.costChange <= 0 ? "default" : "destructive"}>
                {formatPercentage(summary.scenarioCosts, summary.baselineCosts)}
              </Badge>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200">Lucro</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary.scenarioProfit)}
              </p>
              <Badge variant={summary.scenarioProfit >= summary.baselineProfit ? "default" : "destructive"}>
                {formatPercentage(summary.scenarioProfit, summary.baselineProfit)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Receitas e Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Bar dataKey="revenues" fill="var(--color-baseline)" name="Receitas Base" />
                  <Bar dataKey="scenarioRevenues" fill="var(--color-scenario)" name="Receitas Cenário" />
                  <Bar dataKey="costs" fill="#ef4444" name="Custos Base" />
                  <Bar dataKey="scenarioCosts" fill="#dc2626" name="Custos Cenário" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Lucro</CardTitle>
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
                    dataKey="baselineProfit" 
                    stroke="var(--color-baseline)" 
                    strokeWidth={2}
                    name="Lucro Base"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scenarioProfit" 
                    stroke="var(--color-scenario)" 
                    strokeWidth={2}
                    name="Lucro Cenário"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
