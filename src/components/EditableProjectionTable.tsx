
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectionData } from "@/hooks/useFinancialProjection";
import { useManualProjections } from "@/hooks/useManualProjections";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EditableProjectionTableProps {
  data: ProjectionData[];
  title: string;
  type: 'custos' | 'receitas';
  onProjectionChange: (adjustments: { [key: string]: number }) => void;
}

export const EditableProjectionTable = ({ 
  data, 
  title, 
  type, 
  onProjectionChange 
}: EditableProjectionTableProps) => {
  const { getManualAdjustment, saveProjections, isSaving } = useManualProjections();
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Carregar ajustes existentes quando os dados mudam
  useEffect(() => {
    const loadedAdjustments: { [key: string]: number } = {};
    data.forEach(item => {
      if (item.isProjected) {
        const dateKey = format(parse(item.month, 'MMM/yyyy', new Date()), 'yyyy-MM-dd');
        const adjustment = getManualAdjustment(dateKey, type);
        if (adjustment !== 0) {
          loadedAdjustments[item.month] = adjustment;
        }
      }
    });
    setAdjustments(loadedAdjustments);
    onProjectionChange(loadedAdjustments);
  }, [data, getManualAdjustment, type, onProjectionChange]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (isProjected: boolean) => {
    return isProjected ? "text-blue-600 font-medium" : "text-muted-foreground";
  };

  const getStatusText = (isProjected: boolean) => {
    return isProjected ? "Projetado" : "Histórico";
  };

  const getValue = (item: ProjectionData) => {
    const baseValue = type === 'custos' ? item.costs : item.revenues;
    const adjustment = adjustments[item.month] || 0;
    return item.isProjected && adjustment !== 0 ? adjustment : baseValue;
  };

  const handleAdjustmentChange = (month: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const newAdjustments = { ...adjustments };
    
    if (numericValue === 0) {
      delete newAdjustments[month];
    } else {
      newAdjustments[month] = numericValue;
    }
    
    setAdjustments(newAdjustments);
    setHasChanges(true);
    onProjectionChange(newAdjustments);
  };

  const handleSaveProjections = async () => {
    const projectionsToSave = Object.entries(adjustments).map(([month, adjustment]) => {
      const item = data.find(d => d.month === month);
      const dateKey = format(parse(month, 'MMM/yyyy', new Date()), 'yyyy-MM-dd');
      const originalValue = item ? (type === 'custos' ? item.costs : item.revenues) : 0;
      
      return {
        data_referencia: dateKey,
        tipo: type,
        valor_projetado: originalValue,
        ajuste_manual: adjustment,
      };
    });

    await saveProjections(projectionsToSave);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-foreground">{title} - Detalhamento</h4>
        {hasChanges && (
          <Button 
            onClick={handleSaveProjections} 
            disabled={isSaving}
            size="sm"
          >
            {isSaving ? "Salvando..." : "Salvar Projeções"}
          </Button>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Mês</TableHead>
              <TableHead className="text-right font-semibold">
                {type === 'custos' ? 'Custo' : 'Receita'}
              </TableHead>
              <TableHead className="text-right font-semibold">Ajuste Manual</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(getValue(item))}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.isProjected ? (
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={adjustments[item.month] || ''}
                        onChange={(e) => handleAdjustmentChange(item.month, e.target.value)}
                        className="w-32 text-right"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className={`text-center ${getStatusColor(item.isProjected)}`}>
                    {getStatusText(item.isProjected)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
