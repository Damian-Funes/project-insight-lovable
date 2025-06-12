
-- Criar função para verificar e gerar alertas de OPs baseados em datas e lead times
CREATE OR REPLACE FUNCTION public.check_op_deadline_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    area_info RECORD;
    projeto_nome TEXT;
    alerta_config RECORD;
    destinatario_id UUID;
    mensagem_final TEXT;
    dias_diferenca INTEGER;
    lead_time_dias INTEGER;
    alert_type TEXT;
BEGIN
    -- Buscar informações da área responsável
    SELECT ap.id, ap.nome_area
    INTO area_info
    FROM areas_produtivas ap
    WHERE ap.id = NEW.area_responsavel_id;
    
    -- Buscar nome do projeto
    SELECT p.nome_projeto
    INTO projeto_nome
    FROM projetos p
    WHERE p.id = NEW.projeto_id;
    
    -- Determinar o lead time baseado no nome da área
    IF area_info.nome_area ILIKE '%almoxarifado%' AND area_info.nome_area ILIKE '%componentes%' THEN
        lead_time_dias := 3;
        alert_type := 'Prazo Próximo';
    ELSIF area_info.nome_area ILIKE '%almoxarifado%' AND area_info.nome_area ILIKE '%pintadas%' THEN
        lead_time_dias := 2;
        alert_type := 'Prazo Próximo';
    ELSE
        -- Produção/Montagem e outras áreas
        lead_time_dias := 0; -- hoje
        alert_type := 'Prazo Próximo';
    END IF;
    
    -- Calcular diferença de dias
    dias_diferenca := NEW.data_inicio_prevista - CURRENT_DATE;
    
    -- Verificar se deve gerar alerta por proximidade do prazo
    IF dias_diferenca <= lead_time_dias AND NEW.status_op = 'Pendente' THEN
        -- Buscar configuração de alerta ativo para prazo próximo
        SELECT ac.id, ac.mensagem_alerta, ac.destinatarios
        INTO alerta_config
        FROM alertas_config ac
        WHERE ac.tipo_alerta = 'Prazo Próximo'
        AND ac.ativo = true
        LIMIT 1;
        
        IF alerta_config IS NOT NULL THEN
            -- Verificar se já existe notificação para esta OP nas últimas 24 horas
            IF NOT EXISTS (
                SELECT 1 FROM notificacoes n
                WHERE n.alerta_id = alerta_config.id
                AND n.contexto_id = NEW.id
                AND n.data_notificacao > NOW() - INTERVAL '24 hours'
            ) THEN
                -- Gerar mensagem dinâmica
                mensagem_final := COALESCE(
                    alerta_config.mensagem_alerta,
                    'OP [Numero_OP] do projeto [Projeto] tem início previsto em [Dias] dias.'
                );
                
                mensagem_final := REPLACE(mensagem_final, '[Numero_OP]', NEW.numero_op);
                mensagem_final := REPLACE(mensagem_final, '[Projeto]', projeto_nome);
                mensagem_final := REPLACE(mensagem_final, '[Dias]', CASE 
                    WHEN dias_diferenca = 0 THEN 'HOJE'
                    WHEN dias_diferenca = 1 THEN '1 dia'
                    ELSE dias_diferenca::text || ' dias'
                END);
                
                -- Criar notificações para destinatários da área
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
                            NEW.id
                        );
                    EXCEPTION WHEN OTHERS THEN
                        CONTINUE;
                    END;
                END LOOP;
            END IF;
        END IF;
    END IF;
    
    -- Verificar alertas de atraso
    IF (NEW.status_op = 'Em Andamento' AND NEW.data_fim_prevista < CURRENT_DATE) OR
       (NEW.status_op = 'Pendente' AND NEW.data_inicio_prevista < CURRENT_DATE) THEN
        
        -- Buscar configuração de alerta ativo para outros tipos
        SELECT ac.id, ac.mensagem_alerta, ac.destinatarios
        INTO alerta_config
        FROM alertas_config ac
        WHERE ac.tipo_alerta = 'Outros'
        AND ac.ativo = true
        LIMIT 1;
        
        IF alerta_config IS NOT NULL THEN
            -- Verificar se já existe notificação para esta OP nas últimas 24 horas
            IF NOT EXISTS (
                SELECT 1 FROM notificacoes n
                WHERE n.alerta_id = alerta_config.id
                AND n.contexto_id = NEW.id
                AND n.mensagem LIKE '%ATRASADA%'
                AND n.data_notificacao > NOW() - INTERVAL '24 hours'
            ) THEN
                -- Gerar mensagem de atraso
                IF NEW.status_op = 'Em Andamento' THEN
                    mensagem_final := 'OP ATRASADA: ' || NEW.numero_op || ' do projeto ' || projeto_nome || 
                                    ' estava prevista para terminar em ' || TO_CHAR(NEW.data_fim_prevista, 'DD/MM/YYYY') || 
                                    ' mas ainda está em andamento.';
                ELSE
                    mensagem_final := 'OP ATRASADA: ' || NEW.numero_op || ' do projeto ' || projeto_nome || 
                                    ' deveria ter iniciado em ' || TO_CHAR(NEW.data_inicio_prevista, 'DD/MM/YYYY') || 
                                    ' mas ainda está pendente.';
                END IF;
                
                -- Criar notificações para destinatários
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
                            NEW.id
                        );
                    EXCEPTION WHEN OTHERS THEN
                        CONTINUE;
                    END;
                END LOOP;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Criar trigger para verificar alertas quando OPs são inseridas ou atualizadas
DROP TRIGGER IF EXISTS trigger_op_deadline_alerts ON ordem_producao;
CREATE TRIGGER trigger_op_deadline_alerts
    AFTER INSERT OR UPDATE ON ordem_producao
    FOR EACH ROW
    EXECUTE FUNCTION public.check_op_deadline_alerts();

-- Criar função para verificar alertas de OPs existentes (execução manual/agendada)
CREATE OR REPLACE FUNCTION public.check_existing_op_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    op_record RECORD;
BEGIN
    -- Verificar todas as OPs ativas para alertas de prazo
    FOR op_record IN
        SELECT op.*, ap.nome_area, p.nome_projeto
        FROM ordem_producao op
        JOIN areas_produtivas ap ON op.area_responsavel_id = ap.id
        JOIN projetos p ON op.projeto_id = p.id
        WHERE op.status_op IN ('Pendente', 'Em Andamento')
    LOOP
        -- Executar a mesma lógica do trigger
        PERFORM public.check_op_deadline_alerts() FROM (
            SELECT op_record.id, op_record.numero_op, op_record.projeto_id, 
                   op_record.area_responsavel_id, op_record.data_inicio_prevista,
                   op_record.data_fim_prevista, op_record.status_op
        ) AS NEW;
    END LOOP;
END;
$$;

-- Inserir alertas de exemplo se não existirem
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Pegar o primeiro usuário disponível
    SELECT id INTO first_user_id FROM profiles LIMIT 1;
    
    -- Inserir alerta de prazo próximo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM alertas_config 
        WHERE tipo_alerta = 'Prazo Próximo'
    ) AND first_user_id IS NOT NULL THEN
        INSERT INTO alertas_config (nome_alerta, tipo_alerta, condicao, mensagem_alerta, destinatarios, ativo)
        VALUES (
            'Alerta de Prazo Próximo OP',
            'Prazo Próximo',
            'lead_time_area',
            'OP [Numero_OP] do projeto [Projeto] tem início previsto em [Dias] dias.',
            first_user_id::text,
            true
        );
    END IF;
    
    -- Inserir alerta de atraso se não existir
    IF NOT EXISTS (
        SELECT 1 FROM alertas_config 
        WHERE tipo_alerta = 'Outros' AND nome_alerta LIKE '%Atraso%'
    ) AND first_user_id IS NOT NULL THEN
        INSERT INTO alertas_config (nome_alerta, tipo_alerta, condicao, mensagem_alerta, destinatarios, ativo)
        VALUES (
            'Alerta de OP Atrasada',
            'Outros',
            'data_passed',
            'OP atrasada detectada.',
            first_user_id::text,
            true
        );
    END IF;
END;
$$;
