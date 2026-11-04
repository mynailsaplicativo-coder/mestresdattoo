-- EXPERIENCE MESTRES DA TATTOO — Fase 5: cores por campanha
-- Opcional: sem rodar, a Tattoo Week já usa a paleta dela (definida no código).
-- Rodando, as cores ficam editáveis no admin (aba Campanha → Cores da campanha).
ALTER TABLE tw_campaigns ADD COLUMN IF NOT EXISTS theme jsonb;
