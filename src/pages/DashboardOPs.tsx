
import { useState } from "react";
import { OPsDashboardFilters } from "@/components/OPsDashboardFilters";
import { OPsDetailTable } from "@/components/OPsDetailTable";
import { LazyOPsCharts } from "@/components/LazyOPsCharts";
import { FiltersBarSkeleton, DashboardChartsSkeleton } from "@/components/OptimizedLoadingSpinner";
import { useOptimizedOPsDashboard, OptimizedOPFilters } from "@/hooks/useOptimizedOPsDashboard";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="container mx-auto py-8 px-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar dashboard</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  </div>
);

export default function DashboardOPs() {
  const [filters, setFilters] = useState<OptimizedOPFilters>({ limit: 50 });
  const { data: ops, isLoading, error } = useOptimizedOPsDashboard(filters);

  if (error) {
    return <ErrorFallback error={error as Error} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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

        {/* Filtros com loading state */}
        {isLoading ? (
          <FiltersBarSkeleton />
        ) : (
          <OPsDashboardFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        )}

        {/* Gráficos com lazy loading */}
        {isLoading ? (
          <DashboardChartsSkeleton />
        ) : (
          <LazyOPsCharts ops={ops || []} />
        )}

        {/* Tabela Detalhada */}
        <OPsDetailTable ops={ops || []} />
      </div>
    </ErrorBoundary>
  );
}
