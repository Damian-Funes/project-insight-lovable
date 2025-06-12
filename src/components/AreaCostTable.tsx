
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AreaCostData {
  nome_area: string;
  custo_total: number;
}

interface AreaCostTableProps {
  data: AreaCostData[];
}

export const AreaCostTable = ({ data }: AreaCostTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome da Área</TableHead>
            <TableHead className="text-right font-semibold">Custo Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                Nenhum dado de custo por área encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((area) => (
              <TableRow key={area.nome_area}>
                <TableCell className="font-medium">{area.nome_area}</TableCell>
                <TableCell className="text-right font-mono">
                  R$ {area.custo_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
