
import { Button } from "@/components/ui/button";

interface ActivityFormButtonsProps {
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const ActivityFormButtons = ({ onCancel, isLoading, mode }: ActivityFormButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-chart-primary hover:bg-chart-primary/90"
      >
        {isLoading ? "Processando..." : mode === "edit" ? "Atualizar" : "Registrar"} Atividade
      </Button>
    </div>
  );
};
