
-- Criar tabela para alertas operacionais
CREATE TABLE public.alertas_operacionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_id UUID REFERENCES public.areas_produtivas(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  prioridade INTEGER NOT NULL DEFAULT 1, -- 1=baixa, 2=média, 3=alta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Índices para otimização
CREATE INDEX idx_alertas_operacionais_area_id ON public.alertas_operacionais(area_id);
CREATE INDEX idx_alertas_operacionais_ativo ON public.alertas_operacionais(ativo);
CREATE INDEX idx_alertas_operacionais_datas ON public.alertas_operacionais(data_inicio, data_fim);

-- Habilitar RLS
ALTER TABLE public.alertas_operacionais ENABLE ROW LEVEL SECURITY;

-- Política para visualização (todos podem ver alertas ativos)
CREATE POLICY "Todos podem ver alertas ativos" 
  ON public.alertas_operacionais 
  FOR SELECT 
  USING (
    ativo = true 
    AND data_inicio <= CURRENT_DATE 
    AND (data_fim IS NULL OR data_fim >= CURRENT_DATE)
  );

-- Política para inserção (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem criar alertas" 
  ON public.alertas_operacionais 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Política para atualização (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem atualizar alertas" 
  ON public.alertas_operacionais 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Política para exclusão (apenas admins e líderes de área)
CREATE POLICY "Admins e líderes podem deletar alertas" 
  ON public.alertas_operacionais 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'lider_area')
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alertas_operacionais_updated_at 
    BEFORE UPDATE ON public.alertas_operacionais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
