
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePredictiveModels } from "@/hooks/usePredictiveModels";
import { Database } from "@/integrations/supabase/types";

type ModelosPreditivos = Database["public"]["Tables"]["modelos_preditivos"]["Row"];

interface PredictiveModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelToEdit?: ModelosPreditivos | null;
}

interface ModelFormData {
  nome_modelo: string;
  descricao_modelo: string;
  tipo_modelo: string;
  status_modelo: string;
  parametros_modelo: string;
}

export const PredictiveModelFormModal = ({ isOpen, onClose, modelToEdit }: PredictiveModelFormModalProps) => {
  const { createModel, updateModel } = usePredictiveModels();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ModelFormData>({
    defaultValues: {
      nome_modelo: "",
      descricao_modelo: "",
      tipo_modelo: "Regressão",
      status_modelo: "Inativo",
      parametros_modelo: "",
    },
  });

  useEffect(() => {
    if (modelToEdit) {
      form.reset({
        nome_modelo: modelToEdit.nome_modelo,
        descricao_modelo: modelToEdit.descricao_modelo || "",
        tipo_modelo: modelToEdit.tipo_modelo,
        status_modelo: modelToEdit.status_modelo,
        parametros_modelo: modelToEdit.parametros_modelo ? JSON.stringify(modelToEdit.parametros_modelo, null, 2) : "",
      });
    } else {
      form.reset({
        nome_modelo: "",
        descricao_modelo: "",
        tipo_modelo: "Regressão",
        status_modelo: "Inativo",
        parametros_modelo: "",
      });
    }
  }, [modelToEdit, form]);

  const onSubmit = async (data: ModelFormData) => {
    setIsSubmitting(true);
    try {
      let parametros_modelo = null;
      if (data.parametros_modelo.trim()) {
        try {
          parametros_modelo = JSON.parse(data.parametros_modelo);
        } catch (error) {
          form.setError("parametros_modelo", {
            type: "manual",
            message: "JSON inválido nos parâmetros do modelo",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const modelData = {
        nome_modelo: data.nome_modelo,
        descricao_modelo: data.descricao_modelo || null,
        tipo_modelo: data.tipo_modelo as "Regressão" | "Classificação" | "Detecção de Anomalias" | "Séries Temporais",
        status_modelo: data.status_modelo as "Ativo" | "Inativo" | "Em Treinamento",
        parametros_modelo,
      };

      if (modelToEdit) {
        await updateModel.mutateAsync({
          id: modelToEdit.id,
          ...modelData,
        });
      } else {
        await createModel.mutateAsync(modelData);
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const tiposModelo = ["Regressão", "Classificação", "Detecção de Anomalias", "Séries Temporais"];
  const statusModelo = ["Ativo", "Inativo", "Em Treinamento"];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {modelToEdit ? "Editar Modelo Preditivo" : "Criar Novo Modelo Preditivo"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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

            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : modelToEdit ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
