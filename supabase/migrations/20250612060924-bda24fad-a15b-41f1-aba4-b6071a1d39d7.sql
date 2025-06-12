
-- Criar índices para otimizar as queries mais frequentes

-- Índices para registros_atividades (tabela mais consultada)
CREATE INDEX IF NOT EXISTS idx_registros_atividades_data_registro ON public.registros_atividades (data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_registros_atividades_projeto_id ON public.registros_atividades (projeto_id);
CREATE INDEX IF NOT EXISTS idx_registros_atividades_area_id ON public.registros_atividades (area_id);
CREATE INDEX IF NOT EXISTS idx_registros_atividades_responsavel_id ON public.registros_atividades (responsavel_id);
CREATE INDEX IF NOT EXISTS idx_registros_atividades_ordem_producao_id ON public.registros_atividades (ordem_producao_id);

-- Índices para ordem_producao
CREATE INDEX IF NOT EXISTS idx_ordem_producao_status ON public.ordem_producao (status_op);
CREATE INDEX IF NOT EXISTS idx_ordem_producao_data_inicio_prevista ON public.ordem_producao (data_inicio_prevista DESC);
CREATE INDEX IF NOT EXISTS idx_ordem_producao_projeto_id ON public.ordem_producao (projeto_id);
CREATE INDEX IF NOT EXISTS idx_ordem_producao_area_responsavel_id ON public.ordem_producao (area_responsavel_id);

-- Índices para projetos
CREATE INDEX IF NOT EXISTS idx_projetos_status ON public.projetos (status_projeto);
CREATE INDEX IF NOT EXISTS idx_projetos_created_at ON public.projetos (created_at DESC);

-- Índices para receitas
CREATE INDEX IF NOT EXISTS idx_receitas_data_receita ON public.receitas (data_receita DESC);
CREATE INDEX IF NOT EXISTS idx_receitas_projeto_id ON public.receitas (projeto_id);

-- Índices para notificacoes
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_id ON public.notificacoes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON public.notificacoes (lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_data_notificacao ON public.notificacoes (data_notificacao DESC);

-- Índices para alertas_operacionais
CREATE INDEX IF NOT EXISTS idx_alertas_operacionais_ativo ON public.alertas_operacionais (ativo);
CREATE INDEX IF NOT EXISTS idx_alertas_operacionais_area_id ON public.alertas_operacionais (area_id);
CREATE INDEX IF NOT EXISTS idx_alertas_operacionais_data_inicio ON public.alertas_operacionais (data_inicio DESC);

-- Índices para resultados_preditivos
CREATE INDEX IF NOT EXISTS idx_resultados_preditivos_modelo_id ON public.resultados_preditivos (modelo_id);
CREATE INDEX IF NOT EXISTS idx_resultados_preditivos_tipo_previsao ON public.resultados_preditivos (tipo_previsao);
CREATE INDEX IF NOT EXISTS idx_resultados_preditivos_data_previsao ON public.resultados_preditivos (data_previsao DESC);

-- Índices compostos para queries complexas
CREATE INDEX IF NOT EXISTS idx_registros_atividades_projeto_data ON public.registros_atividades (projeto_id, data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_registros_atividades_area_data ON public.registros_atividades (area_id, data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_ordem_producao_area_status ON public.ordem_producao (area_responsavel_id, status_op);
