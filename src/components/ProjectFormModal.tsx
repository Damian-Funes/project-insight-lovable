
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface ProjectFormData {
  nome_projeto: string;
  descricao_projeto?: string;
  status_projeto: "Ativo" | "Concluído" | "Cancelado";
  data_inicio?: Date;
  data_termino_prevista?: Date;
  orcamento_total?: number;
}

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  isLoading?: boolean;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      nome_projeto: "",
      descricao_projeto: "",
      status_projeto: "Ativo",
      orcamento_total: 0,
      ...initialData,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof ProjectFormData, value);
      });
    } else {
      reset({
        nome_projeto: "",
        descricao_projeto: "",
        status_projeto: "Ativo",
        orcamento_total: 0,
      });
    }
  }, [initialData, setValue, reset]);

  const dataInicio = watch("data_inicio");
  const dataTermino = watch("data_termino_prevista");
  const status = watch("status_projeto");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Projeto" : "Novo Projeto"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
              <Input
                id="nome_projeto"
                {...register("nome_projeto", { required: "Nome do projeto é obrigatório" })}
                placeholder="Digite o nome do projeto"
              />
              {errors.nome_projeto && (
                <p className="text-sm text-red-500 mt-1">{errors.nome_projeto.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="descricao_projeto">Descrição</Label>
              <Textarea
                id="descricao_projeto"
                {...register("descricao_projeto")}
                placeholder="Descreva o projeto"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status_projeto">Status *</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setValue("status_projeto", value as "Ativo" | "Concluído" | "Cancelado")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Orçamento Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register("orcamento_total", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Orçamento deve ser positivo" }
                })}
                placeholder="0,00"
              />
              {errors.orcamento_total && (
                <p className="text-sm text-red-500 mt-1">{errors.orcamento_total.message}</p>
              )}
            </div>

            <div>
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={(date) => setValue("data_inicio", date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data de Término Prevista</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataTermino && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataTermino ? format(dataTermino, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataTermino}
                    onSelect={(date) => setValue("data_termino_prevista", date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
              {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
