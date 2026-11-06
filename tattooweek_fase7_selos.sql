-- DESAFIO DOS MESTRES — Fase 7: selos por missão, mapa, regras dos artistas
-- Rode DEPOIS da fase 6, no SQL Editor do Supabase. Pode rodar mais de uma vez.
--   • cada missão dá um selo de escoteiro (nome + ícone + cor)
--   • artistas: seguir os perfis dos parceiros e postar cada missão marcando eles (link do post)
--   • NFC dos artistas: só 1 (ativação/cadastro) + os 5 selos secretos; pontos NFC saem do ar
--   • prêmio: 1 kit por dia para o melhor tatuador do dia
--   • mapa do jogo (imagem + pinos)

-- 1. Estrutura
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS seal_name text;
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS seal_icon text;    -- nome do ícone (ex.: utensils, flame, camera)
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS seal_color text;   -- cor do selo
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS require_post boolean DEFAULT false; -- pede o link do post marcando os perfis
ALTER TABLE tw_submissions ADD COLUMN IF NOT EXISTS post_url text;
ALTER TABLE tw_partners ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS map_image text;
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS map_pins jsonb DEFAULT '[]';   -- [{ label, x, y, kind }]  x/y em %
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS follow_partners jsonb DEFAULT '[]'; -- perfis que o artista precisa seguir
ALTER TABLE tw_enrollments ADD COLUMN IF NOT EXISTS followed_at timestamp with time zone;

-- 2. Ranking do dia separado por trilha (o prêmio é do tatuador do dia)
DROP VIEW IF EXISTS tw_ranking_daily;
CREATE VIEW tw_ranking_daily AS
WITH pts AS (
  SELECT s.participant_id, m.campaign_id, m.track, (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day, s.points, s.created_at
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved'
  UNION ALL
  SELECT participant_id, campaign_id, track, (created_at AT TIME ZONE 'America/Sao_Paulo')::date, points, created_at
  FROM tw_adjustments
)
SELECT
  p.campaign_id, p.track, p.day, pa.id AS participant_id, pa.name, pa.instagram, pa.photo_url,
  sum(p.points)::int AS points, count(*)::int AS actions, max(p.created_at) AS last_at
FROM pts p
JOIN tw_participants pa ON pa.id = p.participant_id
WHERE pa.show_in_ranking AND NOT coalesce(pa.blocked, false)
GROUP BY p.campaign_id, p.track, p.day, pa.id, pa.name, pa.instagram, pa.photo_url;

-- 3. Perfis que os artistas precisam seguir (confira os @ na aba Parceiros do admin)
INSERT INTO tw_partners (id, name, color, role, instagram) VALUES
  ('tcm', 'TCM Supply', '#f07c2a', 'Grupo da Bronc', NULL),
  ('tattooweek', 'Tattoo Week', '#ff8fd8', 'O maior festival de tatuagem do mundo', '@tattooweek')
ON CONFLICT (id) DO NOTHING;
UPDATE tw_partners SET color = '#f07c2a' WHERE id = 'bronc';
UPDATE tw_campaigns SET follow_partners = '["bronc", "tcm", "mestres", "stencilflow", "inkauthority", "tattooweek"]'
WHERE id = 'tattooweek-2026';

-- 4. Selos de escoteiro de cada missão
UPDATE tw_missions m SET seal_name = v.n, seal_icon = v.i, seal_color = v.c FROM (VALUES
  ('tw26-p-checkin', 'Chegou Chegando', 'door', '#a995ff'),
  ('tw26-p-post', 'Influencer', 'megaphone', '#ff8fd8'),
  ('tw26-p-backdrop', 'Dragão da Bronc', 'flame', '#f07c2a'),
  ('tw26-p-master', 'Detetive', 'search', '#7fe7f2'),
  ('tw26-p-ceo', 'Investigador', 'crown', '#f4e14d'),
  ('tw26-p-tattoo', 'Olho Clínico', 'eye', '#ff8fd8'),
  ('tw26-p-artista', 'Fã de Mestre', 'pen', '#a995ff'),
  ('tw26-p-amigo', 'Parceiro de Convenção', 'heart', '#ff6fa8'),
  ('tw26-p-stencil', 'Traço Fino', 'stencil', '#7fe7f2'),
  ('tw26-p-ink', 'Sabe-Tudo', 'book', '#f4e14d'),
  ('tw26-a-post', 'Influencer', 'megaphone', '#ff8fd8'),
  ('tw26-a-backdrop', 'Dragão da Bronc', 'flame', '#f07c2a'),
  ('tw26-a-ceo', 'Investigador', 'crown', '#f4e14d'),
  ('tw26-a-master', 'Detetive', 'search', '#7fe7f2'),
  ('tw26-a-estado', 'Viajante', 'map', '#a995ff'),
  ('tw26-a-trio', 'Bonde dos Mestres', 'users', '#ff8fd8'),
  ('tw26-a-entrevista', 'Repórter', 'mic', '#7fe7f2'),
  ('tw26-a-dica', 'Professor', 'lightbulb', '#f4e14d'),
  ('tw26-a-stencil', 'Traço Fino', 'stencil', '#7fe7f2')
) AS v(id, n, i, c)
WHERE m.id = v.id;

-- Missão nova do público: a da comida (selo Comilão)
INSERT INTO tw_missions (id, campaign_id, track, position, category, title, description, points, media_count, approval, seal_name, seal_icon, seal_color) VALUES
  ('tw26-p-comida', 'tattooweek-2026', 'public', 11, 'geral', 'Hora do rango', 'Mostre o que você comeu na Tattoo Week.', 10, 1, 'auto', 'Comilão', 'utensils', '#f4e14d'),
  ('tw26-p-show', 'tattooweek-2026', 'public', 12, 'geral', 'Curtindo o palco', 'Registre você curtindo um show ou atração do palco.', 10, 1, 'auto', 'Pé na Pista', 'music', '#ff8fd8'),
  ('tw26-a-comida', 'tattooweek-2026', 'artist', 10, 'geral', 'Hora do rango', 'Mostre o que você comeu entre uma tattoo e outra.', 10, 1, 'auto', 'Comilão', 'utensils', '#f4e14d')
ON CONFLICT (id) DO NOTHING;

-- Missões dos artistas: postar no perfil marcando os parceiros
UPDATE tw_missions SET require_post = true
WHERE campaign_id = 'tattooweek-2026' AND track = 'artist' AND category NOT IN ('selo', 'quiz', 'passaporte', 'surpresa');

-- 5. NFC: só a ativação dos artistas + 5 selos secretos. Pontos NFC e carimbos saem do ar.
UPDATE tw_artists SET active = false WHERE campaign_id = 'tattooweek-2026' AND coalesce(kind, 'point') = 'point';
UPDATE tw_missions SET active = false WHERE campaign_id = 'tattooweek-2026' AND category = 'passaporte';
UPDATE tw_artists SET name = 'Cadastro do Artist Challenge', bio = 'Tatuador: encoste aqui para se cadastrar e liberar o Artist Challenge.'
WHERE campaign_id = 'tattooweek-2026' AND slug = 'ativacao-bronc';

-- 6. Prêmio: 1 kit por dia para o melhor tatuador do dia
DELETE FROM tw_awards WHERE campaign_id = 'tattooweek-2026' AND status = 'open';
INSERT INTO tw_awards (campaign_id, position, title, description, rule, rank, day, track)
SELECT 'tattooweek-2026', d, 'Tatuador do Dia ' || d, 'Kit dos Mestres', 'day_rank', 1, d, 'artist'
FROM generate_series(1, 3) AS d;

UPDATE tw_campaigns SET
  prize_items = '["1 kit por dia para o melhor tatuador do dia", "Produtos Bronc", "Benefício STENCILFLOW Pro", "Acesso especial Ink Authority", "Item exclusivo Mestres da Tattoo"]',
  map_pins = '[{"label": "Stand Bronc · Cadastro dos artistas", "x": 27, "y": 55, "kind": "bronc"}, {"label": "Palco", "x": 76, "y": 40, "kind": "stage"}, {"label": "Entrada", "x": 18, "y": 49, "kind": "info"}]'
WHERE id = 'tattooweek-2026';
