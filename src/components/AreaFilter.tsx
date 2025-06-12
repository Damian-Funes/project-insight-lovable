
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAreas } from "@/hooks/useAreas";

interface AreaFilterProps {
  selectedArea: string;
  onAreaChange: (value: string) => void;
  className?: string;
}

export const AreaFilter = ({ selectedArea, onAreaChange, className }: AreaFilterProps) => {
  const { data: areas } = useAreas();

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      <Select value={selectedArea} onValueChange={onAreaChange}>
        <SelectTrigger className="w-full text-lg h-14 text-foreground bg-background border-border">
          <SelectValue placeholder="Todas as áreas" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all" className="text-lg py-3">
            Todas as áreas
          </SelectItem>
          {areas?.map((area) => (
            <SelectItem key={area.id} value={area.id} className="text-lg py-3">
              {area.nome_area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
