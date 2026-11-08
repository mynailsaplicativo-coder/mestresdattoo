-- DESAFIO DOS MESTRES — Fase 15: nick do jogador (aparece no ranking e no telão no lugar do nome)
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.

ALTER TABLE tw_participants ADD COLUMN IF NOT EXISTS nickname text;
-- cada nick é único (sem diferenciar maiúsculas)
CREATE UNIQUE INDEX IF NOT EXISTS tw_participants_nickname_unique
  ON tw_participants (lower(nickname)) WHERE nickname IS NOT NULL AND nickname <> '';

-- Ranking geral: mostra o nick quando existir
CREATE OR REPLACE VIEW tw_ranking AS
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
  t.campaign_id, p.id AS participant_id, coalesce(nullif(trim(p.nickname), ''), p.name) AS name, p.instagram, p.city, p.photo_url, t.track,
  (t.pts + CASE WHEN t.track = 'public' THEN coalesce(b.pts, 0) ELSE 0 END)::int AS points,
  t.done::int AS missions_done,
  t.last_at
FROM totals t
JOIN tw_participants p ON p.id = t.participant_id
LEFT JOIN bonus b ON b.participant_id = t.participant_id AND b.campaign_id = t.campaign_id
WHERE p.show_in_ranking AND NOT coalesce(p.blocked, false);

-- Ranking do dia (prêmio do dia): mostra o nick quando existir
CREATE OR REPLACE VIEW tw_ranking_daily AS
WITH pts AS (
  SELECT s.participant_id, m.campaign_id, m.track, (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day, s.points, s.created_at
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved'
  UNION ALL
  SELECT participant_id, campaign_id, track, (created_at AT TIME ZONE 'America/Sao_Paulo')::date, points, created_at
  FROM tw_adjustments
)
SELECT
  p.campaign_id, p.track, p.day, pa.id AS participant_id, coalesce(nullif(trim(pa.nickname), ''), pa.name) AS name, pa.instagram, pa.photo_url,
  sum(p.points)::int AS points, count(*)::int AS actions, max(p.created_at) AS last_at
FROM pts p
JOIN tw_participants pa ON pa.id = p.participant_id
WHERE pa.show_in_ranking AND NOT coalesce(pa.blocked, false)
GROUP BY p.campaign_id, p.track, p.day, pa.id, pa.name, pa.nickname, pa.instagram, pa.photo_url;
