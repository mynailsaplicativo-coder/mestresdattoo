-- DESAFIO DOS MESTRES — Fase 12: 5 missões por dia no Artist Challenge, impressora Bronc e chaveiros
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.

-- 1. Prêmio dos tatuadores: 1 impressora de stencil Bronc por dia
UPDATE tw_campaigns SET
  prize_title = 'Impressora Bronc — 1 por dia',
  prize_items = '["1 impressora de stencil Bronc para o tatuador nº 1 do dia (com os 5 selos secretos)", "Público: 200 chaveiros exclusivos Bronc para quem completar 5 missões (uma da Bronc)"]'
WHERE id = 'tattooweek-2026';

-- 2. Missões novas para o sorteio dos dias
INSERT INTO tw_missions (id, campaign_id, track, position, category, partner, title, description, points, media_count, approval, seal_name, seal_icon, seal_color, require_post) VALUES
  ('tw26-a-flash', 'tattooweek-2026', 'artist', 0, 'conteudo', NULL, 'Flash na hora', 'Desenhe um flash rápido aqui no evento e mostre o resultado.', 30, 1, 'auto', 'Mão Rápida', 'pen', '#ff8fd8', true),
  ('tw26-a-setup', 'tattooweek-2026', 'artist', 0, 'conteudo', NULL, 'Sua bancada de mestre', 'Foto da sua bancada ou do seu setup montado no evento.', 20, 1, 'auto', 'Bancada Raiz', 'camera', '#7fe7f2', true),
  ('tw26-a-veterano', 'tattooweek-2026', 'artist', 0, 'networking', NULL, 'Lenda viva', 'Foto com um tatuador com mais de 20 anos de carreira. Diga quem é na observação.', 30, 1, 'auto', 'Respeita os Mestres', 'crown', '#f4e14d', true),
  ('tw26-a-tattoo', 'tattooweek-2026', 'artist', 0, 'conteudo', NULL, 'A tattoo do dia', 'Foto de uma tatuagem que você fez hoje aqui na Tattoo Week.', 30, 1, 'auto', 'Tattoo do Dia', 'heart', '#ff6fa8', true),
  ('tw26-a-gringo', 'tattooweek-2026', 'artist', 0, 'networking', NULL, 'Conexão gringa', 'Foto com um artista de outro país. Diga o nome e o país na observação.', 30, 1, 'auto', 'Passaporte Gringo', 'map', '#8be3a5', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Sorteio: 5 missões por dia, só 1 de parceiro por dia
--    Dia 1 (20/11): Bronc  · Dia 2 (21/11): STENCILFLOW · Dia 3 (22/11): Ink Authority
--    Troque à vontade no admin (Missões → Editar → Dia) ou arrastando a ordem.
UPDATE tw_missions m SET day = v.d, position = v.p, active = true FROM (VALUES
  ('tw26-a-backdrop', 1, 1), ('tw26-a-gringo', 1, 2), ('tw26-a-flash', 1, 3), ('tw26-a-post', 1, 4), ('tw26-a-setup', 1, 5),
  ('tw26-a-stencil', 2, 1), ('tw26-a-entrevista', 2, 2), ('tw26-a-master', 2, 3), ('tw26-a-comida', 2, 4), ('tw26-a-dica', 2, 5),
  ('tw26-a-ink', 3, 1), ('tw26-a-tattoo', 3, 2), ('tw26-a-estado', 3, 3), ('tw26-a-veterano', 3, 4), ('tw26-a-trio', 3, 5)
) AS v(id, d, p) WHERE m.id = v.id;

-- A pergunta do CEO da TCM fica só no desafio do público (no Artist Challenge a Bronc já tem o Backdrop)
UPDATE tw_missions SET active = false WHERE id = 'tw26-a-ceo';

-- Qualquer outra missão de tatuador sem dia sai do ar (o selo secreto continua valendo todos os dias)
UPDATE tw_missions SET active = false
WHERE campaign_id = 'tattooweek-2026' AND track = 'artist' AND day IS NULL
  AND category NOT IN ('selo', 'surpresa', 'passaporte');
