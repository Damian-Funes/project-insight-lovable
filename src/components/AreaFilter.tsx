
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAreas } from "@/hooks/useAreas";

interface AreaFilterProps {
  selectedArea: string;
  onAreaChange: (value: string) => void;
}

export const AreaFilter = ({ selectedArea, onAreaChange }: AreaFilterProps) => {
  const { data: areas } = useAreas();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Filtrar por Área</label>
      <Select value={selectedArea} onValueChange={onAreaChange}>
        <SelectTrigger className="w-[200px]">
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
  );
};
