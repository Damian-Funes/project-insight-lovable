
-- Criar tabela OrdemProducao
CREATE TABLE public.ordem_producao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_op TEXT NOT NULL UNIQUE,
  projeto_id UUID NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  area_responsavel_id UUID NOT NULL REFERENCES public.areas_produtivas(id) ON DELETE CASCADE,
  data_inicio_prevista DATE NOT NULL,
  data_fim_prevista DATE NOT NULL,
  descricao_op TEXT NOT NULL,
  status_op TEXT NOT NULL DEFAULT 'Pendente' CHECK (status_op IN ('Pendente', 'Em Andamento', 'Concluída', 'Atrasada', 'Cancelada')),
  data_inicio_real TIMESTAMP WITH TIME ZONE,
  data_fim_real TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para otimização
CREATE INDEX idx_ordem_producao_projeto_id ON public.ordem_producao(projeto_id);
CREATE INDEX idx_ordem_producao_area_responsavel_id ON public.ordem_producao(area_responsavel_id);
CREATE INDEX idx_ordem_producao_status_op ON public.ordem_producao(status_op);
CREATE INDEX idx_ordem_producao_data_inicio_prevista ON public.ordem_producao(data_inicio_prevista);
CREATE INDEX idx_ordem_producao_data_fim_prevista ON public.ordem_producao(data_fim_prevista);

-- Habilitar RLS
ALTER TABLE public.ordem_producao ENABLE ROW LEVEL SECURITY;

-- Política para visualização (todos os usuários autenticados podem ver)
CREATE POLICY "Usuários autenticados podem ver ordens de produção" 
  ON public.ordem_producao 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política para inserção (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem criar ordens de produção" 
  ON public.ordem_producao 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Política para atualização (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem atualizar ordens de produção" 
  ON public.ordem_producao 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Política para exclusão (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem deletar ordens de produção" 
  ON public.ordem_producao 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_ordem_producao_updated_at 
    BEFORE UPDATE ON public.ordem_producao 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para validar datas (data_fim_prevista deve ser maior que data_inicio_prevista)
CREATE OR REPLACE FUNCTION validate_ordem_producao_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que data_fim_prevista é posterior a data_inicio_prevista
    IF NEW.data_fim_prevista <= NEW.data_inicio_prevista THEN
        RAISE EXCEPTION 'A data de fim prevista deve ser posterior à data de início prevista';
    END IF;
    
    -- Se data_fim_real existe, validar que é posterior a data_inicio_real
    IF NEW.data_fim_real IS NOT NULL AND NEW.data_inicio_real IS NOT NULL THEN
        IF NEW.data_fim_real <= NEW.data_inicio_real THEN
            RAISE EXCEPTION 'A data de fim real deve ser posterior à data de início real';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de validação
CREATE TRIGGER validate_ordem_producao_dates_trigger
    BEFORE INSERT OR UPDATE ON public.ordem_producao
    FOR EACH ROW EXECUTE FUNCTION validate_ordem_producao_dates();
