
-- Função RPC para calcular dados de rentabilidade otimizada
CREATE OR REPLACE FUNCTION calcular_rentabilidade_projetos(
  filtro_projeto_id UUID DEFAULT NULL,
  filtro_data_inicio DATE DEFAULT NULL,
  filtro_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  projeto_id UUID,
  nome_projeto TEXT,
  receita_total NUMERIC,
  custo_total NUMERIC,
  lucro NUMERIC,
  margem_lucro NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH receitas_por_projeto AS (
    SELECT 
      r.projeto_id,
      p.nome_projeto,
      COALESCE(SUM(r.valor_receita), 0) as total_receitas
    FROM receitas r
    INNER JOIN projetos p ON r.projeto_id = p.id
    WHERE (filtro_projeto_id IS NULL OR r.projeto_id = filtro_projeto_id)
      AND (filtro_data_inicio IS NULL OR r.data_receita >= filtro_data_inicio)
      AND (filtro_data_fim IS NULL OR r.data_receita <= filtro_data_fim)
    GROUP BY r.projeto_id, p.nome_projeto
  ),
  custos_por_projeto AS (
    SELECT 
      ra.projeto_id,
      COALESCE(SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)), 0) as total_custos
    FROM registros_atividades ra
    LEFT JOIN areas_produtivas ap ON ra.area_id = ap.id
    WHERE (filtro_projeto_id IS NULL OR ra.projeto_id = filtro_projeto_id)
      AND (filtro_data_inicio IS NULL OR ra.data_registro >= filtro_data_inicio)
      AND (filtro_data_fim IS NULL OR ra.data_registro <= filtro_data_fim)
    GROUP BY ra.projeto_id
  ),
  todos_projetos AS (
    SELECT projeto_id, nome_projeto FROM receitas_por_projeto
    UNION
    SELECT p.id as projeto_id, p.nome_projeto 
    FROM projetos p 
    WHERE EXISTS (SELECT 1 FROM custos_por_projeto c WHERE c.projeto_id = p.id)
      AND (filtro_projeto_id IS NULL OR p.id = filtro_projeto_id)
  )
  SELECT 
    tp.projeto_id,
    tp.nome_projeto,
    COALESCE(rpp.total_receitas, 0) as receita_total,
    COALESCE(cpp.total_custos, 0) as custo_total,
    COALESCE(rpp.total_receitas, 0) - COALESCE(cpp.total_custos, 0) as lucro,
    CASE 
      WHEN COALESCE(rpp.total_receitas, 0) > 0 
      THEN ((COALESCE(rpp.total_receitas, 0) - COALESCE(cpp.total_custos, 0)) / COALESCE(rpp.total_receitas, 0)) * 100
      ELSE 0 
    END as margem_lucro
  FROM todos_projetos tp
  LEFT JOIN receitas_por_projeto rpp ON tp.projeto_id = rpp.projeto_id
  LEFT JOIN custos_por_projeto cpp ON tp.projeto_id = cpp.projeto_id
  ORDER BY tp.nome_projeto;
END;
$$;

-- Função RPC para calcular custos por projeto otimizada
CREATE OR REPLACE FUNCTION calcular_custos_projetos(
  filtro_projeto_id UUID DEFAULT NULL,
  filtro_data_inicio DATE DEFAULT NULL,
  filtro_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  nome_projeto TEXT,
  custo_total NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.nome_projeto,
    COALESCE(SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)), 0) as custo_total
  FROM projetos p
  INNER JOIN registros_atividades ra ON p.id = ra.projeto_id
  LEFT JOIN areas_produtivas ap ON ra.area_id = ap.id
  WHERE (filtro_projeto_id IS NULL OR p.id = filtro_projeto_id)
    AND (filtro_data_inicio IS NULL OR ra.data_registro >= filtro_data_inicio)
    AND (filtro_data_fim IS NULL OR ra.data_registro <= filtro_data_fim)
  GROUP BY p.id, p.nome_projeto
  HAVING SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)) > 0
  ORDER BY custo_total DESC;
END;
$$;

-- Função RPC para calcular custos por área otimizada
CREATE OR REPLACE FUNCTION calcular_custos_areas(
  filtro_area_id UUID DEFAULT NULL,
  filtro_data_inicio DATE DEFAULT NULL,
  filtro_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  nome_area TEXT,
  custo_total NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.nome_area,
    COALESCE(SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)), 0) as custo_total
  FROM areas_produtivas ap
  INNER JOIN registros_atividades ra ON ap.id = ra.area_id
  WHERE (filtro_area_id IS NULL OR ap.id = filtro_area_id)
    AND (filtro_data_inicio IS NULL OR ra.data_registro >= filtro_data_inicio)
    AND (filtro_data_fim IS NULL OR ra.data_registro <= filtro_data_fim)
  GROUP BY ap.id, ap.nome_area
  HAVING SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)) > 0
  ORDER BY custo_total DESC;
END;
$$;

-- Função RPC para dashboard de OPs otimizada com paginação
CREATE OR REPLACE FUNCTION buscar_ops_dashboard(
  filtro_projeto_id UUID DEFAULT NULL,
  filtro_area_id UUID DEFAULT NULL,
  filtro_status TEXT DEFAULT NULL,
  filtro_data_inicio_de DATE DEFAULT NULL,
  filtro_data_inicio_ate DATE DEFAULT NULL,
  limite INTEGER DEFAULT 30,
  offset_valor INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  numero_op TEXT,
  descricao_op TEXT,
  status_op TEXT,
  data_inicio_prevista DATE,
  data_fim_prevista DATE,
  data_inicio_real DATE,
  data_fim_real DATE,
  projeto_id UUID,
  area_responsavel_id UUID,
  nome_projeto TEXT,
  nome_area TEXT,
  custo_hora_padrao NUMERIC,
  tempo_execucao_dias INTEGER,
  custo_total NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    op.id,
    op.numero_op,
    op.descricao_op,
    op.status_op,
    op.data_inicio_prevista,
    op.data_fim_prevista,
    op.data_inicio_real,
    op.data_fim_real,
    op.projeto_id,
    op.area_responsavel_id,
    p.nome_projeto,
    ap.nome_area,
    ap.custo_hora_padrao,
    CASE 
      WHEN op.data_inicio_real IS NOT NULL AND op.data_fim_real IS NOT NULL 
      THEN EXTRACT(DAYS FROM (op.data_fim_real - op.data_inicio_real))::INTEGER
      ELSE 0 
    END as tempo_execucao_dias,
    CASE 
      WHEN op.status_op = 'Concluída' 
      THEN COALESCE((
        SELECT SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50))
        FROM registros_atividades ra
        WHERE ra.ordem_producao_id = op.id
      ), 0)
      ELSE 0 
    END as custo_total
  FROM ordem_producao op
  INNER JOIN projetos p ON op.projeto_id = p.id
  INNER JOIN areas_produtivas ap ON op.area_responsavel_id = ap.id
  WHERE (filtro_projeto_id IS NULL OR op.projeto_id = filtro_projeto_id)
    AND (filtro_area_id IS NULL OR op.area_responsavel_id = filtro_area_id)
    AND (filtro_status IS NULL OR op.status_op = filtro_status)
    AND (filtro_data_inicio_de IS NULL OR op.data_inicio_prevista >= filtro_data_inicio_de)
    AND (filtro_data_inicio_ate IS NULL OR op.data_inicio_prevista <= filtro_data_inicio_ate)
  ORDER BY op.data_inicio_prevista DESC
  LIMIT limite
  OFFSET offset_valor;
END;
$$;
