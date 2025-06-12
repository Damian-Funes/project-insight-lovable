
import { lazy, Suspense } from "react";
import { DashboardChartsSkeleton } from "@/components/OptimizedLoadingSpinner";

// Lazy load do componente de gráficos pesado
const OPsChartsSection = lazy(() => 
  import("@/components/OPsChartsSection").then(module => ({
    default: module.OPsChartsSection
  }))
);

interface LazyOPsChartsProps {
  ops: any[];
}

export const LazyOPsCharts = ({ ops }: LazyOPsChartsProps) => (
  <Suspense fallback={<DashboardChartsSkeleton />}>
    <OPsChartsSection ops={ops} />
  </Suspense>
);
