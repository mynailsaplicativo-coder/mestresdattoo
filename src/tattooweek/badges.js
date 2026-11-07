import { supabase } from '../supabaseClient';
import { DAY_BONUS, loadAdjustments } from './twData';

// Selos digitais: calculados a partir dos envios aprovados, sem tabela própria.
export const BADGES = [
  { id: 'primeira', icon: '🎟️', title: 'Primeira missão', desc: 'Cumpriu a primeira missão' },
  { id: 'completo', icon: '🔥', title: 'Zerou o jogo', desc: 'Todas as missões da sua trilha' },
  { id: 'detetive', icon: '🕵️', title: 'Detetive', desc: 'Acertou todas as perguntas' },
  { id: 'selo1', icon: '🗝️', title: 'Caçador', desc: 'Encontrou um selo secreto' },
  { id: 'cacador', icon: '👑', title: 'Lenda dos selos', desc: 'Encontrou os 5 selos secretos' },
  { id: 'relampago', icon: '⚡', title: 'Relâmpago', desc: 'Cumpriu uma missão surpresa' },
  { id: 'conector', icon: '📡', title: 'Conector', desc: '5 Pontos NFC encontrados' },
  { id: 'superconector', icon: '🛰️', title: 'Super conector', desc: '10 Pontos NFC encontrados' },
  { id: 'passaporte', icon: '🛂', title: 'Passaporte completo', desc: 'Todos os Pontos NFC' },
  { id: 'parceiros', icon: '🤜', title: 'Amigo dos parceiros', desc: 'Todos os desafios dos parceiros' },
  { id: 'criador', icon: '🎙️', title: 'Criador', desc: 'Todas as missões de conteúdo' },
  { id: 'explorador', icon: '🧭', title: 'Explorador', desc: '15 fotos ou vídeos aprovados' },
  { id: 'podio', icon: '🏆', title: 'Pódio', desc: 'Top 3 do ranking' },
  { id: 'cineasta', icon: '🎬', title: 'Cineasta', desc: 'Gerou sua retrospectiva em vídeo' },
  { id: 'veterano', icon: '🎖️', title: 'Veterano', desc: 'Jogou em 2 ou mais eventos', global: true },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map(b => [b.id, b]));

// approved: envios aprovados com .mission; missions: missões ativas da campanha
export function computeBadges({ approved, missions, artistsCount, ranks, videoGenerated, secretCount = 5 }) {
  const got = new Set();
  const doneIds = new Set(approved.map(s => s.mission_id));
  const byCat = (cat) => approved.filter(s => s.mission?.category === cat);
  // Só conta missões das trilhas em que a pessoa joga
  const tracks = new Set(approved.map(s => s.mission?.track).filter(Boolean));
  const mine = missions.filter(m => tracks.has(m.track) && m.active !== false);
  const all = (list) => list.length > 0 && list.every(m => doneIds.has(m.id));

  if (approved.length) got.add('primeira');
  if (all(mine.filter(m => !m.hidden && ['geral', 'quiz', 'parceiros', 'networking', 'conteudo', 'dia'].includes(m.category)))) got.add('completo');
  if (all(mine.filter(m => m.category === 'quiz'))) got.add('detetive');

  const seals = new Set(byCat('selo').map(s => s.artist_id)).size;
  if (seals >= 1) got.add('selo1');
  if (secretCount > 0 && seals >= secretCount) got.add('cacador');
  if (byCat('surpresa').length) got.add('relampago');

  const stamps = new Set(byCat('passaporte').map(s => s.artist_id)).size;
  if (stamps >= 5) got.add('conector');
  if (stamps >= 10) got.add('superconector');
  if (artistsCount > 0 && stamps >= artistsCount) got.add('passaporte');

  if (all(mine.filter(m => m.category === 'parceiros'))) got.add('parceiros');
  if (all(mine.filter(m => m.category === 'conteudo'))) got.add('criador');
  if (approved.reduce((acc, s) => acc + (s.media?.length || 0), 0) >= 15) got.add('explorador');

  if (Object.values(ranks || {}).some(r => r && r <= 3)) got.add('podio');
  if (videoGenerated) got.add('cineasta');
  return BADGES.filter(b => got.has(b.id));
}

// Tudo o que é preciso para mostrar o progresso de uma pessoa em uma campanha
export async function loadCampaignProgress(participantId, campaignId) {
  const [s, m, a, r, e, adj] = await Promise.all([
    supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participantId).eq('mission.campaign_id', campaignId),
    supabase.from('tw_missions').select('*').eq('campaign_id', campaignId).eq('active', true),
    supabase.from('tw_artists').select('id, kind, slug, name').eq('campaign_id', campaignId).eq('active', true).order('slug'),
    supabase.from('tw_ranking').select('participant_id, track, points').eq('campaign_id', campaignId).order('points', { ascending: false }).order('last_at'),
    supabase.from('tw_events').select('id').eq('participant_id', participantId).eq('campaign_id', campaignId).eq('type', 'video_generated').limit(1),
    loadAdjustments(participantId, campaignId),
  ]);
  const subs = s.data || [];
  const approved = subs.filter(x => x.status === 'approved');
  const missions = m.data || [];
  const ranks = {};
  const points = {};
  ['public', 'artist'].forEach(track => {
    const list = (r.data || []).filter(x => x.track === track);
    const pos = list.findIndex(x => x.participant_id === participantId);
    ranks[track] = pos >= 0 ? pos + 1 : null;
    points[track] = pos >= 0 ? list[pos].points : sumPoints(approved, missions, track) + (adj[track] || 0);
  });
  const tags = a.data || [];
  const pointsCount = tags.filter(t => (t.kind || 'point') === 'point').length;
  const secretCount = tags.filter(t => t.kind === 'secret').length;
  const badges = computeBadges({ approved, missions, artistsCount: pointsCount, secretCount, ranks, videoGenerated: (e.data || []).length > 0 });
  const foundSecret = new Set(approved.filter(x => x.mission?.category === 'selo').map(x => x.artist_id));
  const secretTags = tags.filter(t => t.kind === 'secret').map(t => ({ slug: t.slug, name: t.name, earned: foundSecret.has(t.id) }));
  return { subs, approved, missions, ranks, points, badges, artistsCount: pointsCount, secretCount, secretTags };
}

// Pontos calculados localmente (participação privada não aparece na view tw_ranking)
export function sumPoints(approved, missions, track) {
  const mine = approved.filter(s => s.mission?.track === track);
  let total = mine.reduce((acc, s) => acc + (s.points || 0), 0);
  if (track === 'public') {
    const doneIds = new Set(mine.map(s => s.mission_id));
    [1, 2, 3].forEach(d => {
      const list = missions.filter(m => m.track === 'public' && m.category === 'dia' && m.day === d);
      if (list.length && list.every(m => doneIds.has(m.id))) total += DAY_BONUS;
    });
  }
  return total;
}
