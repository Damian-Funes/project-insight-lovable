import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Home, 
  FolderOpen, 
  Building2, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  Settings,
  DollarSign,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const { logout } = useAuth();

  const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Áreas Produtivas",
    url: "/areas",
    icon: Building2,
  },
  {
    title: "Atividades",
    url: "/activities",
    icon: Clock,
  },
  {
    title: "Receitas",
    url: "/revenues",
    icon: DollarSign,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Dashboards de Custos",
    url: "/cost-dashboard",
    icon: TrendingUp,
  },
  {
    title: "Gerenciar Áreas",
    url: "/area-management",
    icon: Settings,
  },
];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
