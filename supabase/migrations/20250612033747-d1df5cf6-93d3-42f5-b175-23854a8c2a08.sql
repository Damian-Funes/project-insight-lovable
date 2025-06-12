
-- Função para verificar e gerar alertas de orçamento excedido
CREATE OR REPLACE FUNCTION public.check_budget_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    projeto_info RECORD;
    custo_total NUMERIC;
    percentual_gasto NUMERIC;
    alerta_config RECORD;
    destinatario_id UUID;
    mensagem_final TEXT;
    percentual_limite NUMERIC;
BEGIN
    -- Buscar informações do projeto
    SELECT p.id, p.nome_projeto, p.orcamento_total
    INTO projeto_info
    FROM projetos p
    WHERE p.id = NEW.projeto_id;
    
    -- Se o projeto não tem orçamento definido, não há o que verificar
    IF projeto_info.orcamento_total IS NULL OR projeto_info.orcamento_total <= 0 THEN
        RETURN NEW;
    END IF;
    
    -- Calcular custo total atual do projeto
    SELECT COALESCE(SUM(ra.horas_gastas * ap.custo_hora_padrao), 0)
    INTO custo_total
    FROM registros_atividades ra
    JOIN areas_produtivas ap ON ra.area_id = ap.id
    WHERE ra.projeto_id = NEW.projeto_id;
    
    -- Calcular percentual gasto
    percentual_gasto := (custo_total / projeto_info.orcamento_total) * 100;
    
    -- Buscar alertas ativos de orçamento excedido
    FOR alerta_config IN
        SELECT ac.id, ac.condicao, ac.mensagem_alerta, ac.destinatarios
        FROM alertas_config ac
        WHERE ac.tipo_alerta = 'Orçamento Excedido' 
        AND ac.ativo = true
    LOOP
        -- Extrair o percentual limite da condição (assumindo formato como "80" ou "100")
        BEGIN
            percentual_limite := CAST(alerta_config.condicao AS NUMERIC);
        EXCEPTION WHEN OTHERS THEN
            CONTINUE; -- Se não conseguir converter, pula este alerta
        END;
        
        -- Verificar se o percentual foi atingido
        IF percentual_gasto >= percentual_limite THEN
            -- Verificar se já existe uma notificação para este projeto e limite
            -- (evitar alertas duplicados)
            IF NOT EXISTS (
                SELECT 1 FROM notificacoes n
                WHERE n.alerta_id = alerta_config.id
                AND n.contexto_id = projeto_info.id
                AND n.mensagem LIKE '%' || percentual_limite::text || '%'
                AND n.data_notificacao > NOW() - INTERVAL '24 hours'
            ) THEN
                -- Gerar mensagem dinâmica
                mensagem_final := REPLACE(alerta_config.mensagem_alerta, '[Nome do Projeto]', projeto_info.nome_projeto);
                mensagem_final := REPLACE(mensagem_final, '[X]', ROUND(percentual_gasto, 1)::text);
                mensagem_final := REPLACE(mensagem_final, '[Limite]', percentual_limite::text);
                
                -- Criar notificações para cada destinatário
                -- Assumindo que destinatarios contém user_ids separados por vírgula
                FOR destinatario_id IN
                    SELECT CAST(TRIM(unnest(string_to_array(alerta_config.destinatarios, ','))) AS UUID)
                LOOP
                    BEGIN
                        INSERT INTO notificacoes (
                            alerta_id,
                            usuario_id,
                            mensagem,
                            contexto_id
                        ) VALUES (
                            alerta_config.id,
                            destinatario_id,
                            mensagem_final,
                            projeto_info.id
                        );
                    EXCEPTION WHEN OTHERS THEN
                        -- Continua se houver erro com um destinatário específico
                        CONTINUE;
                    END;
                END LOOP;
            END IF;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- Criar trigger para registros de atividades
DROP TRIGGER IF EXISTS trigger_budget_alerts ON registros_atividades;
CREATE TRIGGER trigger_budget_alerts
    AFTER INSERT OR UPDATE ON registros_atividades
    FOR EACH ROW
    EXECUTE FUNCTION public.check_budget_alerts();

-- Inserir alguns alertas de exemplo usando usuários existentes
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Pegar o primeiro usuário disponível
    SELECT id INTO first_user_id FROM profiles LIMIT 1;
    
    -- Inserir alerta de 80% se não existir
    IF NOT EXISTS (
        SELECT 1 FROM alertas_config 
        WHERE tipo_alerta = 'Orçamento Excedido' AND condicao = '80'
    ) AND first_user_id IS NOT NULL THEN
        INSERT INTO alertas_config (nome_alerta, tipo_alerta, condicao, mensagem_alerta, destinatarios, ativo)
        VALUES (
            'Alerta 80% do Orçamento',
            'Orçamento Excedido',
            '80',
            'O projeto [Nome do Projeto] atingiu [X]% do orçamento (limite de [Limite]%).',
            first_user_id::text,
            true
        );
    END IF;
    
    -- Inserir alerta de 100% se não existir
    IF NOT EXISTS (
        SELECT 1 FROM alertas_config 
        WHERE tipo_alerta = 'Orçamento Excedido' AND condicao = '100'
    ) AND first_user_id IS NOT NULL THEN
        INSERT INTO alertas_config (nome_alerta, tipo_alerta, condicao, mensagem_alerta, destinatarios, ativo)
        VALUES (
            'Alerta 100% do Orçamento',
            'Orçamento Excedido',
            '100',
            'ATENÇÃO: O projeto [Nome do Projeto] atingiu [X]% do orçamento, excedendo o limite de [Limite]%!',
            first_user_id::text,
            true
        );
    END IF;
END;
$$;
