
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useOperationalAlertsMutations } from "@/hooks/useOperationalAlerts";
import { useAreas } from "@/hooks/useAreas";
import { Database } from "@/integrations/supabase/types";

type AlertaOperacional = Database["public"]["Tables"]["alertas_operacionais"]["Row"];

const formSchema = z.object({
  mensagem: z.string().min(1, "Mensagem é obrigatória").max(500, "Mensagem deve ter no máximo 500 caracteres"),
  area_id: z.string().nullable(),
  prioridade: z.number().min(1).max(3),
  data_inicio: z.date(),
  data_fim: z.date().nullable(),
  ativo: z.boolean(),
});

interface OperationalAlertFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert?: AlertaOperacional | null;
}

export const OperationalAlertFormModal = ({
  isOpen,
  onClose,
  alert,
}: OperationalAlertFormModalProps) => {
  const { data: areas } = useAreas();
  const { createAlert, updateAlert } = useOperationalAlertsMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mensagem: "",
      area_id: null,
      prioridade: 1,
      data_inicio: new Date(),
      data_fim: null,
      ativo: true,
    },
  });

  useEffect(() => {
    if (alert) {
      form.reset({
        mensagem: alert.mensagem,
        area_id: alert.area_id,
        prioridade: alert.prioridade,
        data_inicio: new Date(alert.data_inicio),
        data_fim: alert.data_fim ? new Date(alert.data_fim) : null,
        ativo: alert.ativo,
      });
    } else {
      form.reset({
        mensagem: "",
        area_id: null,
        prioridade: 1,
        data_inicio: new Date(),
        data_fim: null,
        ativo: true,
      });
    }
  }, [alert, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const alertData = {
        mensagem: values.mensagem,
        area_id: values.area_id,
        prioridade: values.prioridade,
        data_inicio: values.data_inicio.toISOString().split('T')[0],
        data_fim: values.data_fim ? values.data_fim.toISOString().split('T')[0] : null,
        ativo: values.ativo,
      };

      if (alert) {
        await updateAlert.mutateAsync({ id: alert.id, ...alertData });
      } else {
        await createAlert.mutateAsync(alertData);
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar alerta:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {alert ? "Editar Alerta Operacional" : "Novo Alerta Operacional"}
          </DialogTitle>
          <DialogDescription>
            {alert 
              ? "Edite as informações do alerta operacional." 
              : "Crie um novo alerta operacional para o painel."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a mensagem do alerta..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (Opcional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "null" ? null : value)} defaultValue={field.value || "null"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área específica ou deixe em branco para todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">Todas as áreas</SelectItem>
                      {areas?.map((area) => (
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

            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Baixa</SelectItem>
                      <SelectItem value="2">Média</SelectItem>
                      <SelectItem value="3">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
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
                            date < new Date(new Date().setHours(0, 0, 0, 0))
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
                name="data_fim"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Fim (Opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
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
                            date < form.getValues("data_inicio")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createAlert.isPending || updateAlert.isPending}>
                {alert ? "Atualizar" : "Criar"} Alerta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
