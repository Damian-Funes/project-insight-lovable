
-- Criar tabela CenariosFinanceiros
CREATE TABLE public.cenarios_financeiros (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_cenario TEXT NOT NULL UNIQUE,
    descricao_cenario TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    usuario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parametros_simulacao JSONB,
    resultados_simulacao JSONB,
    ativo BOOLEAN NOT NULL DEFAULT true
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_cenarios_financeiros_usuario_id ON public.cenarios_financeiros(usuario_id);
CREATE INDEX idx_cenarios_financeiros_ativo ON public.cenarios_financeiros(ativo);
CREATE INDEX idx_cenarios_financeiros_data_criacao ON public.cenarios_financeiros(data_criacao);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.cenarios_financeiros ENABLE ROW LEVEL SECURITY;

-- Política para que usuários possam ver apenas seus próprios cenários
CREATE POLICY "Usuários podem ver seus próprios cenários" 
    ON public.cenarios_financeiros 
    FOR SELECT 
    USING (usuario_id = auth.uid());

-- Política para que usuários possam criar seus próprios cenários
CREATE POLICY "Usuários podem criar seus próprios cenários" 
    ON public.cenarios_financeiros 
    FOR INSERT 
    WITH CHECK (usuario_id = auth.uid());

-- Política para que usuários possam atualizar seus próprios cenários
CREATE POLICY "Usuários podem atualizar seus próprios cenários" 
    ON public.cenarios_financeiros 
    FOR UPDATE 
    USING (usuario_id = auth.uid());

-- Política para que usuários possam deletar seus próprios cenários
CREATE POLICY "Usuários podem deletar seus próprios cenários" 
    ON public.cenarios_financeiros 
    FOR DELETE 
    USING (usuario_id = auth.uid());
