
-- Corrigir função para calcular previsão de custos usando média móvel
CREATE OR REPLACE FUNCTION public.calcular_previsao_custos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_modelo_id UUID;
    media_movel NUMERIC;
    data_atual DATE := CURRENT_DATE;
    i INTEGER;
    valor_previsto NUMERIC;
    tendencia NUMERIC := 0;
    custos_historicos NUMERIC[];
    ultimo_custo NUMERIC;
    penultimo_custo NUMERIC;
BEGIN
    -- Buscar ou criar modelo de previsão de custos
    SELECT id INTO v_modelo_id
    FROM modelos_preditivos
    WHERE nome_modelo = 'Previsão de Custos - Séries Temporais'
    AND tipo_modelo = 'Séries Temporais';
    
    -- Se não existe, criar o modelo
    IF v_modelo_id IS NULL THEN
        INSERT INTO modelos_preditivos (
            nome_modelo,
            descricao_modelo,
            tipo_modelo,
            status_modelo,
            data_treinamento,
            parametros_modelo
        )
        VALUES (
            'Previsão de Custos - Séries Temporais',
            'Modelo de previsão de custos baseado em média móvel com tendência',
            'Séries Temporais',
            'Ativo',
            NOW(),
            '{"metodo": "media_movel_com_tendencia", "janela": 6, "horizonte_previsao": 12}'::jsonb
        )
        RETURNING id INTO v_modelo_id;
    ELSE
        -- Atualizar data de treinamento
        UPDATE modelos_preditivos
        SET data_treinamento = NOW(),
            status_modelo = 'Ativo'
        WHERE id = v_modelo_id;
    END IF;
    
    -- Limpar previsões antigas para este modelo
    DELETE FROM resultados_preditivos
    WHERE modelo_id = v_modelo_id
    AND data_previsao > CURRENT_DATE;
    
    -- Calcular custos mensais dos últimos 12 meses
    WITH custos_mensais AS (
        SELECT 
            DATE_TRUNC('month', ra.data_registro)::date AS mes,
            SUM(ra.horas_gastas * COALESCE(ap.custo_hora_padrao, 50)) AS custo_mensal
        FROM registros_atividades ra
        LEFT JOIN areas_produtivas ap ON ra.area_id = ap.id
        WHERE ra.data_registro >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', ra.data_registro)
        ORDER BY mes
    ),
    custos_array AS (
        SELECT array_agg(custo_mensal ORDER BY mes) AS custos
        FROM custos_mensais
    )
    SELECT custos INTO custos_historicos FROM custos_array;
    
    -- Se não há dados suficientes, usar valor padrão
    IF array_length(custos_historicos, 1) IS NULL OR array_length(custos_historicos, 1) < 3 THEN
        custos_historicos := ARRAY[50000, 55000, 52000, 58000, 60000, 57000];
    END IF;
    
    -- Calcular média móvel dos últimos 6 meses (ou todos os disponíveis se menos de 6)
    WITH ultimos_valores AS (
        SELECT unnest(custos_historicos[GREATEST(1, array_length(custos_historicos, 1) - 5):array_length(custos_historicos, 1)]) AS valor
    )
    SELECT AVG(valor) INTO media_movel FROM ultimos_valores;
    
    -- Calcular tendência simples (diferença entre últimos dois valores)
    IF array_length(custos_historicos, 1) >= 2 THEN
        ultimo_custo := custos_historicos[array_length(custos_historicos, 1)];
        penultimo_custo := custos_historicos[array_length(custos_historicos, 1) - 1];
        tendencia := (ultimo_custo - penultimo_custo) * 0.5; -- Suavizar a tendência
    END IF;
    
    -- Gerar previsões para os próximos 12 meses
    FOR i IN 1..12 LOOP
        -- Aplicar tendência gradualmente (diminuindo ao longo do tempo)
        valor_previsto := media_movel + (tendencia * i * 0.8); -- 0.8 para suavizar
        
        -- Adicionar variação para simular intervalos de confiança
        INSERT INTO resultados_preditivos (
            modelo_id,
            data_previsao,
            tipo_previsao,
            valor_previsto,
            intervalo_confianca_min,
            intervalo_confianca_max
        )
        VALUES (
            v_modelo_id,
            data_atual + (i || ' months')::interval,
            'Custo',
            valor_previsto,
            valor_previsto * 0.85, -- -15% para intervalo mínimo
            valor_previsto * 1.15   -- +15% para intervalo máximo
        );
    END LOOP;
    
    RAISE NOTICE 'Previsões de custo geradas com sucesso para os próximos 12 meses';
END;
$$;

-- Criar função para executar atualização de previsões (pode ser chamada pela interface)
CREATE OR REPLACE FUNCTION public.atualizar_previsoes_custos()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    resultado json;
BEGIN
    -- Executar cálculo de previsões
    PERFORM public.calcular_previsao_custos();
    
    -- Retornar resultado
    resultado := json_build_object(
        'sucesso', true,
        'mensagem', 'Previsões de custo atualizadas com sucesso',
        'data_atualizacao', NOW()
    );
    
    RETURN resultado;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'sucesso', false,
        'mensagem', 'Erro ao atualizar previsões: ' || SQLERRM,
        'data_atualizacao', NOW()
    );
END;
$$;

-- Executar uma primeira geração de previsões
SELECT public.calcular_previsao_custos();
