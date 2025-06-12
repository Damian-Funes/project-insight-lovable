
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Check, CheckCheck, Trash2, X, AlertCircle, TrendingUp, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes('orçamento') || message.toLowerCase().includes('custo')) {
      return <AlertCircle className="w-4 h-4 text-metric-cost" />;
    }
    if (message.toLowerCase().includes('prazo') || message.toLowerCase().includes('tempo')) {
      return <Clock className="w-4 h-4 text-metric-warning" />;
    }
    if (message.toLowerCase().includes('receita') || message.toLowerCase().includes('sucesso')) {
      return <TrendingUp className="w-4 h-4 text-metric-profit" />;
    }
    return <Bell className="w-4 h-4 text-chart-primary" />;
  };

  const getBadgeColor = (message: string) => {
    if (message.toLowerCase().includes('orçamento') || message.toLowerCase().includes('custo')) {
      return "bg-metric-cost text-white";
    }
    if (message.toLowerCase().includes('prazo') || message.toLowerCase().includes('tempo')) {
      return "bg-metric-warning text-white";
    }
    if (message.toLowerCase().includes('receita') || message.toLowerCase().includes('sucesso')) {
      return "bg-metric-profit text-white";
    }
    return "bg-chart-primary text-white";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-border animate-fade-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-card-foreground">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-chart-primary" />
                <span className="bg-gradient-to-r from-chart-primary to-chart-secondary bg-clip-text text-transparent font-bold text-xl">
                  Minhas Notificações
                </span>
              </div>
            </DialogTitle>
            {notifications && notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isPending}
                className="flex items-center gap-2 border-border hover:bg-dashboard-cardHover transition-all duration-200"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator className="bg-border" />

        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-chart-primary border-t-transparent rounded-full animate-spin"></div>
                <p>Carregando notificações...</p>
              </div>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <Bell className="w-16 h-16 mx-auto text-accent opacity-50" />
                <div>
                  <p className="text-lg font-medium text-card-foreground">Nenhuma notificação encontrada</p>
                  <p className="text-sm mt-1">Você está em dia com todas as suas notificações!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`metric-card ${
                    !notification.lida 
                      ? "bg-dashboard-card border-chart-primary/30 shadow-lg shadow-chart-primary/10" 
                      : "bg-accent border-border"
                  } transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.mensagem)}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          {!notification.lida && (
                            <Badge className={`text-xs px-2 py-1 ${getBadgeColor(notification.mensagem)} animate-scale-in`}>
                              Nova
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(notification.data_notificacao), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed text-card-foreground">
                          {notification.mensagem}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.lida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsRead.isPending}
                          className="h-8 w-8 p-0 hover:bg-metric-profit/20 hover:text-metric-profit transition-all duration-200"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        disabled={deleteNotification.isPending}
                        className="h-8 w-8 p-0 hover:bg-metric-cost/20 hover:text-metric-cost transition-all duration-200"
                        title="Excluir notificação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
