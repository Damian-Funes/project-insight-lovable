
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface ReworkChartProps {
  reworkPercentage: number;
  reworkHours: number;
  standardHours: number;
  isLoading?: boolean;
}

export const ReworkChart = ({ 
  reworkPercentage, 
  reworkHours, 
  standardHours, 
  isLoading 
}: ReworkChartProps) => {
  const data = [
    { name: "Retrabalho", value: reworkHours, color: "#ef4444" },
    { name: "Padrão", value: standardHours, color: "#22c55e" },
  ];

  if (isLoading) {
    return (
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-chart-accent flex items-center space-x-3">
            <RotateCcw className="w-8 h-8" />
            <span>% Retrabalho</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-chart-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-chart-accent flex items-center space-x-3">
          <RotateCcw className="w-8 h-8" />
          <span>% Retrabalho</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Número grande da porcentagem */}
        <div className="text-center">
          <div className="text-8xl font-bold text-chart-accent mb-2">
            {reworkPercentage.toFixed(1)}%
          </div>
          <p className="text-xl text-muted-foreground">
            Retrabalho
          </p>
        </div>

        {/* Gráfico de rosca */}
        <div className="w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-lg font-medium text-foreground">
              Retrabalho ({reworkHours.toFixed(1)}h)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-lg font-medium text-foreground">
              Padrão ({standardHours.toFixed(1)}h)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
