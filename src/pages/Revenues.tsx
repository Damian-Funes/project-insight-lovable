
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRevenues } from "@/hooks/useRevenues";
import { useDeleteRevenue } from "@/hooks/useRevenueMutations";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ProjectFilter } from "@/components/ProjectFilter";
import { RevenueFormModal } from "@/components/RevenueFormModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Revenues() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedProject, setSelectedProject] = useState("all");

  const { data: revenues, isLoading } = useRevenues({
    startDate: dateRange.from,
    endDate: dateRange.to,
    projectId: selectedProject,
  });

  const deleteRevenue = useDeleteRevenue();

  const filteredRevenues = revenues?.filter((revenue) =>
    revenue.descricao_receita?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    revenue.projetos?.nome_projeto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    revenue.tipo_receita?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalRevenue = filteredRevenues.reduce((sum, revenue) => sum + Number(revenue.valor_receita), 0);

  const handleEdit = (revenue: any) => {
    setSelectedRevenue(revenue);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
      await deleteRevenue.mutateAsync(id);
    }
  };

  const handleNewRevenue = () => {
    setSelectedRevenue(null);
    setIsModalOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Venda de Serviço": return "bg-chart-primary/20 text-chart-primary border-chart-primary/50";
      case "Venda de Produto": return "bg-chart-tertiary/20 text-chart-tertiary border-chart-tertiary/50";
      case "Outros": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Receitas</h1>
            <p className="text-muted-foreground">
              Gerencie as receitas dos seus projetos
            </p>
          </div>
        </div>
        <Button onClick={handleNewRevenue} className="bg-gradient-to-r from-chart-primary to-accent hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="metric-card border-chart-tertiary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-chart-tertiary">
              Total de Receitas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-chart-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-tertiary">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredRevenues.length} receita(s) encontrada(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar receitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
            </div>
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <ProjectFilter
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Receitas */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Carregando receitas...</div>
          ) : filteredRevenues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma receita encontrada.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRevenues.map((revenue) => (
                <div
                  key={revenue.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-dashboard-cardHover transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {revenue.projetos?.nome_projeto || "Projeto não encontrado"}
                      </h3>
                      {revenue.tipo_receita && (
                        <Badge className={getTypeColor(revenue.tipo_receita)}>
                          {revenue.tipo_receita}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {revenue.descricao_receita || "Sem descrição"}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-chart-tertiary font-medium">
                        R$ {Number(revenue.valor_receita).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(revenue.data_receita), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(revenue)}
                      className="border-border hover:bg-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(revenue.id)}
                      className="border-border text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RevenueFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        revenue={selectedRevenue}
      />
    </div>
  );
}
