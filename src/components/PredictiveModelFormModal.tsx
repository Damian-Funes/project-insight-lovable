
import { useState, useEffect, memo, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { usePredictiveModels } from "@/hooks/usePredictiveModels";
import { Database } from "@/integrations/supabase/types";
import { useOptimizedForm } from "@/hooks/useOptimizedForm";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { BasicInfoStep, ConfigStep } from "@/components/forms/PredictiveModelFormSteps";

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

export const PredictiveModelFormModal = memo(({ isOpen, onClose, modelToEdit }: PredictiveModelFormModalProps) => {
  const { createModel, updateModel } = usePredictiveModels();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(() => ({
    nome_modelo: modelToEdit?.nome_modelo || "",
    descricao_modelo: modelToEdit?.descricao_modelo || "",
    tipo_modelo: modelToEdit?.tipo_modelo || "Regressão",
    status_modelo: modelToEdit?.status_modelo || "Inativo",
    parametros_modelo: modelToEdit?.parametros_modelo ? JSON.stringify(modelToEdit.parametros_modelo, null, 2) : "",
  }), [modelToEdit]);

  const form = useOptimizedForm<ModelFormData>({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  const steps = useMemo(() => [
    {
      id: "basic",
      title: "Informações Básicas",
      description: "Nome e descrição do modelo",
      component: ({ updateData }: any) => (
        <BasicInfoStep control={form.control} />
      ),
      validation: () => {
        const values = form.getValues();
        return Boolean(values.nome_modelo);
      }
    },
    {
      id: "config",
      title: "Configuração",
      description: "Tipo, status e parâmetros do modelo",
      component: ({ updateData }: any) => (
        <ConfigStep control={form.control} />
      ),
      validation: () => {
        const values = form.getValues();
        return Boolean(values.tipo_modelo && values.status_modelo);
      }
    }
  ], [form.control, form.getValues]);

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

  const handleComplete = async (data: any) => {
    const formData = form.getValues();
    await onSubmit(formData);
  };

  // Para formulários simples, usar formulário direto
  if (!modelToEdit && steps.length <= 2) {
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
              <BasicInfoStep control={form.control} />
              <ConfigStep control={form.control} />

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
  }

  // Para formulários complexos, usar multi-step
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {modelToEdit ? "Editar Modelo Preditivo" : "Criar Novo Modelo Preditivo"}
          </DialogTitle>
        </DialogHeader>

        <MultiStepForm
          steps={steps}
          onComplete={handleComplete}
          initialData={defaultValues}
          className="p-4"
        />
      </DialogContent>
    </Dialog>
  );
});

PredictiveModelFormModal.displayName = "PredictiveModelFormModal";
