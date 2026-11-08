-- DESAFIO DOS MESTRES — Fase 14: público sem ranking + selo premiado do chaveiro Bronc
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.

-- 1. Selo premiado: quem do público encostar o celular nesse selo secreto ganha o chaveiro Bronc.
--    Sorteado aleatoriamente: Grande Rei Macaco da Festa. Dá para trocar no admin (Visão geral).
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS gift_seal_slug text;
UPDATE tw_campaigns SET gift_seal_slug = 'selo-macaco' WHERE id = 'tattooweek-2026';

-- 2. Texto do prêmio
UPDATE tw_campaigns SET
  prize_title = 'Prêmio do dia: impressora Bronc + 10 mil pontos E-Bronc',
  prize_items = '["1 impressora de stencil Bronc por dia para o tatuador nº 1 do dia (com os 6 selos secretos)", "+ 10 mil pontos de crédito no app E-Bronc, também por dia", "Público: 200 chaveiros exclusivos Bronc para quem achar o selo secreto premiado"]'
WHERE id = 'tattooweek-2026';

-- 3. São 6 selos secretos (o Tigre entra no jogo)
UPDATE tw_artists SET active = true WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-tigre';
