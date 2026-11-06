-- DESAFIO DOS MESTRES — Fase 11: kit do dia, ranking ao vivo e missões de volta ao ar
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.

-- 1. Missões do tatuador valem de novo a cada dia (o ranking do dia zera à meia-noite)
--    play_day = dia de jogo do envio. Selos secretos e missões do público continuam 1 vez só.
ALTER TABLE tw_submissions ADD COLUMN IF NOT EXISTS play_day date;
DROP INDEX IF EXISTS tw_submissions_unique;
CREATE UNIQUE INDEX IF NOT EXISTS tw_submissions_unique_day
  ON tw_submissions (participant_id, mission_id, coalesce(artist_id, '00000000-0000-0000-0000-000000000000'::uuid), coalesce(play_day, '2000-01-01'::date));

-- 2. Ranking em tempo real: o site recebe na hora cada envio novo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tw_submissions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tw_submissions;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tw_adjustments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tw_adjustments;
  END IF;
END $$;

-- 3. Kit do dia (1 por dia para o tatuador nº 1 do dia com todos os selos secretos)
UPDATE tw_campaigns SET
  prize_title = 'Kit dos Mestres — 1 por dia',
  prize_items = '["1 máquina", "1 impressora", "10 caixas de cartucho", "1 mês de STENCILFLOW Pro", "Acesso Ink Authority para assistir à stream class da Isabella Badini", "1 post collab com o Mestres da Tattoo", "1 chaveiro da Bronc", "1 copo da Tattoo Week"]'
WHERE id = 'tattooweek-2026';

-- 4. Missões de volta ao ar (Bronc, STENCILFLOW, Ink Authority, Master e Post estavam desligadas)
--    e as missões antigas por dia (p1-.., p2-.., p3-..) saem do ar, como no jogo novo.
UPDATE tw_missions SET active = true
WHERE campaign_id = 'tattooweek-2026' AND id IN (
  'tw26-p-checkin', 'tw26-p-post', 'tw26-p-backdrop', 'tw26-p-master', 'tw26-p-ceo', 'tw26-p-tattoo', 'tw26-p-artista',
  'tw26-p-amigo', 'tw26-p-stencil', 'tw26-p-ink', 'tw26-p-comida', 'tw26-p-show', 'tw26-p-selo',
  'tw26-a-post', 'tw26-a-backdrop', 'tw26-a-ceo', 'tw26-a-master', 'tw26-a-estado', 'tw26-a-trio', 'tw26-a-entrevista',
  'tw26-a-dica', 'tw26-a-stencil', 'tw26-a-comida', 'tw26-a-ink', 'tw26-a-selo'
);
UPDATE tw_missions SET active = false
WHERE campaign_id = 'tattooweek-2026' AND id NOT LIKE 'tw26-%' AND category <> 'surpresa';

-- Ordem: Bronc primeiro (o stand da ativação), depois os outros parceiros
UPDATE tw_missions m SET position = v.p FROM (VALUES
  ('tw26-p-checkin', 1), ('tw26-p-backdrop', 2), ('tw26-p-ceo', 3), ('tw26-p-master', 4), ('tw26-p-post', 5),
  ('tw26-p-stencil', 6), ('tw26-p-ink', 7), ('tw26-p-tattoo', 8), ('tw26-p-artista', 9), ('tw26-p-amigo', 10),
  ('tw26-p-comida', 11), ('tw26-p-show', 12),
  ('tw26-a-backdrop', 1), ('tw26-a-ceo', 2), ('tw26-a-master', 3), ('tw26-a-post', 4), ('tw26-a-stencil', 5),
  ('tw26-a-ink', 6), ('tw26-a-estado', 7), ('tw26-a-trio', 8), ('tw26-a-entrevista', 9), ('tw26-a-dica', 10),
  ('tw26-a-comida', 11)
) AS v(id, p) WHERE m.id = v.id;

-- 5. São 5 selos secretos para ganhar o kit: o Tigre (reserva) fica desligado.
--    Se você imprimir o 6º adesivo e quiser exigir 6, ative o Tigre no admin (Pontos NFC).
UPDATE tw_artists SET active = false WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-tigre';
