
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateActivity, useUpdateActivity, type ActivityFormData } from "@/hooks/useActivityMutations";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const activityFormSchema = z.object({
  data_registro: z.date({
    required_error: "Data do registro é obrigatória",
  }),
  projeto_id: z.string().min(1, "Projeto é obrigatório"),
  area_id: z.string().min(1, "Área é obrigatória"),
  horas_gastas: z.coerce.number().min(0.1, "Horas gastas deve ser maior que 0"),
  descricao_atividade: z.string().optional(),
  tipo_atividade: z.enum(["Padrão", "Retrabalho"]),
});

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: any;
  mode: "create" | "edit";
}

export const ActivityFormModal = ({ isOpen, onClose, activity, mode }: ActivityFormModalProps) => {
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();
  const { data: projects = [] } = useProjects();
  const { data: areas = [] } = useAreas();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      data_registro: activity ? new Date(activity.data_registro) : new Date(),
      projeto_id: activity?.projeto_id || "",
      area_id: activity?.area_id || "",
      horas_gastas: activity?.horas_gastas || 0,
      descricao_atividade: activity?.descricao_atividade || "",
      tipo_atividade: activity?.tipo_atividade || "Padrão",
    },
  });

  const onSubmit = async (values: z.infer<typeof activityFormSchema>) => {
    try {
      // Validação adicional dos campos obrigatórios
      if (!values.data_registro) {
        toast({
          title: "Erro de Validação",
          description: "Data do registro é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      if (!values.projeto_id) {
        toast({
          title: "Erro de Validação",
          description: "Projeto é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!values.area_id) {
        toast({
          title: "Erro de Validação",
          description: "Área é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      if (!values.horas_gastas || values.horas_gastas <= 0) {
        toast({
          title: "Erro de Validação",
          description: "Horas gastas deve ser maior que 0.",
          variant: "destructive",
        });
        return;
      }

      const formData: ActivityFormData = {
        data_registro: values.data_registro,
        projeto_id: values.projeto_id,
        area_id: values.area_id,
        horas_gastas: values.horas_gastas,
        descricao_atividade: values.descricao_atividade,
        tipo_atividade: values.tipo_atividade,
        responsavel_id: "00000000-0000-0000-0000-000000000000", // Placeholder - seria o ID do usuário logado
      };

      if (mode === "edit" && activity) {
        await updateMutation.mutateAsync({ id: activity.id, data: formData });
        toast({
          title: "Sucesso!",
          description: "Atividade atualizada com sucesso.",
        });
      } else {
        await createMutation.mutateAsync(formData);
        toast({
          title: "Sucesso!",
          description: "Atividade registrada com sucesso.",
        });
      }

      // Limpar o formulário após sucesso
      form.reset({
        data_registro: new Date(),
        projeto_id: "",
        area_id: "",
        horas_gastas: 0,
        descricao_atividade: "",
        tipo_atividade: "Padrão",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Erro ao processar atividade:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar atividade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Atividade" : "Nova Atividade"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_registro"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Registro *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horas_gastas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas Gastas *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="Ex: 4.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projeto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.nome_projeto}
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
                name="area_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Produtiva *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.nome_area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tipo_atividade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Atividade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Padrão">Padrão</SelectItem>
                      <SelectItem value="Retrabalho">Retrabalho</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao_atividade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Atividade</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva brevemente a atividade realizada..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-chart-primary hover:bg-chart-primary/90"
              >
                {isLoading ? "Processando..." : mode === "edit" ? "Atualizar" : "Registrar"} Atividade
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export type { ActivityFormData };
