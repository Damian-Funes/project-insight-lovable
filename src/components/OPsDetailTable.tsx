
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedOPWithDetails } from "@/hooks/useOptimizedOPsDashboard";

interface OPsDetailTableProps {
  ops: OptimizedOPWithDetails[];
}

const statusColors = {
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Em Andamento': 'bg-blue-100 text-blue-800',
  'Concluída': 'bg-green-100 text-green-800',
  'Atrasada': 'bg-red-100 text-red-800',
  'Cancelada': 'bg-gray-100 text-gray-800',
};

export const OPsDetailTable = ({ ops }: OPsDetailTableProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento das Ordens de Produção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OP</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Área Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início Previsto</TableHead>
                <TableHead>Fim Previsto</TableHead>
                <TableHead>Início Real</TableHead>
                <TableHead>Fim Real</TableHead>
                <TableHead>Tempo Real (dias)</TableHead>
                <TableHead>Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhuma ordem de produção encontrada
                  </TableCell>
                </TableRow>
              ) : (
                ops.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell className="font-medium">{op.numero_op}</TableCell>
                    <TableCell>{op.projetos?.nome_projeto}</TableCell>
                    <TableCell>{op.areas_produtivas?.nome_area}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[op.status_op as keyof typeof statusColors]}>
                        {op.status_op}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(op.data_inicio_prevista)}</TableCell>
                    <TableCell>{formatDate(op.data_fim_prevista)}</TableCell>
                    <TableCell>{formatDate(op.data_inicio_real)}</TableCell>
                    <TableCell>{formatDate(op.data_fim_real)}</TableCell>
                    <TableCell>
                      {op.tempo_execucao_dias ? `${op.tempo_execucao_dias} dias` : "-"}
                    </TableCell>
                    <TableCell>{formatCurrency(op.custo_total)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
