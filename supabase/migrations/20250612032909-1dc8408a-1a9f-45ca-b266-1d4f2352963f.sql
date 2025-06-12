
-- Criar tabela para armazenar ajustes manuais das projeções
CREATE TABLE public.projecoes_manuais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_referencia DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('custos', 'receitas')),
  valor_projetado NUMERIC NOT NULL DEFAULT 0.00,
  ajuste_manual NUMERIC NOT NULL DEFAULT 0.00,
  projeto_id UUID REFERENCES public.projetos(id),
  area_id UUID REFERENCES public.areas_produtivas(id),
  usuario_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX idx_projecoes_manuais_data_tipo ON public.projecoes_manuais(data_referencia, tipo);
CREATE INDEX idx_projecoes_manuais_usuario ON public.projecoes_manuais(usuario_id);

-- Habilitar RLS
ALTER TABLE public.projecoes_manuais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir que usuários vejam e modifiquem apenas suas próprias projeções
CREATE POLICY "Usuários podem ver suas próprias projeções" 
  ON public.projecoes_manuais 
  FOR SELECT 
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar suas próprias projeções" 
  ON public.projecoes_manuais 
  FOR INSERT 
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias projeções" 
  ON public.projecoes_manuais 
  FOR UPDATE 
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem excluir suas próprias projeções" 
  ON public.projecoes_manuais 
  FOR DELETE 
  USING (auth.uid() = usuario_id);
