-- Fase 19: o perfil do criador (Yuri / @oyuriandrade, nick "mestresdatattoo") não aparece no ranking
UPDATE tw_participants
SET show_in_ranking = false
WHERE id = '91c097c5-03d3-47ff-b5a1-f74f0919cbd9';

-- Conferência: deve mostrar show_in_ranking = false
SELECT name, nickname, instagram, show_in_ranking
FROM tw_participants
WHERE id = '91c097c5-03d3-47ff-b5a1-f74f0919cbd9';
