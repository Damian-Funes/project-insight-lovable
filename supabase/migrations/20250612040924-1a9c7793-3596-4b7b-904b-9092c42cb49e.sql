
-- Criar função para detectar anomalias em registros de atividades e receitas
CREATE OR REPLACE FUNCTION public.detectar_anomalias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_modelo_id UUID;
    media_horas NUMERIC;
    desvio_horas NUMERIC;
    limiar_superior_horas NUMERIC;
    limiar_inferior_horas NUMERIC;
    media_receita NUMERIC;
    desvio_receita NUMERIC;
    limiar_inferior_receita NUMERIC;
    anomalia_record RECORD;
    detalhes TEXT;
BEGIN
    -- Buscar ou criar modelo de detecção de anomalias
    SELECT id INTO v_modelo_id
    FROM modelos_preditivos
    WHERE nome_modelo = 'Detecção de Anomalias - Atividades e Receitas'
    AND tipo_modelo = 'Detecção de Anomalias';
    
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
            'Detecção de Anomalias - Atividades e Receitas',
            'Modelo para detectar anomalias em horas trabalhadas e receitas usando desvio padrão',
            'Detecção de Anomalias',
            'Ativo',
            NOW(),
            '{"metodo": "desvio_padrao", "multiplicador": 2, "janela_analise": 90}'::jsonb
        )
        RETURNING id INTO v_modelo_id;
    ELSE
        -- Atualizar data de treinamento
        UPDATE modelos_preditivos
        SET data_treinamento = NOW(),
            status_modelo = 'Ativo'
        WHERE id = v_modelo_id;
    END IF;
    
    -- Limpar anomalias antigas (últimos 7 dias) para evitar duplicatas
    DELETE FROM resultados_preditivos
    WHERE modelo_id = v_modelo_id
    AND tipo_previsao = 'Anomalia'
    AND data_previsao >= CURRENT_DATE - INTERVAL '7 days';
    
    -- DETECÇÃO DE ANOMALIAS EM HORAS TRABALHADAS
    -- Calcular estatísticas das horas trabalhadas dos últimos 90 dias
    SELECT 
        AVG(horas_gastas), 
        STDDEV(horas_gastas)
    INTO media_horas, desvio_horas
    FROM registros_atividades
    WHERE data_registro >= CURRENT_DATE - INTERVAL '90 days';
    
    -- Definir limiares (2 desvios padrão)
    IF desvio_horas IS NOT NULL AND desvio_horas > 0 THEN
        limiar_superior_horas := media_horas + (2 * desvio_horas);
        limiar_inferior_horas := GREATEST(0, media_horas - (2 * desvio_horas));
        
        -- Detectar anomalias de horas excessivas ou insuficientes (últimos 7 dias)
        FOR anomalia_record IN
            SELECT 
                ra.id,
                ra.data_registro,
                ra.horas_gastas,
                p.nome_projeto,
                ap.nome_area,
                prof.nome_completo as responsavel
            FROM registros_atividades ra
            JOIN projetos p ON ra.projeto_id = p.id
            JOIN areas_produtivas ap ON ra.area_id = ap.id
            JOIN profiles prof ON ra.responsavel_id = prof.id
            WHERE ra.data_registro >= CURRENT_DATE - INTERVAL '7 days'
            AND (ra.horas_gastas > limiar_superior_horas OR ra.horas_gastas < limiar_inferior_horas)
        LOOP
            -- Criar descrição da anomalia
            IF anomalia_record.horas_gastas > limiar_superior_horas THEN
                detalhes := format(
                    'Horas excessivas detectadas: %s horas registradas por %s no projeto "%s" (área: %s) em %s. Média esperada: %.2f horas (±%.2f)',
                    anomalia_record.horas_gastas,
                    anomalia_record.responsavel,
                    anomalia_record.nome_projeto,
                    anomalia_record.nome_area,
                    anomalia_record.data_registro,
                    media_horas,
                    desvio_horas
                );
            ELSE
                detalhes := format(
                    'Horas insuficientes detectadas: %s horas registradas por %s no projeto "%s" (área: %s) em %s. Média esperada: %.2f horas (±%.2f)',
                    anomalia_record.horas_gastas,
                    anomalia_record.responsavel,
                    anomalia_record.nome_projeto,
                    anomalia_record.nome_area,
                    anomalia_record.data_registro,
                    media_horas,
                    desvio_horas
                );
            END IF;
            
            -- Inserir anomalia
            INSERT INTO resultados_preditivos (
                modelo_id,
                data_previsao,
                tipo_previsao,
                detalhes_anomalia
            ) VALUES (
                v_modelo_id,
                anomalia_record.data_registro,
                'Anomalia',
                detalhes
            );
        END LOOP;
    END IF;
    
    -- DETECÇÃO DE ANOMALIAS EM RECEITAS
    -- Calcular estatísticas das receitas dos últimos 90 dias
    SELECT 
        AVG(valor_receita), 
        STDDEV(valor_receita)
    INTO media_receita, desvio_receita
    FROM receitas
    WHERE data_receita >= CURRENT_DATE - INTERVAL '90 days';
    
    -- Definir limiar inferior para receitas (2 desvios padrão abaixo da média)
    IF desvio_receita IS NOT NULL AND desvio_receita > 0 THEN
        limiar_inferior_receita := GREATEST(0, media_receita - (2 * desvio_receita));
        
        -- Detectar receitas anormalmente baixas (últimos 7 dias)
        FOR anomalia_record IN
            SELECT 
                r.id,
                r.data_receita,
                r.valor_receita,
                p.nome_projeto,
                r.descricao_receita
            FROM receitas r
            JOIN projetos p ON r.projeto_id = p.id
            WHERE r.data_receita >= CURRENT_DATE - INTERVAL '7 days'
            AND r.valor_receita < limiar_inferior_receita
        LOOP
            -- Criar descrição da anomalia
            detalhes := format(
                'Receita anormalmente baixa detectada: R$ %.2f para o projeto "%s" em %s. Média esperada: R$ %.2f (±%.2f). %s',
                anomalia_record.valor_receita,
                anomalia_record.nome_projeto,
                anomalia_record.data_receita,
                media_receita,
                desvio_receita,
                COALESCE('Descrição: ' || anomalia_record.descricao_receita, '')
            );
            
            -- Inserir anomalia
            INSERT INTO resultados_preditivos (
                modelo_id,
                data_previsao,
                tipo_previsao,
                detalhes_anomalia
            ) VALUES (
                v_modelo_id,
                anomalia_record.data_receita,
                'Anomalia',
                detalhes
            );
        END LOOP;
    END IF;
    
    -- DETECÇÃO DE PROJETOS SEM ATIVIDADE RECENTE
    FOR anomalia_record IN
        SELECT 
            p.id,
            p.nome_projeto,
            p.status_projeto,
            MAX(ra.data_registro) as ultima_atividade
        FROM projetos p
        LEFT JOIN registros_atividades ra ON p.id = ra.projeto_id
        WHERE p.status_projeto = 'Ativo'
        GROUP BY p.id, p.nome_projeto, p.status_projeto
        HAVING MAX(ra.data_registro) < CURRENT_DATE - INTERVAL '14 days' 
        OR MAX(ra.data_registro) IS NULL
    LOOP
        -- Criar descrição da anomalia
        IF anomalia_record.ultima_atividade IS NULL THEN
            detalhes := format(
                'Projeto sem atividades: O projeto "%s" está marcado como ativo mas nunca teve atividades registradas.',
                anomalia_record.nome_projeto
            );
        ELSE
            detalhes := format(
                'Projeto inativo: O projeto "%s" está marcado como ativo mas não tem atividades há %s dias (última atividade: %s).',
                anomalia_record.nome_projeto,
                CURRENT_DATE - anomalia_record.ultima_atividade,
                anomalia_record.ultima_atividade
            );
        END IF;
        
        -- Inserir anomalia
        INSERT INTO resultados_preditivos (
            modelo_id,
            data_previsao,
            tipo_previsao,
            detalhes_anomalia
        ) VALUES (
            v_modelo_id,
            CURRENT_DATE,
            'Anomalia',
            detalhes
        );
    END LOOP;
    
    RAISE NOTICE 'Detecção de anomalias executada com sucesso';
END;
$$;

-- Criar função para executar detecção de anomalias (pode ser chamada pela interface)
CREATE OR REPLACE FUNCTION public.executar_deteccao_anomalias()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    resultado json;
    total_anomalias INTEGER;
BEGIN
    -- Executar detecção de anomalias
    PERFORM public.detectar_anomalias();
    
    -- Contar anomalias detectadas nos últimos 7 dias
    SELECT COUNT(*)
    INTO total_anomalias
    FROM resultados_preditivos rp
    JOIN modelos_preditivos mp ON rp.modelo_id = mp.id
    WHERE mp.tipo_modelo = 'Detecção de Anomalias'
    AND rp.tipo_previsao = 'Anomalia'
    AND rp.data_previsao >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Retornar resultado
    resultado := json_build_object(
        'sucesso', true,
        'mensagem', format('Detecção de anomalias executada com sucesso. %s anomalias detectadas nos últimos 7 dias.', total_anomalias),
        'total_anomalias', total_anomalias,
        'data_execucao', NOW()
    );
    
    RETURN resultado;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'sucesso', false,
        'mensagem', 'Erro ao executar detecção de anomalias: ' || SQLERRM,
        'data_execucao', NOW()
    );
END;
$$;

-- Executar uma primeira detecção de anomalias
SELECT public.detectar_anomalias();
