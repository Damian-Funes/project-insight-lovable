
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioMutations } from "@/hooks/useScenarios";
import { useFinancialProjection } from "@/hooks/useFinancialProjection";
import { ScenarioResults } from "@/components/ScenarioResults";

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

export const ScenarioModal = ({ isOpen, onClose, scenario }: ScenarioModalProps) => {
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const { createScenario, updateScenario } = useScenarioMutations();
  const { data: baselineData } = useFinancialProjection();
  
  const form = useForm<FormData>({
    defaultValues: {
      nome_cenario: "",
      descricao_cenario: "",
      aumento_receitas: 0,
      aumento_custos_fixos: 0,
      aumento_custos_variaveis: 0,
      impacto_retrabalho: 0,
    },
  });

  useEffect(() => {
    if (scenario) {
      const params = scenario.parametros_simulacao || {};
      form.reset({
        nome_cenario: scenario.nome_cenario,
        descricao_cenario: scenario.descricao_cenario || "",
        aumento_receitas: params.aumento_receitas || 0,
        aumento_custos_fixos: params.aumento_custos_fixos || 0,
        aumento_custos_variaveis: params.aumento_custos_variaveis || 0,
        impacto_retrabalho: params.impacto_retrabalho || 0,
      });
      setSimulationResults(scenario.resultados_simulacao);
    } else {
      form.reset();
      setSimulationResults(null);
    }
  }, [scenario, form]);

  const calculateScenario = (params: FormData) => {
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
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    const formData = form.getValues();
    const results = calculateScenario(formData);
    setSimulationResults(results);
    setIsSimulating(false);
  };

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
                <FormField
                  control={form.control}
                  name="nome_cenario"
                  rules={{ required: "Nome do cenário é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cenário</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Cenário Otimista 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao_cenario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva os principais aspectos deste cenário..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Parâmetros de Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="aumento_receitas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aumento/Redução de Receitas (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aumento_custos_fixos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aumento/Redução de Custos Fixos (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aumento_custos_variaveis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aumento/Redução de Custos Variáveis (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impacto_retrabalho"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impacto em Horas de Retrabalho (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
};
