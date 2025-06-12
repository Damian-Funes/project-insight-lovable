
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioModal } from "@/components/ScenarioModal";
import { ScenarioTable } from "@/components/ScenarioTable";
import { ScenarioViewModal } from "@/components/ScenarioViewModal";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { useScenarios } from "@/hooks/useScenarios";

export default function ScenarioAnalysis() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [viewingScenario, setViewingScenario] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const { data: scenarios = [], isLoading } = useScenarios();

  const handleCreateNew = () => {
    setEditingScenario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setIsModalOpen(true);
  };

  const handleView = (scenario) => {
    setViewingScenario(scenario);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingScenario(null);
  };

  const handleViewModalClose = () => {
    setViewingScenario(null);
  };

  const handleComparisonToggle = () => {
    setShowComparison(!showComparison);
  };

  // Filtrar apenas cenários com resultados de simulação para comparação
  const scenariosWithResults = scenarios.filter(s => s.resultados_simulacao);

  if (showComparison) {
    return (
      <div className="container mx-auto p-6">
        <ScenarioComparison 
          scenarios={scenariosWithResults}
          onClose={() => setShowComparison(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Cenários</h1>
          <p className="text-muted-foreground mt-2">
            Simule diferentes cenários financeiros para análise estratégica
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleComparisonToggle} 
            variant="outline"
            className="flex items-center gap-2"
            disabled={scenariosWithResults.length < 2}
          >
            <GitCompare className="h-4 w-4" />
            Comparar Cenários
          </Button>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cenário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cenários Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <ScenarioTable
            scenarios={scenarios}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
          />
        </CardContent>
      </Card>

      <ScenarioModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        scenario={editingScenario}
      />

      {viewingScenario && (
        <ScenarioViewModal
          isOpen={!!viewingScenario}
          onClose={handleViewModalClose}
          scenario={viewingScenario}
        />
      )}
    </div>
  );
}
