
import { Tv } from "lucide-react";

interface TvHeaderProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
}

export const TvHeader = ({ selectedArea, onAreaChange }: TvHeaderProps) => {
  console.log('TvHeader renderizando');

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
              {selectedArea === "all" ? "Nenhuma Área Selecionada" : `Área: ${selectedArea}`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col gap-3">
          <label className="text-xl font-semibold text-foreground">
            Selecionar Área Produtiva
          </label>
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-80 p-2 border border-border rounded bg-background text-foreground"
          >
            <option value="all">Todas as áreas</option>
            <option value="area1">Área 1</option>
            <option value="area2">Área 2</option>
            <option value="area3">Área 3</option>
          </select>
        </div>
      </div>
    </div>
  );
};
