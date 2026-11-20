-- Fase 20: Robson Cunha (Constantinetattoo, constantinetattooink@gmail.com) sai do público e vira tatuador
UPDATE tw_participants
SET in_public = false, in_challenge = true, show_in_ranking = true
WHERE id = '78981b53-6297-4653-920f-615fac48ee09';

UPDATE tw_enrollments
SET track = 'artist'
WHERE participant_id = '78981b53-6297-4653-920f-615fac48ee09' AND campaign_id = 'tattooweek-2026';

-- Conferência
SELECT p.nickname, p.in_public, p.in_challenge, p.show_in_ranking, e.track
FROM tw_participants p JOIN tw_enrollments e ON e.participant_id = p.id
WHERE p.id = '78981b53-6297-4653-920f-615fac48ee09';
