
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CostData {
  nome_projeto: string;
  custo_total: number;
}

interface CostTableProps {
  data: CostData[];
}

export const CostTable = ({ data }: CostTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome do Projeto</TableHead>
            <TableHead className="text-right font-semibold">Custo Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                Nenhum dado de custo encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((project) => (
              <TableRow key={project.nome_projeto}>
                <TableCell className="font-medium">{project.nome_projeto}</TableCell>
                <TableCell className="text-right font-mono">
                  R$ {project.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
