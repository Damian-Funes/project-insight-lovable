
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { useCreateRevenue, useUpdateRevenue, type RevenueFormData } from "@/hooks/useRevenueMutations";

interface RevenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenue?: any;
}

export const RevenueFormModal = ({ isOpen, onClose, revenue }: RevenueFormModalProps) => {
  const [formData, setFormData] = useState<RevenueFormData>({
    data_receita: new Date(),
    valor_receita: 0,
    projeto_id: "",
    descricao_receita: "",
    tipo_receita: "",
  });

  const { data: projects } = useProjects();
  const createRevenue = useCreateRevenue();
  const updateRevenue = useUpdateRevenue();

  useEffect(() => {
    if (revenue) {
      setFormData({
        data_receita: new Date(revenue.data_receita),
        valor_receita: Number(revenue.valor_receita),
        projeto_id: revenue.projeto_id,
        descricao_receita: revenue.descricao_receita || "",
        tipo_receita: revenue.tipo_receita || "",
      });
    } else {
      setFormData({
        data_receita: new Date(),
        valor_receita: 0,
        projeto_id: "",
        descricao_receita: "",
        tipo_receita: "",
      });
    }
  }, [revenue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projeto_id) {
      alert("Por favor, selecione um projeto.");
      return;
    }

    try {
      if (revenue) {
        await updateRevenue.mutateAsync({ id: revenue.id, data: formData });
      } else {
        await createRevenue.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {revenue ? "Editar Receita" : "Nova Receita"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data_receita">Data da Receita *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.data_receita && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_receita ? (
                    format(formData.data_receita, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_receita}
                  onSelect={(date) => date && setFormData({ ...formData, data_receita: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_receita">Valor da Receita *</Label>
            <Input
              id="valor_receita"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor_receita}
              onChange={(e) => setFormData({ ...formData, valor_receita: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projeto_id">Projeto *</Label>
            <Select value={formData.projeto_id} onValueChange={(value) => setFormData({ ...formData, projeto_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.nome_projeto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_receita">Tipo de Receita</Label>
            <Select value={formData.tipo_receita} onValueChange={(value) => setFormData({ ...formData, tipo_receita: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venda de Serviço">Venda de Serviço</SelectItem>
                <SelectItem value="Venda de Produto">Venda de Produto</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao_receita">Descrição</Label>
            <Textarea
              id="descricao_receita"
              value={formData.descricao_receita}
              onChange={(e) => setFormData({ ...formData, descricao_receita: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createRevenue.isPending || updateRevenue.isPending}
            >
              {createRevenue.isPending || updateRevenue.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
