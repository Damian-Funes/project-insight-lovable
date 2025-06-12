
-- Criar tabela Receitas
CREATE TABLE public.receitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_receita DATE NOT NULL,
  valor_receita DECIMAL(15,2) NOT NULL,
  projeto_id UUID NOT NULL,
  descricao_receita TEXT,
  tipo_receita TEXT CHECK (tipo_receita IN ('Venda de Serviço', 'Venda de Produto', 'Outros')),
  cliente_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraint de chave estrangeira para projetos
  CONSTRAINT fk_receitas_projeto FOREIGN KEY (projeto_id) REFERENCES public.projetos(id) ON DELETE CASCADE
);

-- Criar índice para melhorar performance das consultas por projeto
CREATE INDEX idx_receitas_projeto_id ON public.receitas(projeto_id);

-- Criar índice para consultas por data
CREATE INDEX idx_receitas_data ON public.receitas(data_receita);

-- Adicionar comentários para documentação
COMMENT ON TABLE public.receitas IS 'Tabela para registrar receitas dos projetos';
COMMENT ON COLUMN public.receitas.valor_receita IS 'Valor da receita em formato decimal (15,2)';
COMMENT ON COLUMN public.receitas.tipo_receita IS 'Tipo da receita: Venda de Serviço, Venda de Produto, ou Outros';
COMMENT ON COLUMN public.receitas.cliente_id IS 'Referência para futura tabela de clientes (pode ser nulo)';
