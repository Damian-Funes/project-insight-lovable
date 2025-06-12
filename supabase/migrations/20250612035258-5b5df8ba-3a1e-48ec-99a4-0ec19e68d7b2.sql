
-- Criar tabela ModelosPreditivos
CREATE TABLE public.modelos_preditivos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_modelo TEXT NOT NULL UNIQUE,
    descricao_modelo TEXT,
    tipo_modelo TEXT NOT NULL CHECK (tipo_modelo IN ('Regressão', 'Classificação', 'Detecção de Anomalias', 'Séries Temporais')),
    data_treinamento TIMESTAMP WITH TIME ZONE,
    status_modelo TEXT NOT NULL DEFAULT 'Inativo' CHECK (status_modelo IN ('Ativo', 'Inativo', 'Em Treinamento')),
    parametros_modelo JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela ResultadosPreditivos
CREATE TABLE public.resultados_preditivos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    modelo_id UUID NOT NULL REFERENCES public.modelos_preditivos(id) ON DELETE CASCADE,
    data_previsao DATE NOT NULL,
    tipo_previsao TEXT NOT NULL CHECK (tipo_previsao IN ('Custo', 'Receita', 'Retrabalho', 'Anomalia')),
    valor_previsto DECIMAL,
    intervalo_confianca_min DECIMAL,
    intervalo_confianca_max DECIMAL,
    detalhes_anomalia TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_modelos_preditivos_tipo_modelo ON public.modelos_preditivos(tipo_modelo);
CREATE INDEX idx_modelos_preditivos_status_modelo ON public.modelos_preditivos(status_modelo);
CREATE INDEX idx_modelos_preditivos_data_treinamento ON public.modelos_preditivos(data_treinamento);

CREATE INDEX idx_resultados_preditivos_modelo_id ON public.resultados_preditivos(modelo_id);
CREATE INDEX idx_resultados_preditivos_data_previsao ON public.resultados_preditivos(data_previsao);
CREATE INDEX idx_resultados_preditivos_tipo_previsao ON public.resultados_preditivos(tipo_previsao);
CREATE INDEX idx_resultados_preditivos_created_at ON public.resultados_preditivos(created_at);

-- Habilitar Row Level Security (RLS) para ambas as tabelas
ALTER TABLE public.modelos_preditivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados_preditivos ENABLE ROW LEVEL SECURITY;

-- Políticas para modelos_preditivos (acesso geral para usuários autenticados)
CREATE POLICY "Usuários autenticados podem ver modelos preditivos" 
    ON public.modelos_preditivos 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Administradores podem gerenciar modelos preditivos" 
    ON public.modelos_preditivos 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para resultados_preditivos (acesso geral para usuários autenticados)
CREATE POLICY "Usuários autenticados podem ver resultados preditivos" 
    ON public.resultados_preditivos 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Administradores podem gerenciar resultados preditivos" 
    ON public.resultados_preditivos 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
