
-- Adicionar coluna ordem_producao_id na tabela registros_atividades
ALTER TABLE public.registros_atividades 
ADD COLUMN ordem_producao_id UUID REFERENCES public.ordem_producao(id) ON DELETE SET NULL;

-- Criar índice para otimização de consultas
CREATE INDEX idx_registros_atividades_ordem_producao_id ON public.registros_atividades(ordem_producao_id);

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.registros_atividades.ordem_producao_id IS 'Referência opcional para a ordem de produção associada à atividade';
