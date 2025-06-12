
import React, { useState, useEffect, useMemo } from "react";
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
import { useDebounce } from "@/hooks/useDebounce";

interface OptimizedEditableProjectionTableProps {
  data: ProjectionData[];
  title: string;
  type: 'custos' | 'receitas';
  onProjectionChange: (adjustments: { [key: string]: number }) => void;
}

export const OptimizedEditableProjectionTable = React.memo(({ 
  data, 
  title, 
  type, 
  onProjectionChange 
}: OptimizedEditableProjectionTableProps) => {
  const { getManualAdjustment, saveProjections, isSaving } = useManualProjections();
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Debounce adjustments para evitar re-renders desnecessários
  const debouncedAdjustments = useDebounce(adjustments, 300);

  // Memoizar dados processados
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      finalValue: (() => {
        const baseValue = type === 'custos' ? item.costs : item.revenues;
        const adjustment = debouncedAdjustments[item.month] || 0;
        return item.isProjected && adjustment !== 0 ? adjustment : baseValue;
      })()
    }));
  }, [data, type, debouncedAdjustments]);

  // Carregar ajustes existentes quando os dados mudam
  useEffect(() => {
    if (!data.length) return;
    
    const loadedAdjustments: { [key: string]: number } = {};
    data.forEach(item => {
      if (item.isProjected) {
        try {
          const dateKey = format(parse(item.month, 'MMM/yyyy', new Date()), 'yyyy-MM-dd');
          const adjustment = getManualAdjustment(dateKey, type);
          if (adjustment !== 0) {
            loadedAdjustments[item.month] = adjustment;
          }
        } catch (error) {
          console.warn(`Erro ao processar data: ${item.month}`, error);
        }
      }
    });
    setAdjustments(loadedAdjustments);
    onProjectionChange(loadedAdjustments);
  }, [data, getManualAdjustment, type, onProjectionChange]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
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

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Nenhum dado encontrado
      </div>
    );
  }

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
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        )}
      </div>
      
      <div className="rounded-md border max-h-96 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="font-semibold w-24">Mês</TableHead>
              <TableHead className="text-right font-semibold w-32">
                {type === 'custos' ? 'Custo' : 'Receita'}
              </TableHead>
              <TableHead className="text-right font-semibold w-32">Ajuste Manual</TableHead>
              <TableHead className="text-center font-semibold w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-sm">{item.month}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(item.finalValue)}
                </TableCell>
                <TableCell className="text-right">
                  {item.isProjected ? (
                    <Input
                      type="number"
                      step="1000"
                      placeholder="0"
                      value={adjustments[item.month] || ''}
                      onChange={(e) => handleAdjustmentChange(item.month, e.target.value)}
                      className="w-24 text-right text-sm h-8"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className={`text-center text-xs ${
                  item.isProjected ? "text-blue-600 font-medium" : "text-muted-foreground"
                }`}>
                  {item.isProjected ? "Projetado" : "Histórico"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

OptimizedEditableProjectionTable.displayName = "OptimizedEditableProjectionTable";
