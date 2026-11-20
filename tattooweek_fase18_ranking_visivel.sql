-- Fase 18: tatuadores que marcaram "participação privada" sem querer no cadastro
-- voltam a aparecer no ranking (a opção saiu do cadastro; continua no perfil).
UPDATE tw_participants
SET show_in_ranking = true
WHERE in_challenge = true
  AND show_in_ranking = false;

-- Conferência: deve mostrar 0
SELECT count(*) AS tatuadores_ainda_privados
FROM tw_participants
WHERE in_challenge = true AND show_in_ranking = false;
