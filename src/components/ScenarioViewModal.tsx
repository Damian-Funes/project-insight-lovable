
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScenarioResults } from "@/components/ScenarioResults";

interface ScenarioViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: any;
}

export const ScenarioViewModal = ({ isOpen, onClose, scenario }: ScenarioViewModalProps) => {
  if (!scenario) return null;

  const params = scenario.parametros_simulacao || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scenario.nome_cenario}
            <Badge variant={scenario.ativo ? "default" : "secondary"}>
              {scenario.ativo ? "Ativo" : "Inativo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cenário</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Descrição</h4>
                <p className="mt-1">{scenario.descricao_cenario || "Sem descrição"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Data de Criação</h4>
                <p className="mt-1">
                  {format(new Date(scenario.data_criacao), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm">Receitas</h4>
                  <p className="text-lg font-bold text-blue-600">
                    {params.aumento_receitas > 0 ? '+' : ''}{params.aumento_receitas || 0}%
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm">Custos Fixos</h4>
                  <p className="text-lg font-bold text-red-600">
                    {params.aumento_custos_fixos > 0 ? '+' : ''}{params.aumento_custos_fixos || 0}%
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm">Custos Variáveis</h4>
                  <p className="text-lg font-bold text-orange-600">
                    {params.aumento_custos_variaveis > 0 ? '+' : ''}{params.aumento_custos_variaveis || 0}%
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm">Retrabalho</h4>
                  <p className="text-lg font-bold text-purple-600">
                    {params.impacto_retrabalho > 0 ? '+' : ''}{params.impacto_retrabalho || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {scenario.resultados_simulacao && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados da Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <ScenarioResults results={scenario.resultados_simulacao} />
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
