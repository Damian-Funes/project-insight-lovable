
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useCreateActivity, useUpdateActivity, type ActivityFormData } from "@/hooks/useActivityMutations";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { useToast } from "@/hooks/use-toast";
import { ActivityFormFields } from "./ActivityFormFields";
import { ActivityFormButtons } from "./ActivityFormButtons";

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
            <ActivityFormFields 
              control={form.control} 
              projects={projects} 
              areas={areas} 
            />
            <ActivityFormButtons 
              onCancel={handleClose} 
              isLoading={isLoading} 
              mode={mode} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export type { ActivityFormData };
