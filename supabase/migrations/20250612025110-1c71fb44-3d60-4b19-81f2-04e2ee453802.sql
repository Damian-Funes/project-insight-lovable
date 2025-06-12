
-- Criar enum para os papéis dos usuários (se não existir)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'lider_area', 'funcionario');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Adicionar colunas necessárias à tabela profiles existente
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nome_completo TEXT,
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'lider_area',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Atualizar registros existentes que não têm nome_completo
UPDATE public.profiles 
SET nome_completo = COALESCE(nome, 'Usuário')
WHERE nome_completo IS NULL;

-- Tornar nome_completo obrigatório após atualizar registros existentes
ALTER TABLE public.profiles 
ALTER COLUMN nome_completo SET NOT NULL;

-- Atualizar a função handle_new_user para trabalhar com a nova estrutura
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome_completo', new.raw_user_meta_data->>'full_name', 'Usuário'),
    new.email,
    'lider_area'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
