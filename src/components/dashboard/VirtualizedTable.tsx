
import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VirtualizedTableProps {
  data: any[];
  columns: Array<{
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
  }>;
  itemHeight?: number;
  height?: number;
  width?: number;
}

const TableRowItem = memo(({ index, style, data }: any) => {
  const { items, columns } = data;
  const item = items[index];

  return (
    <div style={style}>
      <TableRow className="border-b">
        {columns.map((column: any) => (
          <TableCell key={column.key} className="p-4 align-middle">
            {column.render ? column.render(item) : item[column.key]}
          </TableCell>
        ))}
      </TableRow>
    </div>
  );
});

TableRowItem.displayName = 'TableRowItem';

export const VirtualizedTable = memo(({
  data,
  columns,
  itemHeight = 60,
  height = 400,
  width = "100%"
}: VirtualizedTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <div className="overflow-hidden">
        <List
          height={Math.min(height, data.length * itemHeight)}
          width={width}
          itemCount={data.length}
          itemSize={itemHeight}
          itemData={{ items: data, columns }}
        >
          {TableRowItem}
        </List>
      </div>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';
