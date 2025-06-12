
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Clock, FolderOpen, Users, FileText, TrendingUp } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Registro de Atividades",
    url: "/activities",
    icon: Clock,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Áreas Produtivas",
    url: "/areas",
    icon: Users,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">FinPlan</h1>
            <p className="text-xs text-sidebar-foreground/60">Planejamento Estratégico</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium mb-2">
            NAVEGAÇÃO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="nav-link">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-chart-secondary to-chart-tertiary rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Usuário</p>
            <p className="text-xs text-sidebar-foreground/60">Admin</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
