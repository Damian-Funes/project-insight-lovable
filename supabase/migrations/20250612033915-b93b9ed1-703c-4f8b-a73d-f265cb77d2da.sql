
-- Função para verificar e gerar alertas de registros pendentes
CREATE OR REPLACE FUNCTION public.check_pending_activity_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    leader_record RECORD;
    alerta_config RECORD;
    mensagem_final TEXT;
    days_threshold INTEGER := 2;
BEGIN
    -- Buscar configuração de alerta ativo para registros pendentes
    SELECT ac.id, ac.condicao, ac.mensagem_alerta
    INTO alerta_config
    FROM alertas_config ac
    WHERE ac.tipo_alerta = 'Registro Pendente' 
    AND ac.ativo = true
    LIMIT 1;
    
    -- Se não há alerta configurado, sair da função
    IF alerta_config IS NULL THEN
        RETURN;
    END IF;
    
    -- Tentar extrair o número de dias da condição (se configurado)
    BEGIN
        IF alerta_config.condicao IS NOT NULL AND alerta_config.condicao != '' THEN
            days_threshold := CAST(alerta_config.condicao AS INTEGER);
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Se não conseguir converter, usar valor padrão de 2 dias
        days_threshold := 2;
    END;
    
    -- Buscar líderes de área que não registraram atividades no período
    FOR leader_record IN
        SELECT p.id, p.nome_completo
        FROM profiles p
        WHERE p.role = 'lider_area'
        AND NOT EXISTS (
            SELECT 1 
            FROM registros_atividades ra
            WHERE ra.responsavel_id = p.id
            AND ra.data_registro >= CURRENT_DATE - INTERVAL '1 day' * days_threshold
        )
    LOOP
        -- Verificar se já existe uma notificação não lida sobre registros pendentes
        -- para este usuário nas últimas 24 horas
        IF NOT EXISTS (
            SELECT 1 FROM notificacoes n
            WHERE n.usuario_id = leader_record.id
            AND n.alerta_id = alerta_config.id
            AND n.lida = false
            AND n.data_notificacao > NOW() - INTERVAL '24 hours'
        ) THEN
            -- Gerar mensagem dinâmica
            mensagem_final := COALESCE(
                alerta_config.mensagem_alerta, 
                'Você tem registros de atividades pendentes. Por favor, atualize suas horas.'
            );
            
            -- Substituir placeholders se existirem
            mensagem_final := REPLACE(mensagem_final, '[Nome]', leader_record.nome_completo);
            mensagem_final := REPLACE(mensagem_final, '[Dias]', days_threshold::text);
            
            -- Criar notificação para o líder
            INSERT INTO notificacoes (
                alerta_id,
                usuario_id,
                mensagem,
                contexto_id
            ) VALUES (
                alerta_config.id,
                leader_record.id,
                mensagem_final,
                leader_record.id -- usar o próprio ID do usuário como contexto
            );
        END IF;
    END LOOP;
END;
$$;

-- Inserir configuração de alerta para registros pendentes se não existir
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Pegar o primeiro usuário disponível
    SELECT id INTO first_user_id FROM profiles LIMIT 1;
    
    -- Inserir alerta de registros pendentes se não existir
    IF NOT EXISTS (
        SELECT 1 FROM alertas_config 
        WHERE tipo_alerta = 'Registro Pendente'
    ) AND first_user_id IS NOT NULL THEN
        INSERT INTO alertas_config (nome_alerta, tipo_alerta, condicao, mensagem_alerta, destinatarios, ativo)
        VALUES (
            'Alerta de Registros Pendentes',
            'Registro Pendente',
            '2',
            'Você tem registros de atividades pendentes há [Dias] dias. Por favor, atualize suas horas.',
            first_user_id::text,
            true
        );
    END IF;
END;
$$;

-- Função para executar verificação no login do usuário
CREATE OR REPLACE FUNCTION public.check_pending_alerts_on_login(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verificar se o usuário é líder de área
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'lider_area'
    ) THEN
        -- Executar verificação de alertas pendentes
        PERFORM public.check_pending_activity_alerts();
    END IF;
END;
$$;
