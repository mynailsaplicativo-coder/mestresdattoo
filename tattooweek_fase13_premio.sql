-- DESAFIO DOS MESTRES — Fase 13: prêmio do dia = impressora Bronc + 10 mil pontos no app E-Bronc
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.
UPDATE tw_campaigns SET
  prize_title = 'Prêmio do dia: impressora Bronc + 10 mil pontos E-Bronc',
  prize_items = '["1 impressora de stencil Bronc por dia para o tatuador nº 1 do dia (com os 5 selos secretos)", "+ 10 mil pontos de crédito no app E-Bronc, também por dia", "Público: 200 chaveiros exclusivos Bronc para quem completar 5 missões (uma da Bronc)"]'
WHERE id = 'tattooweek-2026';
