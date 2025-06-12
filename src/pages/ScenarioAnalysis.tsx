
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioModal } from "@/components/ScenarioModal";
import { ScenarioTable } from "@/components/ScenarioTable";
import { ScenarioViewModal } from "@/components/ScenarioViewModal";
import { useScenarios } from "@/hooks/useScenarios";

export default function ScenarioAnalysis() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [viewingScenario, setViewingScenario] = useState(null);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Cenários</h1>
          <p className="text-muted-foreground mt-2">
            Simule diferentes cenários financeiros para análise estratégica
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Cenário
        </Button>
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
