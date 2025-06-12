
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  area_id UUID,
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabela Projetos
CREATE TABLE public.projetos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_projeto TEXT NOT NULL UNIQUE,
  descricao_projeto TEXT,
  status_projeto TEXT DEFAULT 'Ativo' CHECK (status_projeto IN ('Ativo', 'Concluído', 'Cancelado')),
  data_inicio DATE,
  data_termino_prevista DATE,
  orcamento_total DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela projetos
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

-- Política para todos os usuários autenticados poderem ver projetos
CREATE POLICY "Authenticated users can view projects" ON public.projetos
  FOR SELECT TO authenticated USING (true);

-- Política para usuários autenticados poderem inserir projetos
CREATE POLICY "Authenticated users can insert projects" ON public.projetos
  FOR INSERT TO authenticated WITH CHECK (true);

-- Política para usuários autenticados poderem atualizar projetos
CREATE POLICY "Authenticated users can update projects" ON public.projetos
  FOR UPDATE TO authenticated USING (true);

-- Tabela AreasProdutivas
CREATE TABLE public.areas_produtivas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_area TEXT NOT NULL UNIQUE,
  descricao_area TEXT,
  custo_hora_padrao DECIMAL(8,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela areas_produtivas
ALTER TABLE public.areas_produtivas ENABLE ROW LEVEL SECURITY;

-- Política para todos os usuários autenticados poderem ver áreas
CREATE POLICY "Authenticated users can view areas" ON public.areas_produtivas
  FOR SELECT TO authenticated USING (true);

-- Política para usuários autenticados poderem inserir áreas
CREATE POLICY "Authenticated users can insert areas" ON public.areas_produtivas
  FOR INSERT TO authenticated WITH CHECK (true);

-- Política para usuários autenticados poderem atualizar áreas
CREATE POLICY "Authenticated users can update areas" ON public.areas_produtivas
  FOR UPDATE TO authenticated USING (true);

-- Atualizar tabela profiles para referenciar area_id
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_area 
FOREIGN KEY (area_id) REFERENCES public.areas_produtivas(id);

-- Tabela RegistrosAtividades
CREATE TABLE public.registros_atividades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_registro DATE NOT NULL,
  projeto_id UUID NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas_produtivas(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  horas_gastas DECIMAL(5,2) NOT NULL,
  descricao_atividade TEXT,
  tipo_atividade TEXT DEFAULT 'Padrão' CHECK (tipo_atividade IN ('Padrão', 'Retrabalho')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela registros_atividades
ALTER TABLE public.registros_atividades ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem todos os registros (necessário para dashboards)
CREATE POLICY "Authenticated users can view all activity records" ON public.registros_atividades
  FOR SELECT TO authenticated USING (true);

-- Política para usuários inserirem apenas seus próprios registros
CREATE POLICY "Users can insert own activity records" ON public.registros_atividades
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = responsavel_id);

-- Política para usuários atualizarem apenas seus próprios registros
CREATE POLICY "Users can update own activity records" ON public.registros_atividades
  FOR UPDATE TO authenticated USING (auth.uid() = responsavel_id);

-- Política para usuários deletarem apenas seus próprios registros
CREATE POLICY "Users can delete own activity records" ON public.registros_atividades
  FOR DELETE TO authenticated USING (auth.uid() = responsavel_id);

-- Inserir algumas áreas produtivas padrão
INSERT INTO public.areas_produtivas (nome_area, descricao_area, custo_hora_padrao) VALUES
('Desenvolvimento', 'Área responsável pelo desenvolvimento de software', 75.00),
('Design', 'Área responsável pelo design e UX/UI', 65.00),
('QA', 'Área de garantia de qualidade e testes', 55.00),
('DevOps', 'Área de infraestrutura e operações', 80.00),
('Gestão de Projetos', 'Área de coordenação e gestão de projetos', 70.00);

-- Inserir alguns projetos exemplo
INSERT INTO public.projetos (nome_projeto, descricao_projeto, status_projeto, data_inicio, data_termino_prevista, orcamento_total) VALUES
('Projeto Alpha', 'Sistema de gestão financeira estratégica', 'Ativo', '2024-01-15', '2024-12-31', 150000.00),
('Projeto Beta', 'Plataforma de dashboard analytics', 'Ativo', '2024-02-01', '2024-08-30', 95000.00),
('Projeto Gamma', 'Sistema de automação de relatórios', 'Ativo', '2024-03-01', '2024-10-15', 120000.00),
('Projeto Delta', 'API de integração com sistemas externos', 'Concluído', '2023-09-01', '2024-02-28', 75000.00);
