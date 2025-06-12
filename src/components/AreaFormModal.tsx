
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AreaFormData } from "@/hooks/useAreaMutations";

interface AreaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AreaFormData) => void;
  initialData?: Partial<AreaFormData>;
  isLoading?: boolean;
}

export const AreaFormModal: React.FC<AreaFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AreaFormData>({
    defaultValues: {
      nome_area: "",
      descricao_area: "",
      custo_hora_padrao: 0,
      ...initialData,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        nome_area: initialData.nome_area || "",
        descricao_area: initialData.descricao_area || "",
        custo_hora_padrao: initialData.custo_hora_padrao || 0,
      });
    } else {
      reset({
        nome_area: "",
        descricao_area: "",
        custo_hora_padrao: 0,
      });
    }
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Área" : "Nova Área"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nome_area">Nome da Área *</Label>
            <Input
              id="nome_area"
              {...register("nome_area", { required: "Nome da área é obrigatório" })}
              placeholder="Digite o nome da área"
            />
            {errors.nome_area && (
              <p className="text-sm text-red-500 mt-1">{errors.nome_area.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descricao_area">Descrição</Label>
            <Textarea
              id="descricao_area"
              {...register("descricao_area")}
              placeholder="Descreva a área produtiva"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="custo_hora_padrao">Custo por Hora Padrão (R$)</Label>
            <Input
              id="custo_hora_padrao"
              type="number"
              step="0.01"
              min="0"
              {...register("custo_hora_padrao", { 
                valueAsNumber: true,
                min: { value: 0, message: "Custo deve ser positivo" }
              })}
              placeholder="0,00"
            />
            {errors.custo_hora_padrao && (
              <p className="text-sm text-red-500 mt-1">{errors.custo_hora_padrao.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-chart-primary hover:bg-chart-primary/90"
            >
              {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar Área"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
