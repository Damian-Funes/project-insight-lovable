
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOptimizedProjects } from "@/hooks/useOptimizedProjects";
import { useOptimizedAreas } from "@/hooks/useOptimizedAreas";
import { OptimizedOPFilters } from "@/hooks/useOptimizedOPsDashboard";

interface OPsDashboardFiltersProps {
  filters: OptimizedOPFilters;
  onFiltersChange: (filters: OptimizedOPFilters) => void;
}

export const OPsDashboardFilters = ({ filters, onFiltersChange }: OPsDashboardFiltersProps) => {
  const { data: projects } = useOptimizedProjects();
  const { data: areas } = useOptimizedAreas();

  const updateFilter = (key: keyof OptimizedOPFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-card rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="projeto">Projeto</Label>
        <Select 
          value={filters.projeto_id || "all"} 
          onValueChange={(value) => updateFilter("projeto_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os projetos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os projetos</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.nome_projeto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Área Responsável</Label>
        <Select 
          value={filters.area_id || "all"} 
          onValueChange={(value) => updateFilter("area_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {areas?.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.nome_area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={filters.status || "all"} 
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
            <SelectItem value="Atrasada">Atrasada</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_inicio_de">Data Início (De)</Label>
        <Input
          id="data_inicio_de"
          type="date"
          value={filters.data_inicio_de || ""}
          onChange={(e) => updateFilter("data_inicio_de", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_inicio_ate">Data Início (Até)</Label>
        <Input
          id="data_inicio_ate"
          type="date"
          value={filters.data_inicio_ate || ""}
          onChange={(e) => updateFilter("data_inicio_ate", e.target.value)}
        />
      </div>
    </div>
  );
};
