import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useScenarioMutations } from "@/hooks/useScenarios";
import { useFinancialProjection } from "@/hooks/useFinancialProjection";
import { ScenarioResults } from "@/components/ScenarioResults";
import { useOptimizedForm } from "@/hooks/useOptimizedForm";
import { BasicScenarioStep, ParametersStep } from "@/components/forms/ScenarioFormSteps";

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario?: any;
}

interface FormData {
  nome_cenario: string;
  descricao_cenario: string;
  aumento_receitas: number;
  aumento_custos_fixos: number;
  aumento_custos_variaveis: number;
  impacto_retrabalho: number;
}

export const ScenarioModal = memo(({ isOpen, onClose, scenario }: ScenarioModalProps) => {
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const { createScenario, updateScenario } = useScenarioMutations();
  const { data: baselineData } = useFinancialProjection();

  const defaultValues = useMemo(() => {
    if (scenario) {
      const params = scenario.parametros_simulacao || {};
      return {
        nome_cenario: scenario.nome_cenario,
        descricao_cenario: scenario.descricao_cenario || "",
        aumento_receitas: params.aumento_receitas || 0,
        aumento_custos_fixos: params.aumento_custos_fixos || 0,
        aumento_custos_variaveis: params.aumento_custos_variaveis || 0,
        impacto_retrabalho: params.impacto_retrabalho || 0,
      };
    }
    return {
      nome_cenario: "",
      descricao_cenario: "",
      aumento_receitas: 0,
      aumento_custos_fixos: 0,
      aumento_custos_variaveis: 0,
      impacto_retrabalho: 0,
    };
  }, [scenario]);
  
  const form = useOptimizedForm<FormData>({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (scenario) {
      setSimulationResults(scenario.resultados_simulacao);
    } else {
      setSimulationResults(null);
    }
    form.reset(defaultValues);
  }, [scenario, form, defaultValues]);

  const calculateScenario = useCallback((params: FormData) => {
    if (!baselineData?.data) return null;

    const scenarioData = baselineData.data.map(item => {
      const adjustedRevenues = item.revenues * (1 + params.aumento_receitas / 100);
      const baseCosts = item.costs;
      const retrabalhoImpact = baseCosts * (params.impacto_retrabalho / 100);
      const adjustedCosts = baseCosts * (1 + params.aumento_custos_fixos / 100) + retrabalhoImpact;

      return {
        ...item,
        scenarioRevenues: adjustedRevenues,
        scenarioCosts: adjustedCosts,
        scenarioProfit: adjustedRevenues - adjustedCosts,
        baselineProfit: item.revenues - item.costs,
      };
    });

    const totalBaselineRevenues = baselineData.data.reduce((acc, item) => acc + item.revenues, 0);
    const totalScenarioRevenues = scenarioData.reduce((acc, item) => acc + item.scenarioRevenues, 0);
    const totalBaselineCosts = baselineData.data.reduce((acc, item) => acc + item.costs, 0);
    const totalScenarioCosts = scenarioData.reduce((acc, item) => acc + item.scenarioCosts, 0);

    return {
      data: scenarioData,
      summary: {
        baselineRevenues: totalBaselineRevenues,
        scenarioRevenues: totalScenarioRevenues,
        revenueChange: totalScenarioRevenues - totalBaselineRevenues,
        baselineCosts: totalBaselineCosts,
        scenarioCosts: totalScenarioCosts,
        costChange: totalScenarioCosts - totalBaselineCosts,
        baselineProfit: totalBaselineRevenues - totalBaselineCosts,
        scenarioProfit: totalScenarioRevenues - totalScenarioCosts,
      }
    };
  }, [baselineData]);

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    const formData = form.getValues();
    const results = calculateScenario(formData);
    setSimulationResults(results);
    setIsSimulating(false);
  }, [form, calculateScenario]);

  const onSubmit = async (data: FormData) => {
    const parametros_simulacao = {
      aumento_receitas: data.aumento_receitas,
      aumento_custos_fixos: data.aumento_custos_fixos,
      aumento_custos_variaveis: data.aumento_custos_variaveis,
      impacto_retrabalho: data.impacto_retrabalho,
    };

    const scenarioData = {
      nome_cenario: data.nome_cenario,
      descricao_cenario: data.descricao_cenario,
      parametros_simulacao,
      resultados_simulacao: simulationResults,
      ativo: true,
    };

    if (scenario) {
      updateScenario.mutate({ id: scenario.id, ...scenarioData });
    } else {
      createScenario.mutate(scenarioData);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scenario ? "Editar Cenário" : "Novo Cenário"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <BasicScenarioStep control={form.control} />
              </div>
              <ParametersStep control={form.control} />
            </div>

            <div className="flex justify-center">
              <Button 
                type="button" 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSimulating ? "Simulando..." : "Simular Cenário"}
              </Button>
            </div>

            {simulationResults && (
              <ScenarioResults results={simulationResults} />
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!simulationResults || createScenario.isPending || updateScenario.isPending}
              >
                {scenario ? "Atualizar" : "Criar"} Cenário
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

ScenarioModal.displayName = "ScenarioModal";
