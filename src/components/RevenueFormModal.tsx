
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { useRevenueMutations } from "@/hooks/useRevenueMutations";
import { Textarea } from "@/components/ui/textarea";

const revenueSchema = z.object({
  data_receita: z.string().min(1, "Data da receita é obrigatória"),
  valor_receita: z.string().min(1, "Valor da receita é obrigatório"),
  descricao_receita: z.string().optional(),
  tipo_receita: z.string().optional(),
});

type RevenueFormData = z.infer<typeof revenueSchema>;

interface RevenueFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revenue?: any;
}

const revenueTypes = [
  "Receita de Serviços",
  "Receita Recorrente",
  "Consultoria",
  "Licenciamento",
  "Outros",
];

export const RevenueFormModal = ({ open, onOpenChange, revenue }: RevenueFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createRevenue, updateRevenue } = useRevenueMutations();

  const form = useForm<RevenueFormData>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      data_receita: "",
      valor_receita: "",
      descricao_receita: "",
      tipo_receita: "",
    },
  });

  useEffect(() => {
    if (revenue) {
      form.reset({
        data_receita: revenue.data_receita,
        valor_receita: revenue.valor_receita.toString(),
        descricao_receita: revenue.descricao_receita || "",
        tipo_receita: revenue.tipo_receita || "",
      });
    } else {
      form.reset({
        data_receita: "",
        valor_receita: "",
        descricao_receita: "",
        tipo_receita: "",
      });
    }
  }, [revenue, form, open]);

  const onSubmit = async (data: RevenueFormData) => {
    setIsLoading(true);
    try {
      const revenueData = {
        data_receita: data.data_receita,
        valor_receita: parseFloat(data.valor_receita),
        descricao_receita: data.descricao_receita,
        tipo_receita: data.tipo_receita,
      };

      if (revenue) {
        await updateRevenue.mutateAsync({ id: revenue.id, ...revenueData });
      } else {
        await createRevenue.mutateAsync(revenueData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {revenue ? "Editar Receita" : "Nova Receita"}
          </DialogTitle>
          <DialogDescription>
            {revenue
              ? "Edite as informações da receita."
              : "Adicione uma nova receita ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="data_receita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Receita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_receita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Receita</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_receita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Receita</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {revenueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="descricao_receita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Receita</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a receita..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : revenue ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
