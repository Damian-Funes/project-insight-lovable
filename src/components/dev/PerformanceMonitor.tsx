
import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, Zap, Settings, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePerformanceContext } from '@/components/PerformanceProvider';

export const PerformanceMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    maxRenderTime: 100,
    maxLoadTime: 3000,
    maxInteractionTime: 50,
    maxComponentCount: 100,
  });

  const {
    metrics,
    averageRenderTime,
    budget,
    setBudget,
    clearMetrics,
    isMonitoringEnabled,
    toggleMonitoring,
  } = usePerformanceContext();

  useEffect(() => {
    setBudgetForm(budget);
  }, [budget]);

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget(budgetForm);
  };

  const slowComponents = metrics
    .filter(m => m.renderTime > budget.maxRenderTime)
    .sort((a, b) => b.renderTime - a.renderTime)
    .slice(0, 5);

  const componentStats = metrics.reduce((acc, metric) => {
    if (!acc[metric.component]) {
      acc[metric.component] = {
        count: 0,
        totalTime: 0,
        maxTime: 0,
        avgTime: 0,
      };
    }
    
    acc[metric.component].count++;
    acc[metric.component].totalTime += metric.renderTime;
    acc[metric.component].maxTime = Math.max(acc[metric.component].maxTime, metric.renderTime);
    acc[metric.component].avgTime = acc[metric.component].totalTime / acc[metric.component].count;
    
    return acc;
  }, {} as Record<string, { count: number; totalTime: number; maxTime: number; avgTime: number }>);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 shadow-lg bg-background border-2"
        >
          <Activity className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performance Monitor
              <Badge variant={isMonitoringEnabled ? "default" : "secondary"}>
                {isMonitoringEnabled ? "Ativo" : "Inativo"}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleMonitoring}
              size="sm"
              variant={isMonitoringEnabled ? "destructive" : "default"}
            >
              {isMonitoringEnabled ? "Pausar" : "Iniciar"}
            </Button>
            <Button onClick={clearMetrics} size="sm" variant="outline">
              Limpar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="max-h-96 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="settings">Config</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted p-2 rounded">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Render Médio
                  </div>
                  <div className="font-bold">
                    {averageRenderTime.toFixed(1)}ms
                  </div>
                </div>
                
                <div className="bg-muted p-2 rounded">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="w-3 h-3" />
                    Total Renders
                  </div>
                  <div className="font-bold">{metrics.length}</div>
                </div>
              </div>

              {slowComponents.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    Componentes Lentos
                  </h4>
                  <div className="space-y-1">
                    {slowComponents.map((metric, index) => (
                      <div key={index} className="text-xs bg-destructive/10 p-2 rounded">
                        <div className="font-medium">{metric.component}</div>
                        <div className="text-destructive">{metric.renderTime.toFixed(1)}ms</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="components" className="space-y-2">
              <div className="text-xs space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(componentStats).map(([component, stats]) => (
                  <div key={component} className="bg-muted p-2 rounded">
                    <div className="font-medium truncate">{component}</div>
                    <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] text-muted-foreground">
                      <div>Count: {stats.count}</div>
                      <div>Avg: {stats.avgTime.toFixed(1)}ms</div>
                      <div>Max: {stats.maxTime.toFixed(1)}ms</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-3">
              <form onSubmit={handleBudgetSubmit} className="space-y-3">
                <div className="text-xs font-medium flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Performance Budget
                </div>
                
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="maxRenderTime" className="text-xs">
                      Max Render Time (ms)
                    </Label>
                    <Input
                      id="maxRenderTime"
                      type="number"
                      value={budgetForm.maxRenderTime}
                      onChange={(e) => setBudgetForm(prev => ({
                        ...prev,
                        maxRenderTime: Number(e.target.value)
                      }))}
                      className="h-7 text-xs"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxLoadTime" className="text-xs">
                      Max Load Time (ms)
                    </Label>
                    <Input
                      id="maxLoadTime"
                      type="number"
                      value={budgetForm.maxLoadTime}
                      onChange={(e) => setBudgetForm(prev => ({
                        ...prev,
                        maxLoadTime: Number(e.target.value)
                      }))}
                      className="h-7 text-xs"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxInteractionTime" className="text-xs">
                      Max Interaction Time (ms)
                    </Label>
                    <Input
                      id="maxInteractionTime"
                      type="number"
                      value={budgetForm.maxInteractionTime}
                      onChange={(e) => setBudgetForm(prev => ({
                        ...prev,
                        maxInteractionTime: Number(e.target.value)
                      }))}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
                
                <Button type="submit" size="sm" className="w-full">
                  Salvar Budget
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
