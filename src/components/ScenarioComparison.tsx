
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, LineChart } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

interface ScenarioComparisonProps {
  scenarios: any[];
  onClose: () => void;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ScenarioComparison = ({ scenarios, onClose }: ScenarioComparisonProps) => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'revenues' | 'costs' | 'profit'>('profit');

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getChartData = () => {
    if (selectedScenarios.length === 0) return [];
    
    const selectedScenariosData = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    // Assumindo que todos os cenários têm a mesma estrutura de meses
    const baseData = selectedScenariosData[0]?.resultados_simulacao?.data || [];
    
    return baseData.map((item: any) => {
      const chartItem: any = { month: item.month };
      
      selectedScenariosData.forEach((scenario, index) => {
        const scenarioData = scenario.resultados_simulacao?.data?.find((d: any) => d.month === item.month);
        if (scenarioData) {
          chartItem[`${scenario.id}_revenues`] = scenarioData.scenarioRevenues || scenarioData.revenues;
          chartItem[`${scenario.id}_costs`] = scenarioData.scenarioCosts || scenarioData.costs;
          chartItem[`${scenario.id}_profit`] = scenarioData.scenarioProfit || scenarioData.baselineProfit;
        }
      });
      
      return chartItem;
    });
  };

  const getChartConfig = () => {
    const config: any = {};
    selectedScenarios.forEach((scenarioId, index) => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      config[`${scenarioId}_revenues`] = {
        label: `${scenario?.nome_cenario} - Receitas`,
        color: colors[index % colors.length],
      };
      config[`${scenarioId}_costs`] = {
        label: `${scenario?.nome_cenario} - Custos`,
        color: colors[index % colors.length],
      };
      config[`${scenarioId}_profit`] = {
        label: `${scenario?.nome_cenario} - Lucro`,
        color: colors[index % colors.length],
      };
    });
    return config;
  };

  const chartData = getChartData();
  const chartConfig = getChartConfig();

  const getDataKey = (scenarioId: string) => {
    switch (viewType) {
      case 'revenues': return `${scenarioId}_revenues`;
      case 'costs': return `${scenarioId}_costs`;
      case 'profit': return `${scenarioId}_profit`;
      default: return `${scenarioId}_profit`;
    }
  };

  const getTitle = () => {
    switch (viewType) {
      case 'revenues': return 'Comparação de Receitas';
      case 'costs': return 'Comparação de Custos';
      case 'profit': return 'Comparação de Lucro';
      default: return 'Comparação de Cenários';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comparação de Cenários</h2>
        <Button variant="outline" onClick={onClose}>
          Fechar Comparação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Cenários para Comparação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  id={scenario.id}
                  checked={selectedScenarios.includes(scenario.id)}
                  onCheckedChange={() => handleScenarioToggle(scenario.id)}
                />
                <div className="flex-1">
                  <label htmlFor={scenario.id} className="font-medium cursor-pointer">
                    {scenario.nome_cenario}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {scenario.descricao_cenario || "Sem descrição"}
                  </p>
                  <Badge variant={scenario.ativo ? "default" : "secondary"} className="mt-1">
                    {scenario.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedScenarios.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Controles de Visualização</span>
                <div className="flex gap-2">
                  <Button
                    variant={viewType === 'revenues' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType('revenues')}
                  >
                    Receitas
                  </Button>
                  <Button
                    variant={viewType === 'costs' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType('costs')}
                  >
                    Custos
                  </Button>
                  <Button
                    variant={viewType === 'profit' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType('profit')}
                  >
                    Lucro
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{getTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    {selectedScenarios.map((scenarioId, index) => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <Line
                          key={scenarioId}
                          type="monotone"
                          dataKey={getDataKey(scenarioId)}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          name={scenario?.nome_cenario}
                          dot={{ r: 4 }}
                        />
                      );
                    })}
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Comparativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cenário</th>
                      <th className="text-right p-2">Receita Total</th>
                      <th className="text-right p-2">Custo Total</th>
                      <th className="text-right p-2">Lucro Total</th>
                      <th className="text-right p-2">Margem (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedScenarios.map((scenarioId) => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      const summary = scenario?.resultados_simulacao?.summary;
                      
                      if (!summary) return null;
                      
                      const margin = summary.scenarioRevenues !== 0 
                        ? ((summary.scenarioRevenues - summary.scenarioCosts) / summary.scenarioRevenues * 100).toFixed(1)
                        : "0.0";
                      
                      return (
                        <tr key={scenarioId} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{scenario?.nome_cenario}</td>
                          <td className="p-2 text-right">{formatCurrency(summary.scenarioRevenues)}</td>
                          <td className="p-2 text-right">{formatCurrency(summary.scenarioCosts)}</td>
                          <td className="p-2 text-right">{formatCurrency(summary.scenarioProfit)}</td>
                          <td className="p-2 text-right">{margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedScenarios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Selecione pelo menos um cenário para começar a comparação
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
