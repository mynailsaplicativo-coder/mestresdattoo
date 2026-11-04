import { supabase } from '../supabaseClient';
import { DAY_BONUS } from './twData';

// Selos digitais: calculados a partir dos envios aprovados, sem tabela própria.
export const BADGES = [
  { id: 'primeira', icon: '🎟️', title: 'Primeira missão', desc: 'Cumpriu a primeira missão' },
  { id: 'dia1', icon: '🌅', title: 'Dia 1 completo', desc: 'Todas as missões do Dia 1' },
  { id: 'dia2', icon: '🤝', title: 'Dia 2 completo', desc: 'Todas as missões do Dia 2' },
  { id: 'dia3', icon: '🏁', title: 'Dia 3 completo', desc: 'Todas as missões do Dia 3' },
  { id: 'maratona', icon: '🔥', title: 'Maratonista', desc: 'Completou os 3 dias' },
  { id: 'explorador', icon: '🧭', title: 'Explorador', desc: '30 fotos ou vídeos aprovados' },
  { id: 'relampago', icon: '⚡', title: 'Relâmpago', desc: 'Cumpriu uma missão surpresa' },
  { id: 'secreta', icon: '🗝️', title: 'Decifrador', desc: 'Cumpriu a missão secreta' },
  { id: 'conector', icon: '📡', title: 'Conector', desc: '5 carimbos no Passaporte NFC' },
  { id: 'superconector', icon: '🛰️', title: 'Super conector', desc: '10 carimbos no Passaporte NFC' },
  { id: 'passaporte', icon: '🛂', title: 'Passaporte completo', desc: 'Carimbo de todos os artistas credenciados' },
  { id: 'parceiros', icon: '🤜', title: 'Amigo dos parceiros', desc: 'Completou o desafio de todos os parceiros' },
  { id: 'criador', icon: '🎙️', title: 'Criador', desc: 'Todas as missões de conteúdo' },
  { id: 'podio', icon: '🏆', title: 'Pódio', desc: 'Top 3 do ranking' },
  { id: 'cineasta', icon: '🎬', title: 'Cineasta', desc: 'Gerou sua retrospectiva em vídeo' },
  { id: 'veterano', icon: '🎖️', title: 'Veterano', desc: 'Participou de 2 ou mais experiências', global: true },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map(b => [b.id, b]));

// approved: envios aprovados com .mission; missions: missões ativas da campanha
export function computeBadges({ approved, missions, artistsCount, ranks, videoGenerated }) {
  const got = new Set();
  const doneIds = new Set(approved.map(s => s.mission_id));
  const byCat = (cat) => approved.filter(s => s.mission?.category === cat);

  if (approved.length) got.add('primeira');
  const daysDone = [1, 2, 3].filter(d => {
    const list = missions.filter(m => m.track === 'public' && m.category === 'dia' && m.day === d);
    return list.length > 0 && list.every(m => doneIds.has(m.id));
  });
  daysDone.forEach(d => got.add(`dia${d}`));
  if (daysDone.length === 3) got.add('maratona');
  if (approved.reduce((a, s) => a + (s.media?.length || 0), 0) >= 30) got.add('explorador');
  if (byCat('surpresa').length) got.add('relampago');
  if (byCat('secreta').length) got.add('secreta');

  const stamps = new Set(byCat('passaporte').map(s => s.artist_id)).size;
  if (stamps >= 5) got.add('conector');
  if (stamps >= 10) got.add('superconector');
  if (artistsCount > 0 && stamps >= artistsCount) got.add('passaporte');

  const partnerMissions = missions.filter(m => m.category === 'parceiros');
  if (partnerMissions.length && partnerMissions.every(m => doneIds.has(m.id))) got.add('parceiros');
  const contentMissions = missions.filter(m => m.category === 'conteudo');
  if (contentMissions.length && contentMissions.every(m => doneIds.has(m.id))) got.add('criador');

  if (Object.values(ranks || {}).some(r => r && r <= 3)) got.add('podio');
  if (videoGenerated) got.add('cineasta');
  return BADGES.filter(b => got.has(b.id));
}

// Tudo o que é preciso para mostrar o progresso de uma pessoa em uma campanha
export async function loadCampaignProgress(participantId, campaignId) {
  const [s, m, a, r, e] = await Promise.all([
    supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participantId).eq('mission.campaign_id', campaignId),
    supabase.from('tw_missions').select('*').eq('campaign_id', campaignId).eq('active', true),
    supabase.from('tw_artists').select('id', { count: 'exact', head: true }).eq('campaign_id', campaignId).eq('active', true),
    supabase.from('tw_ranking').select('participant_id, track, points').eq('campaign_id', campaignId).order('points', { ascending: false }).order('last_at'),
    supabase.from('tw_events').select('id').eq('participant_id', participantId).eq('campaign_id', campaignId).eq('type', 'video_generated').limit(1),
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
    points[track] = pos >= 0 ? list[pos].points : sumPoints(approved, missions, track);
  });
  const badges = computeBadges({ approved, missions, artistsCount: a.count || 0, ranks, videoGenerated: (e.data || []).length > 0 });
  return { subs, approved, missions, ranks, points, badges, artistsCount: a.count || 0 };
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
