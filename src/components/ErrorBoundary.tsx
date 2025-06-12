
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log do erro
    console.error('💥 Error Boundary capturou um erro:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // Callback customizado
    this.props.onError?.(error, errorInfo);

    // Enviar erro para serviço de monitoramento (simulado)
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Simulação de envio para serviço de monitoramento
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'anonymous', // Seria obtido do contexto de auth
      };

      console.log('📊 Relatório de erro enviado:', errorReport);
      
      // Aqui você enviaria para um serviço como Sentry, LogRocket, etc.
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    } catch (reportingError) {
      console.error('Falha ao reportar erro:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Ops! Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Encontramos um erro inesperado. Nossa equipe foi notificada e está trabalhando para corrigi-lo.
              </p>
              
              <div className="text-sm text-muted-foreground text-center">
                ID do Erro: <code className="bg-muted px-2 py-1 rounded text-xs">{this.state.errorId}</code>
              </div>

              {this.props.showDetails && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                    Detalhes técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-md text-xs">
                    <div className="font-medium text-destructive mb-2">
                      {this.state.error.message}
                    </div>
                    <pre className="whitespace-pre-wrap text-muted-foreground overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button 
                  onClick={this.handleRetry}
                  variant="default"
                  className="flex-1 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  Recarregar Página
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="ghost"
                  className="flex-1 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ir para Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar com componentes funcionais
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('💥 Erro capturado pelo hook:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Simular envio de erro
    // Em uma implementação real, você enviaria para um serviço de monitoramento
  }, []);

  return { handleError };
};
