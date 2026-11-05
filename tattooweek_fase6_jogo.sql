-- DESAFIO MESTRES DA TATTOO — Fase 6: jogo mais rápido (pedidos da Bronc)
-- Rode DEPOIS das fases anteriores, no SQL Editor do Supabase. Pode rodar mais de uma vez.
--   • missões abertas o evento todo (sem trava por dia), mais curtas
--   • perguntas com resposta conferida automaticamente (hash, a resposta não fica exposta)
--   • Pontos NFC (lugares/stands), 5 selos secretos e a ativação do Artist Challenge no stand da Bronc
--   • ranking do dia e 3 premiações por dia
--   • nome sem "Experience" (registro no INPI)

-- 1. Estrutura
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS answer_hash text;   -- hashes SHA-256 das respostas aceitas, separados por vírgula
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS answer_hint text;   -- dica mostrada no campo de resposta
ALTER TABLE tw_artists ADD COLUMN IF NOT EXISTS kind text DEFAULT 'point'; -- 'point' | 'secret' | 'activation'
ALTER TABLE tw_artists ADD COLUMN IF NOT EXISTS location text;       -- onde o adesivo está colado
ALTER TABLE tw_artists ADD COLUMN IF NOT EXISTS seal_icon text;      -- emoji do selo secreto
ALTER TABLE tw_enrollments ADD COLUMN IF NOT EXISTS activated_at timestamp with time zone; -- Artist Challenge ativado no stand
ALTER TABLE tw_awards ADD COLUMN IF NOT EXISTS day int;              -- prêmio diário: 1, 2, 3
ALTER TABLE tw_awards ADD COLUMN IF NOT EXISTS track text DEFAULT 'all';

-- 2. Ranking do dia (horário de São Paulo), soma público + challenge + ajustes
DROP VIEW IF EXISTS tw_ranking_daily;
CREATE VIEW tw_ranking_daily AS
WITH pts AS (
  SELECT s.participant_id, m.campaign_id, (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day, s.points, s.created_at
  FROM tw_submissions s JOIN tw_missions m ON m.id = s.mission_id
  WHERE s.status = 'approved'
  UNION ALL
  SELECT participant_id, campaign_id, (created_at AT TIME ZONE 'America/Sao_Paulo')::date, points, created_at
  FROM tw_adjustments
)
SELECT
  p.campaign_id, p.day, pa.id AS participant_id, pa.name, pa.instagram, pa.photo_url,
  sum(p.points)::int AS points, count(*)::int AS actions, max(p.created_at) AS last_at
FROM pts p
JOIN tw_participants pa ON pa.id = p.participant_id
WHERE pa.show_in_ranking AND NOT coalesce(pa.blocked, false)
GROUP BY p.campaign_id, p.day, pa.id, pa.name, pa.instagram, pa.photo_url;

-- 3. Campanha: nome novo e textos
UPDATE tw_campaigns SET
  name = 'Desafio dos Mestres',
  tagline = 'Missões rápidas. Selos secretos. Prêmios todo dia.',
  description = 'O jogo do Mestres da Tattoo dentro da Tattoo Week. Venha 1 dia ou os 3: cada missão conta, cada selo secreto vale pontos e todo dia tem premiação.',
  prize_title = 'Kit dos Mestres',
  prize_items = '["3 premiações por dia (1º, 2º e 3º do ranking do dia)", "Produtos Bronc", "Benefício STENCILFLOW Pro", "Acesso especial Ink Authority", "Item exclusivo Mestres da Tattoo"]'
WHERE id = 'tattooweek-2026';

-- 4. Missões antigas saem do ar (ficam guardadas, sem apagar envios)
UPDATE tw_missions SET active = false
WHERE campaign_id = 'tattooweek-2026' AND id NOT LIKE 'tw26-%' AND category <> 'surpresa';

-- 5. Missões novas — rápidas, abertas o evento todo
INSERT INTO tw_missions (id, campaign_id, track, position, category, partner, title, description, points, media_count, approval) VALUES
  -- Público
  ('tw26-p-checkin', 'tattooweek-2026', 'public', 1, 'geral', NULL, 'Check-in: selfie chegando na Tattoo Week', 'Mostre que você chegou!', 10, 1, 'auto'),
  ('tw26-p-post', 'tattooweek-2026', 'public', 2, 'geral', 'mestres', 'Poste que está no desafio', 'Poste nos stories que está participando do Desafio dos Mestres marcando @mestresdatattoo e envie o print.', 20, 1, 'auto'),
  ('tw26-p-backdrop', 'tattooweek-2026', 'public', 3, 'parceiros', 'bronc', 'Foto no Backdrop da Bronc', 'Tire uma foto no backdrop do stand da Bronc, poste e compartilhe com 5 amigos. Envie a foto e o print do compartilhamento.', 30, 2, 'auto'),
  ('tw26-p-master', 'tattooweek-2026', 'public', 4, 'quiz', NULL, 'Quem é o patrocinador Master da Tattoo Week SP 2026?', 'Descubra no evento e responda.', 20, 0, 'auto'),
  ('tw26-p-ceo', 'tattooweek-2026', 'public', 5, 'quiz', 'bronc', 'Quem é o CEO da TCM Supply Corporation?', 'Responda com o nome verdadeiro do CEO e siga ele no Instagram. Envie o print mostrando que seguiu.', 30, 1, 'auto'),
  ('tw26-p-tattoo', 'tattooweek-2026', 'public', 6, 'geral', NULL, 'A tattoo que te parou', 'Foto da tatuagem que mais chamou sua atenção hoje.', 10, 1, 'auto'),
  ('tw26-p-artista', 'tattooweek-2026', 'public', 7, 'geral', NULL, 'Um mestre em ação', 'Foto ou vídeo curto de um tatuador trabalhando.', 10, 1, 'auto'),
  ('tw26-p-amigo', 'tattooweek-2026', 'public', 8, 'geral', NULL, 'Amizade de convenção', 'Selfie com alguém que você conheceu aqui.', 10, 1, 'auto'),
  ('tw26-p-stencil', 'tattooweek-2026', 'public', 9, 'parceiros', 'stencilflow', 'Desafio STENCILFLOW', 'Passe no espaço STENCILFLOW, teste o app e envie uma foto.', 20, 1, 'auto'),
  ('tw26-p-ink', 'tattooweek-2026', 'public', 10, 'parceiros', 'inkauthority', 'Desafio Ink Authority', 'Encontre o Ink Authority no evento e mostre o que aprendeu.', 20, 1, 'auto'),
  ('tw26-p-pas', 'tattooweek-2026', 'public', 20, 'passaporte', NULL, 'Ponto NFC encontrado', 'Encoste o celular num Ponto NFC e registre com uma foto. Vale 1 por ponto.', 10, 1, 'auto'),
  ('tw26-p-selo', 'tattooweek-2026', 'public', 30, 'selo', NULL, 'Selo secreto', 'Encontre os 5 selos secretos escondidos no evento.', 25, 0, 'auto'),
  -- Artist Challenge
  ('tw26-a-post', 'tattooweek-2026', 'artist', 1, 'conteudo', 'mestres', 'Poste que está no desafio', 'Poste nos stories que está no Artist Challenge marcando @mestresdatattoo e envie o print.', 20, 1, 'auto'),
  ('tw26-a-backdrop', 'tattooweek-2026', 'artist', 2, 'parceiros', 'bronc', 'Foto no Backdrop da Bronc', 'Foto no backdrop da Bronc, poste e compartilhe com 5 amigos. Envie a foto e o print.', 30, 2, 'auto'),
  ('tw26-a-ceo', 'tattooweek-2026', 'artist', 3, 'quiz', 'bronc', 'Quem é o CEO da TCM Supply Corporation?', 'Responda com o nome verdadeiro do CEO e siga ele no Instagram. Envie o print mostrando que seguiu.', 30, 1, 'auto'),
  ('tw26-a-master', 'tattooweek-2026', 'artist', 4, 'quiz', NULL, 'Quem é o patrocinador Master da Tattoo Week SP 2026?', 'Descubra no evento e responda.', 20, 0, 'auto'),
  ('tw26-a-estado', 'tattooweek-2026', 'artist', 5, 'networking', NULL, 'Conexão de outro estado', 'Foto com um tatuador de outro estado. Diga o nome e o estado na observação.', 20, 1, 'auto'),
  ('tw26-a-trio', 'tattooweek-2026', 'artist', 6, 'networking', NULL, 'Trio de mestres', 'Reúna três tatuadores numa foto.', 30, 1, 'auto'),
  ('tw26-a-entrevista', 'tattooweek-2026', 'artist', 7, 'conteudo', NULL, 'Entrevista relâmpago', 'Grave 30 segundos entrevistando um artista.', 30, 1, 'auto'),
  ('tw26-a-dica', 'tattooweek-2026', 'artist', 8, 'conteudo', NULL, 'Dica de mestre', 'Grave uma dica rápida para tatuadores iniciantes.', 20, 1, 'auto'),
  ('tw26-a-stencil', 'tattooweek-2026', 'artist', 9, 'parceiros', 'stencilflow', 'Desafio criativo STENCILFLOW', 'Crie um stencil no STENCILFLOW e envie o resultado.', 30, 1, 'auto'),
  ('tw26-a-pas', 'tattooweek-2026', 'artist', 20, 'passaporte', NULL, 'Ponto NFC encontrado', 'Encoste o celular num Ponto NFC e registre com uma foto. Vale 1 por ponto.', 10, 1, 'auto'),
  ('tw26-a-selo', 'tattooweek-2026', 'artist', 30, 'selo', NULL, 'Selo secreto', 'Encontre os 5 selos secretos escondidos no evento.', 25, 0, 'auto')
ON CONFLICT (id) DO NOTHING;
UPDATE tw_missions SET hidden = true WHERE id IN ('tw26-p-selo', 'tw26-a-selo');

-- 6. Pontos NFC: as antigas credenciais de artista viram pontos (lugares), até 30
UPDATE tw_artists SET reveals_mission_id = NULL WHERE campaign_id = 'tattooweek-2026';
UPDATE tw_artists SET
  slug = replace(slug, 'artista-', 'ponto-'),
  name = CASE WHEN name LIKE 'Artista %' THEN replace(name, 'Artista', 'Ponto NFC') ELSE name END,
  kind = 'point'
WHERE campaign_id = 'tattooweek-2026' AND slug LIKE 'artista-%';

INSERT INTO tw_artists (campaign_id, slug, name, kind)
SELECT 'tattooweek-2026', 'ponto-' || lpad(n::text, 2, '0'), 'Ponto NFC ' || lpad(n::text, 2, '0'), 'point'
FROM generate_series(1, 30) AS n
ON CONFLICT (campaign_id, slug) DO NOTHING;

-- 5 selos secretos (pontos extras na hora, para público e artistas)
INSERT INTO tw_artists (campaign_id, slug, name, kind, seal_icon, bio) VALUES
  ('tattooweek-2026', 'selo-caveira', 'Caveira Dourada', 'secret', '💀', 'Você encontrou um dos 5 selos secretos do Desafio dos Mestres.'),
  ('tattooweek-2026', 'selo-dragao', 'Dragão Oriental', 'secret', '🐉', 'Você encontrou um dos 5 selos secretos do Desafio dos Mestres.'),
  ('tattooweek-2026', 'selo-rosa', 'Rosa Negra', 'secret', '🥀', 'Você encontrou um dos 5 selos secretos do Desafio dos Mestres.'),
  ('tattooweek-2026', 'selo-ancora', 'Âncora Old School', 'secret', '⚓', 'Você encontrou um dos 5 selos secretos do Desafio dos Mestres.'),
  ('tattooweek-2026', 'selo-olho', 'Olho que Tudo Vê', 'secret', '👁️', 'Você encontrou um dos 5 selos secretos do Desafio dos Mestres.')
ON CONFLICT (campaign_id, slug) DO NOTHING;

-- Ativação do Artist Challenge no stand da Bronc
INSERT INTO tw_artists (campaign_id, slug, name, kind, location, bio) VALUES
  ('tattooweek-2026', 'ativacao-bronc', 'Ativação Artist Challenge', 'activation', 'Stand da Bronc', 'Escaneie aqui para liberar o Artist Challenge.')
ON CONFLICT (campaign_id, slug) DO NOTHING;

-- 7. Premiação: 3 por dia + grande prêmio do Artist Challenge
DELETE FROM tw_awards WHERE campaign_id = 'tattooweek-2026' AND status = 'open';
INSERT INTO tw_awards (campaign_id, position, title, description, rule, rank, day, track)
SELECT 'tattooweek-2026', d * 10 + r, 'Dia ' || d || ' — ' || r || 'º lugar', 'Kit dos Mestres', 'day_rank', r, d, 'all'
FROM generate_series(1, 3) AS d, generate_series(1, 3) AS r;
INSERT INTO tw_awards (campaign_id, position, title, description, rule, rank, track)
VALUES ('tattooweek-2026', 100, 'Campeão geral do Artist Challenge', 'Grande prêmio Kit dos Mestres', 'artist_rank', 1, 'artist');
