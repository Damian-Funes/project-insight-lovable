
-- Criar enum para tipos de alerta
CREATE TYPE public.tipo_alerta AS ENUM ('Orçamento Excedido', 'Prazo Próximo', 'Registro Pendente', 'Outros');

-- Criar tabela AlertasConfig
CREATE TABLE public.alertas_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_alerta TEXT NOT NULL,
  tipo_alerta public.tipo_alerta NOT NULL,
  condicao TEXT NOT NULL,
  mensagem_alerta TEXT NOT NULL,
  destinatarios TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela Notificacoes
CREATE TABLE public.notificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alerta_id UUID REFERENCES public.alertas_config(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL,
  mensagem TEXT NOT NULL,
  data_notificacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  contexto_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_alertas_config_tipo ON public.alertas_config(tipo_alerta);
CREATE INDEX idx_alertas_config_ativo ON public.alertas_config(ativo);
CREATE INDEX idx_notificacoes_usuario ON public.notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON public.notificacoes(lida);
CREATE INDEX idx_notificacoes_data ON public.notificacoes(data_notificacao);
CREATE INDEX idx_notificacoes_alerta ON public.notificacoes(alerta_id);

-- Habilitar RLS nas tabelas
ALTER TABLE public.alertas_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para AlertasConfig (apenas admins podem gerenciar alertas)
CREATE POLICY "Admins podem ver todos os alertas" 
  ON public.alertas_config 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins podem criar alertas" 
  ON public.alertas_config 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins podem atualizar alertas" 
  ON public.alertas_config 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins podem excluir alertas" 
  ON public.alertas_config 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas RLS para Notificacoes (usuários veem apenas suas próprias notificações)
CREATE POLICY "Usuários podem ver suas próprias notificações" 
  ON public.notificacoes 
  FOR SELECT 
  USING (auth.uid() = usuario_id);

CREATE POLICY "Sistema pode criar notificações" 
  ON public.notificacoes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias notificações" 
  ON public.notificacoes 
  FOR UPDATE 
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem excluir suas próprias notificações" 
  ON public.notificacoes 
  FOR DELETE 
  USING (auth.uid() = usuario_id);
