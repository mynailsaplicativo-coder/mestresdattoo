-- Fase 21: avisos para uma pessoa específica ou só para uma trilha (tatuadores / público)
ALTER TABLE tw_announcements ADD COLUMN IF NOT EXISTS participant_id uuid REFERENCES tw_participants(id) ON DELETE CASCADE;
ALTER TABLE tw_announcements ADD COLUMN IF NOT EXISTS audience text DEFAULT 'all'; -- 'all' | 'artist' | 'public'

-- Aviso só para o Robson (Constantinetattoo), por 24h
INSERT INTO tw_announcements (campaign_id, message, level, participant_id, link, starts_at, ends_at)
VALUES (
  'tattooweek-2026',
  'Robson, sua conta agora é de TATUADOR! Volta no stand da Bronc e encosta o celular no adesivo de ativação para liberar o Artist Challenge.',
  'urgent',
  '78981b53-6297-4653-920f-615fac48ee09',
  NULL,
  now(),
  now() + interval '24 hours'
);

-- Conferência
SELECT message, participant_id, audience, ends_at FROM tw_announcements
WHERE participant_id = '78981b53-6297-4653-920f-615fac48ee09';
