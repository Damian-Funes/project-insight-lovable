
import { Tv } from "lucide-react";
import { AreaFilter } from "@/components/AreaFilter";
import { useAreas } from "@/hooks/useAreas";

interface TvHeaderProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
}

export const TvHeader = ({ selectedArea, onAreaChange }: TvHeaderProps) => {
  const { data: areas } = useAreas();

  const selectedAreaName = selectedArea === "all" 
    ? "Nenhuma Área Selecionada" 
    : areas?.find(area => area.id === selectedArea)?.nome_area || "Área Desconhecida";

  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <Tv className="w-12 h-12 text-chart-primary" />
          <div>
            <h1 className="text-6xl font-bold text-foreground leading-tight">
              Painel Operacional
            </h1>
            <p className="text-2xl text-chart-primary font-semibold mt-2">
              {selectedAreaName}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col gap-3">
          <label className="text-xl font-semibold text-foreground">
            Selecionar Área Produtiva
          </label>
          <div className="w-80">
            <AreaFilter
              selectedArea={selectedArea}
              onAreaChange={onAreaChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
