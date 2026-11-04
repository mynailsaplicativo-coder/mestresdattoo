-- EXPERIENCE MESTRES DA TATTOO — Fase 4: painel admin completo
-- Rode DEPOIS do tattooweek_fase2_3.sql, no SQL Editor do Supabase. Pode rodar mais de uma vez. Não apaga dados.
--   • tw_staff         → equipe (admin / moderador) sem precisar mexer no código
--   • tw_adjustments   → bônus/penalidades manuais, entram no ranking
--   • tw_awards        → premiação: vencedores, código de resgate, entrega
--   • tw_announcements → avisos que aparecem para os participantes
--   • desclassificação de participante e favoritos na galeria

CREATE TABLE IF NOT EXISTS tw_staff (
  email text PRIMARY KEY,
  name text,
  role text NOT NULL DEFAULT 'moderator', -- 'admin' | 'moderator'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
INSERT INTO tw_staff (email, name, role) VALUES ('yurilojavirtual@gmail.com', 'Yuri', 'admin')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS tw_adjustments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid REFERENCES tw_participants(id) ON DELETE CASCADE,
  campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE,
  track text NOT NULL,              -- 'public' | 'artist'
  points int NOT NULL,              -- positivo = bônus, negativo = penalidade
  reason text,
  created_by text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS tw_awards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE,
  position int DEFAULT 0,
  title text NOT NULL,              -- '1º lugar Artist Challenge'
  description text,                 -- o que ganha
  rule text DEFAULT 'manual',       -- 'artist_rank' | 'public_rank' | 'passport' | 'manual'
  rank int DEFAULT 1,               -- posição usada na sugestão automática
  participant_id uuid REFERENCES tw_participants(id) ON DELETE SET NULL,
  redeem_code text,
  status text DEFAULT 'open',       -- 'open' | 'awarded' | 'delivered'
  delivered_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS tw_announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id text REFERENCES tw_campaigns(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text DEFAULT 'info',        -- 'info' | 'urgent'
  link text,
  starts_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  ends_at timestamp with time zone,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS blocked boolean DEFAULT false;
ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS blocked_reason text;
ALTER TABLE tw_submissions ADD COLUMN IF NOT EXISTS favorite boolean DEFAULT false;
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS awards_published boolean DEFAULT false;

-- Premiação padrão da Tattoo Week
INSERT INTO tw_awards (campaign_id, position, title, description, rule, rank)
SELECT 'tattooweek-2026', v.position, v.title, v.description, v.rule, v.rank
FROM (VALUES
  (1, '1º lugar Artist Challenge', 'O Kit dos Mestres', 'artist_rank', 1),
  (2, 'Artista mais conectado', 'Mais carimbos no Passaporte NFC', 'passport', 1),
  (3, 'Melhor conteúdo', 'Escolha da curadoria do Mestres', 'manual', 1)
) AS v(position, title, description, rule, rank)
WHERE EXISTS (SELECT 1 FROM tw_campaigns WHERE id = 'tattooweek-2026')
  AND NOT EXISTS (SELECT 1 FROM tw_awards WHERE campaign_id = 'tattooweek-2026');

-- Ranking: inclui ajustes manuais e exclui desclassificados
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
),
base AS (
  SELECT participant_id, campaign_id, track, sum(points) AS pts, count(*) AS done, max(created_at) AS last_at
  FROM approved GROUP BY participant_id, campaign_id, track
  UNION ALL
  SELECT participant_id, campaign_id, track, sum(points), 0, max(created_at)
  FROM tw_adjustments GROUP BY participant_id, campaign_id, track
),
totals AS (
  SELECT participant_id, campaign_id, track, sum(pts) AS pts, sum(done) AS done, max(last_at) AS last_at
  FROM base GROUP BY participant_id, campaign_id, track
)
SELECT
  t.campaign_id, p.id AS participant_id, p.name, p.instagram, p.city, p.photo_url, t.track,
  (t.pts + CASE WHEN t.track = 'public' THEN coalesce(b.pts, 0) ELSE 0 END)::int AS points,
  t.done::int AS missions_done,
  t.last_at
FROM totals t
JOIN tw_participants p ON p.id = t.participant_id
LEFT JOIN bonus b ON b.participant_id = t.participant_id AND b.campaign_id = t.campaign_id
WHERE p.show_in_ranking AND NOT coalesce(p.blocked, false);

ALTER TABLE tw_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tw_staff all" ON tw_staff;
DROP POLICY IF EXISTS "tw_adjustments all" ON tw_adjustments;
DROP POLICY IF EXISTS "tw_awards all" ON tw_awards;
DROP POLICY IF EXISTS "tw_announcements all" ON tw_announcements;
CREATE POLICY "tw_staff all" ON tw_staff FOR ALL USING (true);
CREATE POLICY "tw_adjustments all" ON tw_adjustments FOR ALL USING (true);
CREATE POLICY "tw_awards all" ON tw_awards FOR ALL USING (true);
CREATE POLICY "tw_announcements all" ON tw_announcements FOR ALL USING (true);

-- Aprovação automática em todas as missões (a equipe recusa depois, se precisar)
ALTER TABLE tw_missions ALTER COLUMN approval SET DEFAULT 'auto';
UPDATE tw_missions SET approval = 'auto' WHERE approval <> 'auto';
-- Libera o que estava "em análise", com os pontos da missão
UPDATE tw_submissions s SET status = 'approved', points = m.points, reviewed_at = now()
FROM tw_missions m
WHERE m.id = s.mission_id AND s.status = 'pending';
