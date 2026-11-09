-- DESAFIO DOS MESTRES — Fase 16: missão "Encontre o CEO da TCM, tire uma foto e siga ele"
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.
INSERT INTO tw_missions (id, campaign_id, track, position, category, partner, title, description, points, media_count, approval, seal_name, seal_icon, seal_color, require_post, active, day) VALUES
  ('tw26-p-ceo-foto', 'tattooweek-2026', 'public', 3, 'parceiros', 'tcm',
   'Encontre o CEO da TCM e tire uma foto com ele',
   'Ache o CEO da TCM Supply pelo evento, tire uma foto com ele e siga ele no Instagram. Envie a foto e o print mostrando que seguiu.',
   30, 2, 'auto', 'Caçador de CEO', 'search', '#f07c2a', false, true, NULL),
  ('tw26-a-ceo-foto', 'tattooweek-2026', 'artist', 0, 'parceiros', 'tcm',
   'Bônus: encontre o CEO da TCM e tire uma foto com ele',
   'Missão bônus que vale todos os dias: ache o CEO da TCM Supply pelo evento, tire uma foto com ele e siga ele no Instagram. Envie a foto e o print mostrando que seguiu.',
   30, 2, 'auto', 'Caçador de CEO', 'search', '#f07c2a', true, true, NULL)
ON CONFLICT (id) DO UPDATE SET active = true, title = EXCLUDED.title, description = EXCLUDED.description, media_count = 2, partner = 'tcm';
