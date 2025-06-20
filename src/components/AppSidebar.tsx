
import React from "react";
import { Home, BarChart3, Building2, DollarSign, TrendingUp, FileText } from "lucide-react";
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

// Menu items - apenas funcionalidades financeiras
const items = [
  {
    title: "Dashboard Financeiro",
    url: "/dashboard",
    icon: Home,
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
    title: "Análise de Cenários",
    url: "/scenario-analysis",
    icon: BarChart3,
  },
  {
    title: "Áreas Produtivas",
    url: "/areas",
    icon: Building2,
  },
  {
    title: "Gestão de Áreas",
    url: "/area-management",
    icon: Building2,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Gestão Financeira
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
