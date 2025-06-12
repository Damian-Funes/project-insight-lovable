
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { Database } from "@/integrations/supabase/types";

type OrdemProducao = Database["public"]["Tables"]["ordem_producao"]["Row"];

const formSchema = z.object({
  numero_op: z.string().min(1, "Número da OP é obrigatório"),
  projeto_id: z.string().min(1, "Projeto é obrigatório"),
  area_responsavel_id: z.string().min(1, "Área responsável é obrigatória"),
  data_inicio_prevista: z.date({
    required_error: "Data de início prevista é obrigatória",
  }),
  data_fim_prevista: z.date({
    required_error: "Data de fim prevista é obrigatória",
  }),
  descricao_op: z.string().min(1, "Descrição da OP é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

interface OrdemProducaoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  ordemProducao?: OrdemProducao | null;
  isLoading?: boolean;
}

export const OrdemProducaoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  ordemProducao,
  isLoading = false,
}: OrdemProducaoFormModalProps) => {
  const { data: projects } = useProjects();
  const { data: areas } = useAreas();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_op: ordemProducao?.numero_op || "",
      projeto_id: ordemProducao?.projeto_id || "",
      area_responsavel_id: ordemProducao?.area_responsavel_id || "",
      data_inicio_prevista: ordemProducao?.data_inicio_prevista 
        ? new Date(ordemProducao.data_inicio_prevista)
        : undefined,
      data_fim_prevista: ordemProducao?.data_fim_prevista
        ? new Date(ordemProducao.data_fim_prevista)
        : undefined,
      descricao_op: ordemProducao?.descricao_op || "",
    },
  });

  React.useEffect(() => {
    if (ordemProducao) {
      form.reset({
        numero_op: ordemProducao.numero_op,
        projeto_id: ordemProducao.projeto_id,
        area_responsavel_id: ordemProducao.area_responsavel_id,
        data_inicio_prevista: new Date(ordemProducao.data_inicio_prevista),
        data_fim_prevista: new Date(ordemProducao.data_fim_prevista),
        descricao_op: ordemProducao.descricao_op,
      });
    } else {
      form.reset({
        numero_op: "",
        projeto_id: "",
        area_responsavel_id: "",
        data_inicio_prevista: undefined,
        data_fim_prevista: undefined,
        descricao_op: "",
      });
    }
  }, [ordemProducao, form]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ordemProducao ? "Editar Ordem de Produção" : "Nova Ordem de Produção"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="numero_op"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da OP</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: OP-001-PROJETO-X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projeto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((projeto) => (
                          <SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.nome_projeto}
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
                name="area_responsavel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Responsável</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_inicio_prevista"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início Prevista</FormLabel>
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_fim_prevista"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Fim Prevista</FormLabel>
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao_op"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da OP</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes da ordem de produção..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar OP"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
