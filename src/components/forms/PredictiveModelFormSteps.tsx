
import React, { memo } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface ModelFormData {
  nome_modelo: string;
  descricao_modelo: string;
  tipo_modelo: string;
  status_modelo: string;
  parametros_modelo: string;
}

interface BasicInfoStepProps {
  control: Control<ModelFormData>;
}

interface ConfigStepProps {
  control: Control<ModelFormData>;
}

export const BasicInfoStep = memo(({ control }: BasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="nome_modelo"
        rules={{ required: "Nome do modelo é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Modelo</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do modelo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="descricao_modelo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição do Modelo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Digite uma descrição para o modelo"
                className="min-h-[80px]"
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

export const ConfigStep = memo(({ control }: ConfigStepProps) => {
  const tiposModelo = ["Regressão", "Classificação", "Detecção de Anomalias", "Séries Temporais"];
  const statusModelo = ["Ativo", "Inativo", "Em Treinamento"];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="tipo_modelo"
        rules={{ required: "Tipo de modelo é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Modelo</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de modelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposModelo.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status_modelo"
        rules={{ required: "Status do modelo é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status do Modelo</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status do modelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusModelo.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="parametros_modelo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parâmetros do Modelo (JSON)</FormLabel>
            <FormControl>
              <Textarea
                placeholder='{"learning_rate": 0.01, "epochs": 100}'
                className="min-h-[120px] font-mono"
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

BasicInfoStep.displayName = "BasicInfoStep";
ConfigStep.displayName = "ConfigStep";
