
import { useState } from "react";
import { OPsDashboardFilters } from "@/components/OPsDashboardFilters";
import { OPsChartsSection } from "@/components/OPsChartsSection";
import { OPsDetailTable } from "@/components/OPsDetailTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useOPsDashboard, OPFilters } from "@/hooks/useOPsDashboard";

export default function DashboardOPs() {
  const [filters, setFilters] = useState<OPFilters>({});
  const { data: ops, isLoading, error } = useOPsDashboard(filters);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar dashboard</h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard de Ordens de Produção
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho e status das ordens de produção em tempo real
        </p>
      </div>

      {/* Filtros */}
      <OPsDashboardFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {/* Gráficos e Indicadores */}
      <OPsChartsSection ops={ops || []} />

      {/* Tabela Detalhada */}
      <OPsDetailTable ops={ops || []} />
    </div>
  );
}
