
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Plus, Save } from "lucide-react";
import { useState } from "react";

const Activities = () => {
  const [activities] = useState([
    {
      id: 1,
      date: "2024-06-12",
      project: "Projeto Alpha",
      area: "Desenvolvimento",
      hours: 4.5,
      type: "Padrão",
      description: "Implementação da API de autenticação"
    },
    {
      id: 2,
      date: "2024-06-12",
      project: "Projeto Beta",
      area: "Design",
      hours: 3.0,
      type: "Retrabalho",
      description: "Revisão das telas de dashboard"
    },
    {
      id: 3,
      date: "2024-06-11",
      project: "Projeto Gamma",
      area: "QA",
      hours: 6.0,
      type: "Padrão",
      description: "Testes automatizados para módulo de relatórios"
    }
  ]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Atividades</h1>
            <p className="text-muted-foreground">Registre as horas trabalhadas em projetos</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
          <Clock className="w-3 h-3 mr-1" />
          Hoje: 7.5h registradas
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Registration Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-chart-primary" />
              <span>Nova Atividade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input 
                id="date" 
                type="date" 
                defaultValue="2024-06-12"
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Projeto</Label>
              <Select>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="alpha">Projeto Alpha</SelectItem>
                  <SelectItem value="beta">Projeto Beta</SelectItem>
                  <SelectItem value="gamma">Projeto Gamma</SelectItem>
                  <SelectItem value="delta">Projeto Delta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área Produtiva</Label>
              <Select>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="dev">Desenvolvimento</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Horas Trabalhadas</Label>
              <Input 
                id="hours" 
                type="number" 
                step="0.5" 
                placeholder="Ex: 4.5"
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Atividade</Label>
              <Select>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="rework">Retrabalho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description"
                placeholder="Descreva brevemente a atividade realizada..."
                className="bg-input border-border min-h-[80px]"
              />
            </div>

            <Button className="w-full bg-chart-primary hover:bg-chart-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Registrar Atividade
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-chart-secondary" />
              <span>Atividades Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-muted-foreground">Projeto</TableHead>
                  <TableHead className="text-muted-foreground">Área</TableHead>
                  <TableHead className="text-muted-foreground">Horas</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id} className="border-border hover:bg-muted/50">
                    <TableCell className="text-foreground">
                      {new Date(activity.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {activity.project}
                    </TableCell>
                    <TableCell className="text-foreground">{activity.area}</TableCell>
                    <TableCell className="text-foreground">{activity.hours}h</TableCell>
                    <TableCell>
                      <Badge 
                        variant={activity.type === "Padrão" ? "default" : "destructive"}
                        className={activity.type === "Padrão" 
                          ? "bg-metric-profit/10 text-metric-profit border-metric-profit" 
                          : "bg-metric-cost/10 text-metric-cost border-metric-cost"
                        }
                      >
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {activity.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Activities;
