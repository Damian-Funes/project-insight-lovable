
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { z } from "zod";

const activityFormSchema = z.object({
  data_registro: z.date({
    required_error: "Data do registro é obrigatória",
  }),
  projeto_id: z.string().min(1, "Projeto é obrigatório"),
  area_id: z.string().min(1, "Área é obrigatória"),
  horas_gastas: z.coerce.number().min(0.1, "Horas gastas deve ser maior que 0"),
  descricao_atividade: z.string().optional(),
  tipo_atividade: z.enum(["Padrão", "Retrabalho"]),
  ordem_producao_id: z.string().optional(),
});

interface ActivityFormFieldsProps {
  control: Control<z.infer<typeof activityFormSchema>>;
  projects: any[];
  areas: any[];
  ordensProducao: any[];
}

export const ActivityFormFields = ({ control, projects, areas, ordensProducao }: ActivityFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
          name="ordem_producao_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Produção (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma OP (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhuma OP selecionada</SelectItem>
                  {ordensProducao?.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.numero_op} - {op.projetos?.nome_projeto}
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
        control={control}
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
    </>
  );
};
