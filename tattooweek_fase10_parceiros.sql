-- DESAFIO DOS MESTRES — Fase 10: desafios do STENCILFLOW e do Ink Authority
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.

-- STENCILFLOW: baixar o app e fazer o decalque de uma arte (público e artistas)
UPDATE tw_missions SET
  title = 'Desafio STENCILFLOW: faça seu decalque',
  description = 'Baixe o app STENCILFLOW (https://apps.apple.com/br/app/stencil-flow/id6764149272), escolha uma arte e faça o decalque (stencil) dela no app. Envie o print ou a foto do decalque pronto.',
  media_count = 1, category = 'parceiros', partner = 'stencilflow', active = true
WHERE id IN ('tw26-p-stencil', 'tw26-a-stencil');

-- Ink Authority: pergunta sobre posicionamento e marketing (resposta conferida na hora)
-- Resposta aceita: "posicionamento" (troque a pergunta e a resposta no admin, em Missões → Editar)
UPDATE tw_missions SET
  title = 'Desafio Ink Authority: para atrair clientes, o que o tatuador deve definir primeiro: posicionamento ou anúncio?',
  description = 'Pergunta de marketing para tatuadores, do Ink Authority (@inkauthorityacademy). Responda com uma palavra.',
  category = 'quiz', partner = 'inkauthority', media_count = 0, points = 20,
  answer_hint = 'uma palavra',
  answer_hash = 'ef8c12ddea4a41d32ebbdda4225ca9fe37fdf3e403c827ca77e875556751be1b,6fd25205b488a3c51880061a77c2e9fc87fcbb33c64ab36a64ac569a337b6846',
  active = true
WHERE id = 'tw26-p-ink';

INSERT INTO tw_missions (id, campaign_id, track, position, category, partner, title, description, points, media_count, approval, answer_hint, answer_hash, seal_name, seal_icon, seal_color) VALUES
  ('tw26-a-ink', 'tattooweek-2026', 'artist', 11, 'quiz', 'inkauthority',
   'Desafio Ink Authority: para atrair clientes, o que o tatuador deve definir primeiro: posicionamento ou anúncio?',
   'Pergunta de marketing para tatuadores, do Ink Authority (@inkauthorityacademy). Responda com uma palavra.',
   20, 0, 'auto', 'uma palavra',
   'ef8c12ddea4a41d32ebbdda4225ca9fe37fdf3e403c827ca77e875556751be1b,6fd25205b488a3c51880061a77c2e9fc87fcbb33c64ab36a64ac569a337b6846',
   'Sabe-Tudo', 'book', '#f4e14d')
ON CONFLICT (id) DO NOTHING;
