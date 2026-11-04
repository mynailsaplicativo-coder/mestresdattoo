-- TATTOO WEEK EXPERIENCE — Uma realização Mestres da Tattoo
-- Rode este código na aba "SQL Editor" do painel do Supabase (uma vez, antes do evento).
-- Cria tabelas, ranking, bucket de fotos/vídeos, 30 missões do público,
-- missões do Artist Challenge e as 20 credenciais NFC (artista-01 ... artista-20).

-- 1. Configuração da campanha (datas, liberação dos dias, trilha do vídeo)
CREATE TABLE IF NOT EXISTS tw_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL
);

-- 2. Participantes (público e tatuadores usam o mesmo cadastro)
CREATE TABLE IF NOT EXISTS tw_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  instagram text,
  city text,
  in_public boolean DEFAULT true,       -- participa do Meu Tattoo Week
  in_challenge boolean DEFAULT false,   -- participa do Artist Challenge (tatuadores)
  show_in_ranking boolean DEFAULT true, -- participação privada = false
  consent_media boolean DEFAULT false,  -- autorizou uso das imagens para gerar o vídeo
  consent_marketing boolean DEFAULT false, -- autorizou divulgação pelo Mestres/parceiros
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Missões (público e Artist Challenge)
CREATE TABLE IF NOT EXISTS tw_missions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  track text NOT NULL,              -- 'public' | 'artist'
  day int,                          -- 1, 2, 3 (público) ou null
  position int DEFAULT 0,
  category text DEFAULT 'dia',      -- 'dia' | 'networking' | 'conteudo' | 'parceiros' | 'passaporte' | 'surpresa' | 'secreta'
  partner text,                     -- 'bronc' | 'stencilflow' | 'inkauthority' | 'mestres'
  title text NOT NULL,
  description text,
  points int DEFAULT 10,
  media_count int DEFAULT 1,        -- quantos registros a missão exige
  approval text DEFAULT 'auto',     -- 'auto' | 'manual'
  repeatable_per_artist boolean DEFAULT false, -- passaporte NFC: 1 envio por artista
  hidden boolean DEFAULT false,     -- missão secreta: só aparece quando revelada via NFC
  starts_at timestamp with time zone, -- missões surpresa
  ends_at timestamp with time zone,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Os 20 artistas com credencial NFC
CREATE TABLE IF NOT EXISTS tw_artists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,        -- usado na URL gravada no adesivo: /tattooweek/nfc/artista-01
  name text NOT NULL,
  instagram text,
  photo_url text,
  city text,
  country text,
  styles text,
  bio text,
  mission_text text,                -- desafio ligado a este artista
  reveals_mission_id text REFERENCES tw_missions(id) ON DELETE SET NULL, -- missão secreta revelada ao ler a credencial
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Envios (comprovação das missões)
CREATE TABLE IF NOT EXISTS tw_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid REFERENCES tw_participants(id) ON DELETE CASCADE,
  mission_id text REFERENCES tw_missions(id) ON DELETE CASCADE,
  artist_id uuid REFERENCES tw_artists(id) ON DELETE SET NULL,
  media jsonb NOT NULL DEFAULT '[]', -- [{ url, path, type: 'image' | 'video' }]
  note text,
  status text DEFAULT 'pending',     -- 'pending' | 'approved' | 'rejected'
  points int DEFAULT 0,
  reviewer_note text,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS tw_submissions_unique
  ON tw_submissions (participant_id, mission_id, coalesce(artist_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 6. Métricas (leituras NFC/QR, cliques nos parceiros, vídeos gerados/compartilhados)
CREATE TABLE IF NOT EXISTS tw_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,               -- 'nfc_scan' | 'qr_scan' | 'partner_click' | 'video_generated' | 'video_shared'
  ref text,                         -- slug do artista, nome do parceiro etc.
  participant_id uuid REFERENCES tw_participants(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Ranking (só envios aprovados; bônus de 50 pts por dia completo no público)
CREATE OR REPLACE VIEW tw_ranking AS
WITH approved AS (
  SELECT s.participant_id, s.points, s.created_at, m.track, m.day
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved'
),
day_totals AS (
  SELECT day, count(*) AS total FROM tw_missions
  WHERE track = 'public' AND category = 'dia' AND active AND day IS NOT NULL
  GROUP BY day
),
day_done AS (
  SELECT s.participant_id, m.day, count(*) AS done
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved' AND m.track = 'public' AND m.category = 'dia'
  GROUP BY s.participant_id, m.day
),
bonus AS (
  SELECT d.participant_id, count(*) * 50 AS pts
  FROM day_done d JOIN day_totals t ON t.day = d.day
  WHERE d.done >= t.total
  GROUP BY d.participant_id
)
SELECT
  p.id AS participant_id, p.name, p.instagram, p.city, a.track,
  sum(a.points) + CASE WHEN a.track = 'public' THEN coalesce(max(b.pts), 0) ELSE 0 END AS points,
  count(*) AS missions_done,
  max(a.created_at) AS last_at
FROM approved a
JOIN tw_participants p ON p.id = a.participant_id
LEFT JOIN bonus b ON b.participant_id = a.participant_id
WHERE p.show_in_ranking
GROUP BY p.id, p.name, p.instagram, p.city, a.track;

-- Habilitar RLS (mesmo modelo do Guest Hub: o frontend gerencia a autenticação via Clerk)
ALTER TABLE tw_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tw_config all" ON tw_config FOR ALL USING (true);
CREATE POLICY "tw_participants all" ON tw_participants FOR ALL USING (true);
CREATE POLICY "tw_missions all" ON tw_missions FOR ALL USING (true);
CREATE POLICY "tw_artists all" ON tw_artists FOR ALL USING (true);
CREATE POLICY "tw_submissions all" ON tw_submissions FOR ALL USING (true);
CREATE POLICY "tw_events all" ON tw_events FOR ALL USING (true);

-- 8. Bucket público para fotos e vídeos das missões
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('tattooweek', 'tattooweek', true, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "tattooweek read" ON storage.objects FOR SELECT USING (bucket_id = 'tattooweek');
CREATE POLICY "tattooweek upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tattooweek');
CREATE POLICY "tattooweek delete" ON storage.objects FOR DELETE USING (bucket_id = 'tattooweek');

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

INSERT INTO tw_config (key, value) VALUES
  ('event_days', '["2026-11-20", "2026-11-21", "2026-11-22"]'),
  ('unlock_all', 'false'),
  ('music_url', '""')
ON CONFLICT (key) DO NOTHING;

-- Público — Dia 1: A chegada
INSERT INTO tw_missions (id, track, day, position, title, points, media_count) VALUES
  ('p1-01', 'public', 1, 1, 'Mostre você chegando ao evento', 10, 1),
  ('p1-02', 'public', 1, 2, 'Mostre seu primeiro encontro', 10, 1),
  ('p1-03', 'public', 1, 3, 'Conheça um stand diferente', 10, 1),
  ('p1-04', 'public', 1, 4, 'Mostre você comendo', 20, 3),
  ('p1-05', 'public', 1, 5, 'Encontre uma tatuagem que chamou sua atenção', 10, 1),
  ('p1-06', 'public', 1, 6, 'Mostre um momento de perrengue', 10, 1),
  ('p1-07', 'public', 1, 7, 'Faça uma foto com alguém que acabou de conhecer', 10, 1),
  ('p1-08', 'public', 1, 8, 'Mostre três lugares que você visitou', 20, 3),
  ('p1-09', 'public', 1, 9, 'Registre um momento inesperado', 10, 1),
  ('p1-10', 'public', 1, 10, 'Mostre como terminou seu primeiro dia', 10, 1)
ON CONFLICT (id) DO NOTHING;

-- Público — Dia 2: A conexão
INSERT INTO tw_missions (id, track, day, position, title, description, points, media_count) VALUES
  ('p2-01', 'public', 2, 1, 'Mostre seu look do dia', NULL, 10, 1),
  ('p2-02', 'public', 2, 2, 'Encontre alguém que conheceu ontem', NULL, 10, 1),
  ('p2-03', 'public', 2, 3, 'Visite três stands diferentes', NULL, 20, 3),
  ('p2-04', 'public', 2, 4, 'Mostre um equipamento interessante', NULL, 10, 1),
  ('p2-05', 'public', 2, 5, 'Mostre uma tatuagem que gostaria de fazer', NULL, 10, 1),
  ('p2-06', 'public', 2, 6, 'Registre você no show do Matuê', 'Depende da programação confirmada do evento.', 10, 1),
  ('p2-07', 'public', 2, 7, 'Faça uma nova amizade', NULL, 10, 1),
  ('p2-08', 'public', 2, 8, 'Mostre um artista trabalhando', NULL, 10, 1),
  ('p2-09', 'public', 2, 9, 'Registre três momentos engraçados', NULL, 20, 3),
  ('p2-10', 'public', 2, 10, 'Escolha o melhor momento do dia', NULL, 10, 1)
ON CONFLICT (id) DO NOTHING;

-- Público — Dia 3: A despedida
INSERT INTO tw_missions (id, track, day, position, title, points, media_count) VALUES
  ('p3-01', 'public', 3, 1, 'Mostre sua chegada no último dia', 10, 1),
  ('p3-02', 'public', 3, 2, 'Encontre alguém que marcou sua experiência', 10, 1),
  ('p3-03', 'public', 3, 3, 'Mostre seu stand favorito', 10, 1),
  ('p3-04', 'public', 3, 4, 'Registre três coisas que vai levar dessa experiência', 20, 3),
  ('p3-05', 'public', 3, 5, 'Mostre uma tatuagem que você não vai esquecer', 10, 1),
  ('p3-06', 'public', 3, 6, 'Mostre uma nova amizade', 10, 1),
  ('p3-07', 'public', 3, 7, 'Registre algo que aprendeu', 10, 1),
  ('p3-08', 'public', 3, 8, 'Mostre três lugares que ainda não tinha visitado', 20, 3),
  ('p3-09', 'public', 3, 9, 'Escolha sua foto favorita da Tattoo Week', 10, 1),
  ('p3-10', 'public', 3, 10, 'Registre sua despedida', 10, 1)
ON CONFLICT (id) DO NOTHING;

-- Artist Challenge (aprovação manual)
INSERT INTO tw_missions (id, track, position, category, partner, title, description, points, media_count, approval, repeatable_per_artist) VALUES
  ('a-net-1', 'artist', 1, 'networking', NULL, 'Tirar foto com um artista de outro estado', 'Informe o nome e o estado do artista.', 20, 1, 'manual', false),
  ('a-net-2', 'artist', 2, 'networking', NULL, 'Encontrar um artista que nunca conheceu', NULL, 20, 1, 'manual', false),
  ('a-net-3', 'artist', 3, 'networking', NULL, 'Reunir três artistas em uma foto', NULL, 30, 1, 'manual', false),
  ('a-net-4', 'artist', 4, 'networking', NULL, 'Encontrar um tatuador com mais de 20 anos de profissão', 'Informe o nome e há quanto tempo ele tatua.', 30, 1, 'manual', false),
  ('a-net-5', 'artist', 5, 'networking', NULL, 'Fazer uma conexão com um artista internacional', NULL, 30, 1, 'manual', false),
  ('a-con-1', 'artist', 6, 'conteudo', NULL, 'Entrevistar um artista por 30 segundos', 'Envie o vídeo da entrevista.', 30, 1, 'manual', false),
  ('a-con-2', 'artist', 7, 'conteudo', NULL, 'Gravar uma dica para tatuadores iniciantes', NULL, 20, 1, 'manual', false),
  ('a-con-3', 'artist', 8, 'conteudo', NULL, 'Descobrir uma história curiosa da convenção', 'Conte a história no campo de observação.', 20, 1, 'manual', false),
  ('a-con-4', 'artist', 9, 'conteudo', NULL, 'Criar um vídeo com três artistas', NULL, 30, 1, 'manual', false),
  ('a-pas-1', 'artist', 10, 'passaporte', NULL, 'Passaporte NFC: registro com um artista credenciado', 'Aproxime o celular da credencial, faça uma foto com o artista e envie. Vale 1 carimbo por artista.', 10, 1, 'manual', true),
  ('a-par-1', 'artist', 11, 'parceiros', 'bronc', 'Completar desafio Bronc', 'Vá até o stand da Bronc e cumpra o desafio do dia.', 30, 1, 'manual', false),
  ('a-par-2', 'artist', 12, 'parceiros', 'stencilflow', 'Realizar desafio criativo STENCILFLOW', 'Crie um stencil no STENCILFLOW e envie o resultado.', 30, 1, 'manual', false),
  ('a-par-3', 'artist', 13, 'parceiros', 'inkauthority', 'Completar desafio Ink Authority', 'Responda o desafio técnico do Ink Authority.', 30, 1, 'manual', false),
  ('a-sec-1', 'artist', 14, 'secreta', 'mestres', 'Missão secreta do Mestres', 'Você encontrou a missão secreta! Grave um vídeo de 15s dizendo qual mestre da tatuagem te inspirou.', 40, 1, 'manual', false)
ON CONFLICT (id) DO NOTHING;
UPDATE tw_missions SET hidden = true WHERE id = 'a-sec-1';

-- 20 credenciais NFC (edite nomes e fotos no painel /tattooweek/admin)
INSERT INTO tw_artists (slug, name)
SELECT 'artista-' || lpad(n::text, 2, '0'), 'Artista ' || lpad(n::text, 2, '0')
FROM generate_series(1, 20) AS n
ON CONFLICT (slug) DO NOTHING;
UPDATE tw_artists SET reveals_mission_id = 'a-sec-1' WHERE slug = 'artista-07';
