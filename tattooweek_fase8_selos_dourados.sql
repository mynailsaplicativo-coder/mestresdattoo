-- DESAFIO DOS MESTRES — Fase 8: os 5 selos secretos dourados
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.
-- Troca os 5 selos secretos pelos medalhões dourados dos personagens (os links das tags NFC mudam: veja abaixo).

-- Endereços novos (o que vai gravado na tag NFC)
UPDATE tw_artists SET slug = 'selo-macaco' WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-rosa'
  AND NOT EXISTS (SELECT 1 FROM tw_artists WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-macaco');
UPDATE tw_artists SET slug = 'selo-imperador' WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-ancora'
  AND NOT EXISTS (SELECT 1 FROM tw_artists WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-imperador');
UPDATE tw_artists SET slug = 'selo-oni' WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-olho'
  AND NOT EXISTS (SELECT 1 FROM tw_artists WHERE campaign_id = 'tattooweek-2026' AND slug = 'selo-oni');

-- Os antigos (Rosa Negra, Âncora, Olho) saem do ar se ainda existirem
UPDATE tw_artists SET active = false WHERE campaign_id = 'tattooweek-2026' AND slug IN ('selo-rosa', 'selo-ancora', 'selo-olho');

-- Nomes e a história que aparece quando a pessoa encontra
UPDATE tw_artists a SET name = v.n, seal_icon = v.i, bio = v.b, kind = 'secret', active = true FROM (VALUES
  ('selo-dragao', 'Dragão Dourado da União', '🐉', 'O dragão da Bronc une todos os mestres da tatuagem. Quem o encontra carrega a força da união.'),
  ('selo-macaco', 'Grande Rei Macaco da Festa', '🐒', 'O rei da bagunça! Onde ele aparece, a Tattoo Week vira festa. Você achou a alegria do evento.'),
  ('selo-imperador', 'Imperador da Sabedoria', '📜', 'Guardião dos segredos dos mestres. Só os mais atentos chegam até ele.'),
  ('selo-oni', 'Oni Guardião da Coragem', '👹', 'O oni protege quem tem coragem de marcar a pele. Coragem de mestre!'),
  ('selo-caveira', 'Caveira Eterna da Arte', '💀', 'A arte na pele é eterna. Você encontrou o selo que nunca se apaga.')
) AS v(slug, n, i, b)
WHERE a.campaign_id = 'tattooweek-2026' AND a.slug = v.slug;

-- Reserva: Tigre Dourado da Força (desligado; ative no admin se quiser um 6º selo)
INSERT INTO tw_artists (campaign_id, slug, name, kind, seal_icon, bio, active) VALUES
  ('tattooweek-2026', 'selo-tigre', 'Tigre Dourado da Força', 'secret', '🐯', 'Força de tigre para aguentar a sessão inteira. Selo bônus!', false)
ON CONFLICT (campaign_id, slug) DO NOTHING;
