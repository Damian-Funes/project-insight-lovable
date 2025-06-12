
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectionData } from "@/hooks/useFinancialProjection";

interface ProjectionTableProps {
  data: ProjectionData[];
  title: string;
  type: 'costs' | 'revenues';
}

export const ProjectionTable = ({ data, title, type }: ProjectionTableProps) => {
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
    return type === 'costs' ? item.costs : item.revenues;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-foreground">{title} - Detalhamento</h4>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Mês</TableHead>
              <TableHead className="text-right font-semibold">
                {type === 'costs' ? 'Custo' : 'Receita'}
              </TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
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
