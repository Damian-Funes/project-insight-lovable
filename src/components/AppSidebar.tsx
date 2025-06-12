
import React from "react";
import { Home, BarChart3, Users, Building2, FileText, DollarSign, TrendingUp, Bell, Settings, Tv, Cog } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Atividades",
    url: "/activities",
    icon: FileText,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: Building2,
  },
  {
    title: "Gestão de OPs (PCP)",
    url: "/ordem-producao",
    icon: Cog,
  },
  {
    title: "Áreas Produtivas",
    url: "/areas",
    icon: Users,
  },
  {
    title: "Gestão de Áreas",
    url: "/area-management",
    icon: Settings,
  },
  {
    title: "TV Corporativa",
    url: "/tv-corporativa",
    icon: Tv,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Dashboard de Custos",
    url: "/cost-dashboard",
    icon: DollarSign,
  },
  {
    title: "Gestão de Receitas",
    url: "/revenue-management",
    icon: TrendingUp,
  },
  {
    title: "Projeção Financeira",
    url: "/financial-projection",
    icon: TrendingUp,
  },
  {
    title: "Modelos Preditivos",
    url: "/predictive-models",
    icon: BarChart3,
  },
  {
    title: "Análise de Cenários",
    url: "/scenario-analysis",
    icon: BarChart3,
  },
  {
    title: "Configuração de Alertas",
    url: "/alerts-configuration",
    icon: Bell,
  },
];

export function AppSidebar() {
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Gestão de Projetos
          </h2>
          <NotificationBell />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full"
        >
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
