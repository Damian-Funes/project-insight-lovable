
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ProjectFilter } from "@/components/ProjectFilter";
import { AreaFilter } from "@/components/AreaFilter";
import { Filter, Calendar } from "lucide-react";

interface DashboardFiltersProps {
  startDate?: Date;
  endDate?: Date;
  selectedProject: string;
  selectedArea: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onProjectChange: (project: string) => void;
  onAreaChange: (area: string) => void;
  onClearFilters: () => void;
}

export const DashboardFilters = memo(({
  startDate,
  endDate,
  selectedProject,
  selectedArea,
  onStartDateChange,
  onEndDateChange,
  onProjectChange,
  onAreaChange,
  onClearFilters
}: DashboardFiltersProps) => {
  return (
    <Card className="border-l-4 border-l-chart-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-chart-primary" />
          <CardTitle className="text-lg">Filtros de Análise</CardTitle>
        </div>
        <CardDescription>
          Utilize os filtros abaixo para refinar sua análise de custos e rentabilidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </div>
          <ProjectFilter
            selectedProject={selectedProject}
            onProjectChange={onProjectChange}
          />
          <AreaFilter
            selectedArea={selectedArea}
            onAreaChange={onAreaChange}
          />
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

DashboardFilters.displayName = 'DashboardFilters';
