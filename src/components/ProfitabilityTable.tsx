
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectProfitability } from "@/hooks/useProfitabilityData";

interface ProfitabilityTableProps {
  data: ProjectProfitability[];
}

export const ProfitabilityTable = ({ data }: ProfitabilityTableProps) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getLucroColor = (lucro: number) => {
    if (lucro > 0) return "text-green-600";
    if (lucro < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const getMargemColor = (margem: number) => {
    if (margem > 20) return "text-green-600 font-semibold";
    if (margem > 10) return "text-green-500";
    if (margem > 0) return "text-yellow-600";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Projeto</TableHead>
            <TableHead className="text-right font-semibold">Receita Total</TableHead>
            <TableHead className="text-right font-semibold">Custo Total</TableHead>
            <TableHead className="text-right font-semibold">Lucro/Prejuízo</TableHead>
            <TableHead className="text-right font-semibold">Margem de Lucro (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Nenhum dado de rentabilidade encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((project) => (
              <TableRow key={project.projeto_id}>
                <TableCell className="font-medium">{project.nome_projeto}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(project.receita_total)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(project.custo_total)}
                </TableCell>
                <TableCell className={`text-right font-mono ${getLucroColor(project.lucro)}`}>
                  {formatCurrency(project.lucro)}
                </TableCell>
                <TableCell className={`text-right font-mono ${getMargemColor(project.margem_lucro)}`}>
                  {formatPercentage(project.margem_lucro)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
