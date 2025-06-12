
import React, { memo } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";

interface ScenarioFormData {
  nome_cenario: string;
  descricao_cenario: string;
  aumento_receitas: number;
  aumento_custos_fixos: number;
  aumento_custos_variaveis: number;
  impacto_retrabalho: number;
}

interface BasicScenarioStepProps {
  control: Control<ScenarioFormData>;
}

interface ParametersStepProps {
  control: Control<ScenarioFormData>;
}

export const BasicScenarioStep = memo(({ control }: BasicScenarioStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
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
        control={control}
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
  );
});

export const ParametersStep = memo(({ control }: ParametersStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parâmetros de Simulação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
});

BasicScenarioStep.displayName = "BasicScenarioStep";
ParametersStep.displayName = "ParametersStep";
