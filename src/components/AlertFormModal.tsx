
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAlerts } from "@/hooks/useAlerts";
import { Database } from "@/integrations/supabase/types";

type AlertasConfig = Database["public"]["Tables"]["alertas_config"]["Row"];
type TipoAlerta = Database["public"]["Enums"]["tipo_alerta"];

interface AlertFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertToEdit?: AlertasConfig | null;
}

interface AlertFormData {
  nome_alerta: string;
  tipo_alerta: TipoAlerta;
  condicao: string;
  mensagem_alerta: string;
  destinatarios: string;
}

export const AlertFormModal = ({ isOpen, onClose, alertToEdit }: AlertFormModalProps) => {
  const { createAlert, updateAlert } = useAlerts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AlertFormData>({
    defaultValues: {
      nome_alerta: "",
      tipo_alerta: "Outros",
      condicao: "",
      mensagem_alerta: "",
      destinatarios: "",
    },
  });

  useEffect(() => {
    if (alertToEdit) {
      form.reset({
        nome_alerta: alertToEdit.nome_alerta,
        tipo_alerta: alertToEdit.tipo_alerta,
        condicao: alertToEdit.condicao,
        mensagem_alerta: alertToEdit.mensagem_alerta,
        destinatarios: alertToEdit.destinatarios,
      });
    } else {
      form.reset({
        nome_alerta: "",
        tipo_alerta: "Outros",
        condicao: "",
        mensagem_alerta: "",
        destinatarios: "",
      });
    }
  }, [alertToEdit, form]);

  const onSubmit = async (data: AlertFormData) => {
    setIsSubmitting(true);
    try {
      if (alertToEdit) {
        await updateAlert.mutateAsync({
          id: alertToEdit.id,
          ...data,
        });
      } else {
        await createAlert.mutateAsync(data);
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar alerta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const tiposAlerta: TipoAlerta[] = ["Orçamento Excedido", "Prazo Próximo", "Registro Pendente", "Outros"];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {alertToEdit ? "Editar Alerta" : "Criar Novo Alerta"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_alerta"
              rules={{ required: "Nome do alerta é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Alerta</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do alerta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_alerta"
              rules={{ required: "Tipo de alerta é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Alerta</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de alerta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposAlerta.map((tipo) => (
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
              name="condicao"
              rules={{ required: "Condição é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: custo_projeto > orcamento_projeto * 0.8"
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
              name="mensagem_alerta"
              rules={{ required: "Mensagem do alerta é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem do Alerta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a mensagem que será exibida no alerta"
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
              name="destinatarios"
              rules={{ required: "Destinatários são obrigatórios" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatários</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lista de IDs de usuários ou papéis (separados por vírgula)"
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
                {isSubmitting ? "Salvando..." : alertToEdit ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
