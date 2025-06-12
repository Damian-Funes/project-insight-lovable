
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";
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
      case "Venda de Serviço": return "bg-blue-100 text-blue-800";
      case "Venda de Produto": return "bg-green-100 text-green-800";
      case "Outros": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground">
            Gerencie as receitas dos seus projetos
          </p>
        </div>
        <Button onClick={handleNewRevenue} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total de Receitas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600">
              {filteredRevenues.length} receita(s) encontrada(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
                  className="pl-10"
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
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando receitas...</div>
          ) : filteredRevenues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma receita encontrada.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRevenues.map((revenue) => (
                <div
                  key={revenue.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
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
                      <span className="text-green-600 font-medium">
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(revenue.id)}
                      className="text-red-600 hover:text-red-700"
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
