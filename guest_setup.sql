-- Rode este código na aba "SQL Editor" do painel do seu Supabase para criar a Plataforma Guest.

-- 1. Tabela de Perfis de Usuários (Tatuador ou Estúdio)
CREATE TABLE guest_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id text UNIQUE NOT NULL,
  role text NOT NULL, -- 'artist' ou 'studio'
  name text NOT NULL,
  city text,
  country text,
  whatsapp text,
  instagram text,
  bio text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Vagas em Estúdios (Estúdios anunciam)
CREATE TABLE guest_spots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id uuid REFERENCES guest_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_date date,
  end_date date,
  city text,
  country text,
  status text DEFAULT 'open',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Planos de Viagem (Tatuadores anunciam)
CREATE TABLE travel_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES guest_profiles(id) ON DELETE CASCADE,
  destination_city text NOT NULL,
  destination_country text NOT NULL,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;

-- Permissões Públicas de Leitura
CREATE POLICY "Public guest_profiles viewable by everyone" ON guest_profiles FOR SELECT USING (true);
CREATE POLICY "Public guest_spots viewable by everyone" ON guest_spots FOR SELECT USING (true);
CREATE POLICY "Public travel_plans viewable by everyone" ON travel_plans FOR SELECT USING (true);

-- Permissões de Escrita (Anônimo para facilitar MVP com frontend gerenciando a autenticação)
CREATE POLICY "Anon Insert Profiles" ON guest_profiles FOR ALL USING (true);
CREATE POLICY "Anon Insert Guest Spots" ON guest_spots FOR ALL USING (true);
CREATE POLICY "Anon Insert Travel Plans" ON travel_plans FOR ALL USING (true);
