-- EXPERIENCE MESTRES DA TATTOO — Fases 2 e 3
-- Rode DEPOIS do tattooweek_setup.sql, no SQL Editor do Supabase. Pode rodar mais de uma vez.
-- Não apaga dados: tudo o que já existe passa a pertencer à campanha 'tattooweek-2026'.
--   • tw_campaigns  → cada convenção vira uma campanha (identidade, datas, parceiros, prêmios)
--   • tw_partners   → parceiros cadastráveis pelo painel
--   • tw_enrollments → inscrição de cada pessoa em cada campanha (histórico de participações)
--   • perfil de artista no cadastro do participante

-- 1. Campanhas
CREATE TABLE IF NOT EXISTS tw_campaigns (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug text UNIQUE NOT NULL,          -- URL: /experience/<slug> (a 'tattooweek' também responde em /tattooweek)
  name text NOT NULL,                 -- 'Tattoo Week Experience'
  event_name text,                    -- 'Tattoo Week' (usado no vídeo: "Meu Tattoo Week")
  tagline text,
  description text,
  venue text,
  city text,
  hero_image text,
  event_days jsonb DEFAULT '[]',
  day_names jsonb DEFAULT '{"1": "A chegada", "2": "A conexão", "3": "A despedida"}',
  unlock_all boolean DEFAULT false,
  music_url text DEFAULT '',
  partners jsonb DEFAULT '[]',        -- ids de tw_partners
  prize_title text,
  prize_items jsonb DEFAULT '[]',
  status text DEFAULT 'active',       -- 'draft' | 'active' | 'finished'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Parceiros
CREATE TABLE IF NOT EXISTS tw_partners (
  id text PRIMARY KEY,                -- 'bronc', 'stencilflow' ...
  name text NOT NULL,
  color text DEFAULT '#eec358',
  url text,
  role text,
  logo_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO tw_partners (id, name, color, url, role) VALUES
  ('bronc', 'Bronc', '#e4572e', NULL, 'Desafios técnicos e produtos para premiação'),
  ('stencilflow', 'STENCILFLOW', '#00ff80', 'https://stencilflowapp.com.br', 'Desafios criativos e acesso Pro'),
  ('inkauthority', 'Ink Authority', '#7aa2ff', NULL, 'Desafios educativos e aulas'),
  ('mestres', 'Mestres da Tattoo', '#eec358', '/', 'Idealização e realização')
ON CONFLICT (id) DO NOTHING;

-- Campanha atual, herdando datas/música do tw_config
INSERT INTO tw_campaigns (id, slug, name, event_name, tagline, description, venue, city, hero_image, event_days, unlock_all, music_url, partners, prize_title, prize_items)
VALUES (
  'tattooweek-2026', 'tattooweek', 'Tattoo Week Experience', 'Tattoo Week',
  '3 dias. 2 experiências. 1 grande história.',
  'Desafios, descobertas e conexões dentro da maior convenção de tatuagem do mundo. Sem aplicativo: é só abrir no celular e jogar.',
  'Expo Center Norte', 'São Paulo',
  '/cartazes eventos/tattooweek cartaz.jpeg',
  coalesce((SELECT value FROM tw_config WHERE key = 'event_days'), '["2026-11-20", "2026-11-21", "2026-11-22"]'),
  coalesce((SELECT (value)::text::boolean FROM tw_config WHERE key = 'unlock_all'), false),
  coalesce((SELECT value #>> '{}' FROM tw_config WHERE key = 'music_url'), ''),
  '["bronc", "stencilflow", "inkauthority"]',
  'O Kit dos Mestres',
  '["1 produto da Bronc", "1 benefício STENCILFLOW Pro", "1 curso ou acesso especial do Ink Authority", "1 item exclusivo Mestres da Tattoo"]'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Missões, credenciais e métricas passam a pertencer a uma campanha
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE;
ALTER TABLE tw_artists ADD COLUMN IF NOT EXISTS campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE;
ALTER TABLE tw_events ADD COLUMN IF NOT EXISTS campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE;
UPDATE tw_missions SET campaign_id = 'tattooweek-2026' WHERE campaign_id IS NULL;
UPDATE tw_artists SET campaign_id = 'tattooweek-2026' WHERE campaign_id IS NULL;
UPDATE tw_events SET campaign_id = 'tattooweek-2026' WHERE campaign_id IS NULL;

-- O mesmo slug (artista-01) pode existir em campanhas diferentes
ALTER TABLE tw_artists DROP CONSTRAINT IF EXISTS tw_artists_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS tw_artists_campaign_slug ON tw_artists (campaign_id, slug);

-- 4. Inscrições por campanha (histórico)
CREATE TABLE IF NOT EXISTS tw_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid REFERENCES tw_participants(id) ON DELETE CASCADE,
  campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE,
  track text NOT NULL,                -- 'public' | 'artist'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (participant_id, campaign_id, track)
);

INSERT INTO tw_enrollments (participant_id, campaign_id, track, created_at)
SELECT id, 'tattooweek-2026', 'public', created_at FROM tw_participants WHERE in_public
ON CONFLICT DO NOTHING;
INSERT INTO tw_enrollments (participant_id, campaign_id, track, created_at)
SELECT id, 'tattooweek-2026', 'artist', created_at FROM tw_participants WHERE in_challenge
ON CONFLICT DO NOTHING;

-- 5. Perfil de artista
ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS styles text;
ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS studio text;

-- 6. Ranking por campanha
DROP VIEW IF EXISTS tw_ranking;
CREATE VIEW tw_ranking AS
WITH approved AS (
  SELECT s.participant_id, s.points, s.created_at, m.track, m.day, m.category, m.campaign_id
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved'
),
day_totals AS (
  SELECT campaign_id, day, count(*) AS total FROM tw_missions
  WHERE track = 'public' AND category = 'dia' AND active AND day IS NOT NULL
  GROUP BY campaign_id, day
),
day_done AS (
  SELECT participant_id, campaign_id, day, count(*) AS done FROM approved
  WHERE track = 'public' AND category = 'dia'
  GROUP BY participant_id, campaign_id, day
),
bonus AS (
  SELECT d.participant_id, d.campaign_id, count(*) * 50 AS pts
  FROM day_done d JOIN day_totals t ON t.campaign_id = d.campaign_id AND t.day = d.day
  WHERE d.done >= t.total
  GROUP BY d.participant_id, d.campaign_id
)
SELECT
  a.campaign_id, p.id AS participant_id, p.name, p.instagram, p.city, p.photo_url, a.track,
  sum(a.points) + CASE WHEN a.track = 'public' THEN coalesce(max(b.pts), 0) ELSE 0 END AS points,
  count(*) AS missions_done,
  max(a.created_at) AS last_at
FROM approved a
JOIN tw_participants p ON p.id = a.participant_id
LEFT JOIN bonus b ON b.participant_id = a.participant_id AND b.campaign_id = a.campaign_id
WHERE p.show_in_ranking
GROUP BY a.campaign_id, p.id, p.name, p.instagram, p.city, p.photo_url, a.track;

-- 7. Permissões (mesmo modelo das outras tabelas tw_)
ALTER TABLE tw_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tw_campaigns all" ON tw_campaigns;
DROP POLICY IF EXISTS "tw_partners all" ON tw_partners;
DROP POLICY IF EXISTS "tw_enrollments all" ON tw_enrollments;
CREATE POLICY "tw_campaigns all" ON tw_campaigns FOR ALL USING (true);
CREATE POLICY "tw_partners all" ON tw_partners FOR ALL USING (true);
CREATE POLICY "tw_enrollments all" ON tw_enrollments FOR ALL USING (true);
