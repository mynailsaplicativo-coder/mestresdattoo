import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

export const ADMIN_EMAILS = ['yurilojavirtual@gmail.com'];

// Usado só se a tabela tw_partners estiver vazia
export const DEFAULT_PARTNERS = {
  bronc: { id: 'bronc', name: 'Bronc', url: '', color: '#e4572e', role: 'Desafios técnicos e produtos para premiação' },
  stencilflow: { id: 'stencilflow', name: 'STENCILFLOW', url: 'https://stencilflowapp.com.br', color: '#00ff80', role: 'Desafios criativos e acesso Pro' },
  inkauthority: { id: 'inkauthority', name: 'Ink Authority', url: '', color: '#7aa2ff', role: 'Desafios educativos e aulas' },
  mestres: { id: 'mestres', name: 'Mestres da Tattoo', url: '/', color: '#eec358', role: 'Idealização e realização' },
};

export const DEFAULT_DAY_NAMES = { 1: 'A chegada', 2: 'A conexão', 3: 'A despedida' };

export const CATEGORY_LABELS = {
  networking: 'Networking',
  conteudo: 'Conteúdo',
  passaporte: 'Passaporte NFC',
  parceiros: 'Parceiros',
  surpresa: 'Missão surpresa',
  secreta: 'Missão secreta',
  dia: 'Missão do dia',
  geral: 'Missão',
  quiz: 'Pergunta',
  selo: 'Selo secreto',
};

// Tipos de adesivo NFC
export const NFC_KINDS = {
  point: 'Ponto NFC',
  secret: 'Selo secreto',
  activation: 'Ativação do Artist Challenge',
};

// --- Respostas de perguntas: só o hash fica no banco ---

export function normalizeAnswer(s) {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/@/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function hashAnswer(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalizeAnswer(s)));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Várias respostas aceitas separadas por ";" (ex.: "Fulano Silva; Fulano")
export async function hashAnswers(text) {
  const list = (text || '').split(';').map(x => x.trim()).filter(Boolean);
  return (await Promise.all(list.map(hashAnswer))).join(',');
}

export async function checkAnswer(mission, answer) {
  if (!mission.answer_hash) return true;
  const h = await hashAnswer(answer);
  return mission.answer_hash.split(',').includes(h);
}

export const DAY_BONUS = 50;

export function isAdmin(user) {
  return ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress);
}

// --- Campanha ---

export const CampaignContext = createContext(null);

export function useCampaign() {
  return useContext(CampaignContext);
}

// A Tattoo Week mantém /tattooweek (URL gravada nos adesivos NFC); as demais ficam em /desafios/<slug>
export function campaignBase(c) {
  return c.slug === 'tattooweek' ? '/tattooweek' : `/desafios/${c.slug}`;
}

// Instagram oficial dos parceiros (conferidos no Instagram). O @ salvo no admin tem prioridade.
const PARTNER_INSTAGRAM = {
  mestres: '@mestresdatattoo',
  stencilflow: '@stencilflowapp',
  inkauthority: '@inkauthorityacademy',
  tcm: '@tcmsupply',
  bronc: '@bronc_oficial_brasil',
  tattooweek: '@tattooweek',
};

// Logos dos parceiros (o logo salvo no admin tem prioridade). dark = logo claro, vai em fundo escuro
export const PARTNER_LOGOS = {
  bronc: { src: '/tattooweek/parceiros/bronc.png', dark: true },
  stencilflow: { src: '/tattooweek/parceiros/stencilflow.jpg', dark: true, square: true },
  inkauthority: { src: '/tattooweek/parceiros/inkauthority.svg' },
  mestres: { src: '/fotos artistas/logo mestres.png', dark: true },
};

const PARTNER_SITES = {
  inkauthority: 'https://www.inkauthority.com.br',
  stencilflow: 'https://stencilflowapp.com.br',
};

export async function loadPartners() {
  const { data } = await supabase.from('tw_partners').select('*').order('created_at');
  if (!data?.length) return DEFAULT_PARTNERS;
  return Object.fromEntries(data.map(p => [p.id, { ...p, instagram: p.instagram || PARTNER_INSTAGRAM[p.id] || null, logo_url: p.logo_url || PARTNER_LOGOS[p.id]?.src || null, url: p.url || PARTNER_SITES[p.id] || '' }]));
}

export async function loadCampaign(slug) {
  const [c, partners] = await Promise.all([
    supabase.from('tw_campaigns').select('*').eq('slug', slug).maybeSingle(),
    loadPartners(),
  ]);
  return c.data ? { campaign: c.data, partners } : null;
}

export function dayName(c, d) {
  return c?.day_names?.[d] || DEFAULT_DAY_NAMES[d];
}

export function campaignPartners(c, partners) {
  return (c?.partners || []).map(id => partners[id]).filter(Boolean);
}

// Dia liberado = a data do dia já chegou (horário local) ou o admin liberou tudo.
export function isDayUnlocked(c, day) {
  if (c.unlock_all) return true;
  const date = c.event_days?.[day - 1];
  if (!date) return false;
  return new Date() >= new Date(`${date}T00:00:00`);
}

export function currentDay(c) {
  for (let d = 3; d >= 1; d--) {
    if (isDayUnlocked(c, d)) return d;
  }
  return 1;
}

export function formatDays(c) {
  const days = (c.event_days || []).filter(Boolean);
  if (!days.length) return '';
  const fmt = (d, opts) => new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR', opts);
  if (days.length === 1) return fmt(days[0], { day: '2-digit', month: 'long', year: 'numeric' });
  return `${fmt(days[0], { day: '2-digit' })} a ${fmt(days[days.length - 1], { day: '2-digit', month: 'long', year: 'numeric' })}`;
}

// Missões surpresa só aparecem dentro da janela starts_at/ends_at.
export function isMissionLive(m, now = new Date()) {
  if (!m.active) return false;
  if (m.starts_at && now < new Date(m.starts_at)) return false;
  if (m.ends_at && now > new Date(m.ends_at)) return false;
  return true;
}

// --- Participante logado ---

export function useTwParticipant() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [participant, setParticipant] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('tw_participants').select('*').eq('clerk_id', user.id).maybeSingle();
    setParticipant(data || null);
    if (data) {
      const e = await supabase.from('tw_enrollments').select('*').eq('participant_id', data.id);
      setEnrollments(e.data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) reload();
    else setLoading(false);
  }, [isLoaded, isSignedIn, user, reload]);

  const isEnrolled = (campaignId, track) => enrollments.some(e => e.campaign_id === campaignId && e.track === track);

  return { user, isSignedIn, loading: !isLoaded || loading, participant, setParticipant, enrollments, setEnrollments, isEnrolled, reload };
}

export async function trackEvent(type, ref, participantId, campaignId) {
  await supabase.from('tw_events').insert([{ type, ref, participant_id: participantId || null, campaign_id: campaignId || null }]);
}

// --- Upload ---

const MAX_VIDEO_MB = 50;

// Reduz fotos do celular para ~1600px: o upload fica rápido no 4G da convenção.
export function compressImage(file, maxSize = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(blob || file);
      }, 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export async function uploadMedia(file, folder) {
  const isVideo = file.type.startsWith('video/');
  if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`Vídeo muito grande (máx. ${MAX_VIDEO_MB}MB). Grave um trecho mais curto.`);
  }
  const body = isVideo ? file : await compressImage(file);
  const ext = isVideo ? (file.name.split('.').pop() || 'mp4').toLowerCase() : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('tattooweek').upload(path, body, {
    contentType: isVideo ? file.type : 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('tattooweek').getPublicUrl(path);
  return { url: data.publicUrl, path, type: isVideo ? 'video' : 'image' };
}

export async function submitMission({ participant, mission, artistId, files, note, answer, postUrl }) {
  // Pergunta: confere antes de subir qualquer arquivo
  if (mission.answer_hash && !(await checkAnswer(mission, answer))) {
    throw new Error('Resposta incorreta. Investigue mais e tente de novo!');
  }
  if (answer) note = [`Resposta: ${answer}`, note].filter(Boolean).join(' · ');

  const media = [];
  for (const f of files) {
    media.push(await uploadMedia(f, `${participant.id}/${mission.id}`));
  }
  // Envio recusado pode ser refeito: remove o antigo antes de inserir o novo
  let old = supabase.from('tw_submissions').delete()
    .eq('participant_id', participant.id).eq('mission_id', mission.id).eq('status', 'rejected');
  old = artistId ? old.eq('artist_id', artistId) : old.is('artist_id', null);
  await old;

  // Todo envio entra aprovado na hora; a equipe só recusa depois, se precisar
  const row = {
    participant_id: participant.id,
    mission_id: mission.id,
    artist_id: artistId || null,
    media,
    note: note || null,
    status: 'approved',
    points: mission.points,
    reviewed_at: new Date().toISOString(),
    ...(postUrl ? { post_url: postUrl } : {}),
    // Missão diária do tatuador: vale de novo no dia seguinte
    ...(isDailyMission(mission) ? { play_day: todaySP() } : {}),
  };
  let { data, error } = await supabase.from('tw_submissions').insert([row]).select().single();
  if (error && row.play_day && /play_day/.test(error.message || '')) {
    // Banco ainda sem a coluna play_day (SQL da fase 11 não rodado): envia sem ela
    delete row.play_day;
    ({ data, error } = await supabase.from('tw_submissions').insert([row]).select().single());
  }
  if (error) {
    if (error.code === '23505') throw new Error(isDailyMission(mission) ? 'Você já fez esta missão hoje. Amanhã ela vale de novo!' : 'Você já enviou esta missão.');
    throw error;
  }
  return data;
}

export function instagramUrl(handle) {
  if (!handle) return null;
  return `https://instagram.com/${handle.replace(/^@/, '').trim()}`;
}

export function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!target) return null;
  const ms = Math.max(0, new Date(target).getTime() - now);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

// --- Equipe ---

// 'admin' | 'moderator' | null (undefined enquanto carrega). A lista ADMIN_EMAILS sempre é admin.
export function useStaffRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(undefined);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  useEffect(() => {
    if (!isLoaded) return;
    if (!email) { setRole(null); return; }
    if (ADMIN_EMAILS.includes(email)) { setRole('admin'); return; }
    supabase.from('tw_staff').select('role').eq('email', email).maybeSingle()
      .then(({ data }) => setRole(data?.role || null));
  }, [isLoaded, email]);

  return role;
}

// Bônus/penalidades manuais por trilha (tabela pode não existir antes do SQL da fase 4)
export async function loadAdjustments(participantId, campaignId) {
  const { data } = await supabase.from('tw_adjustments').select('track, points').eq('participant_id', participantId).eq('campaign_id', campaignId);
  const out = { public: 0, artist: 0 };
  (data || []).forEach(a => { out[a.track] = (out[a.track] || 0) + a.points; });
  return out;
}

// --- Tema visual por campanha ---

export const DEFAULT_THEME = {
  primary: '#eec358', primaryStrong: '#ffcc0d', primaryDeep: '#d4a000',
  bg: '#050608', card: '#0d0f13', card2: '#14171d',
  accents: [],
};

// Paleta do Instagram da Tattoo Week: degradê pastel lilás/rosa/ciano, amarelo forte e azul-marinho/roxo
export const PRESET_THEMES = {
  tattooweek: {
    style: 'poster', // mundo claro de pôster (poster.css)
    primary: '#f4e14d', primaryStrong: '#fff176', primaryDeep: '#e3b81f',
    bg: '#0c0a24', card: '#16133a', card2: '#201c4f',
    accents: ['#a995ff', '#ff8fd8', '#7fe7f2'],
  },
};

export function campaignTheme(c) {
  return { ...DEFAULT_THEME, ...(PRESET_THEMES[c?.slug] || {}), ...(c?.theme || {}) };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// Variáveis CSS aplicadas na raiz das páginas da campanha
export function themeStyle(t) {
  const a = t.accents?.length ? t.accents : [t.primary, t.primary, t.primary];
  return {
    '--tw-gold': t.primary,
    '--tw-gold-rgb': hexToRgb(t.primary),
    '--tw-gold-strong': t.primaryStrong,
    '--tw-gold-deep': t.primaryDeep,
    '--tw-bg': t.bg,
    '--tw-bg-rgb': hexToRgb(t.bg),
    '--tw-card': t.card,
    '--tw-card-2': t.card2,
    '--tw-accent-1': a[0],
    '--tw-accent-2': a[1] || a[0],
    '--tw-accent-3': a[2] || a[0],
  };
}

// Leitura do adesivo de ativação guardada no navegador (ativa assim que a pessoa entrar no Challenge)
export function activationKey(campaignId) {
  return `tw-activation-${campaignId}`;
}

// Data de hoje no fuso de São Paulo (YYYY-MM-DD), igual ao ranking do dia no banco
export function todaySP() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

// Selos de escoteiro: ícones e cores disponíveis no admin (desenho em TwArt.jsx)
export const SEAL_ICON_KEYS = ['door', 'megaphone', 'flame', 'search', 'crown', 'eye', 'pen', 'heart', 'stencil', 'book', 'map', 'users', 'mic', 'lightbulb', 'utensils', 'music', 'star', 'camera', 'zap', 'key'];
export const SEAL_COLORS = ['#a995ff', '#ff8fd8', '#7fe7f2', '#f4e14d', '#ff6fa8', '#f07c2a', '#8be3a5'];

// Selos de escoteiro de uma trilha: um por nome de selo, ganho se alguma missão dele foi aprovada
export function sealItems(missions, approved) {
  const done = new Set(approved.map(s => s.mission_id));
  const map = new Map();
  missions.filter(m => m.seal_name).forEach(m => {
    const cur = map.get(m.seal_name) || { key: m.seal_name, name: m.seal_name, icon: m.seal_icon, color: m.seal_color, hint: m.title, earned: false };
    if (done.has(m.id)) cur.earned = true;
    map.set(m.seal_name, cur);
  });
  return [...map.values()].sort((a, b) => Number(b.earned) - Number(a.earned));
}

// Mapa do jogo: o enviado no admin ou, na Tattoo Week, o mapa oficial que já vem no site
export function campaignMap(c) {
  return c?.map_image || (c?.slug === 'tattooweek' ? '/tattooweek/mapa-tattooweek.webp' : '');
}

// Pinos do mapa oficial da Tattoo Week (posições em % da imagem). Ao subir outro mapa no admin, valem os pinos do admin.
const TATTOOWEEK_PINS = [
  { label: 'Stand Bronc · cadastro dos artistas', x: 18.8, y: 49, kind: 'bronc' },
  { label: 'Palco', x: 84.5, y: 31, kind: 'stage' },
  { label: 'Entrada', x: 11.5, y: 42, kind: 'info' },
  { label: 'Alimentação · missão Comilão', x: 87, y: 59, kind: 'star' },
];

export function campaignPins(c) {
  if (c?.map_image) return Array.isArray(c.map_pins) ? c.map_pins : [];
  return c?.slug === 'tattooweek' ? TATTOOWEEK_PINS : [];
}

// Medalhões dourados dos selos secretos (public/tattooweek/art/secreto-<nome>.webp)
const SECRET_ART = new Set(['dragao', 'macaco', 'imperador', 'oni', 'caveira', 'tigre']);

export function secretArt(slug) {
  const key = (slug || '').replace(/^selo-/, '');
  return SECRET_ART.has(key) ? `/tattooweek/art/secreto-${key}.webp` : null;
}

// --- Kit do dia (Artist Challenge) ---
// Cada dia do evento tem ranking próprio. O kit vai para o tatuador com mais pontos no dia
// que já tenha TODOS os selos secretos. Quem ganhou um dia não participa mais.

export const DEFAULT_KIT = ['1 impressora de stencil Bronc', '10 mil pontos de crédito no app E-Bronc'];
export const PRIZE_SHORT = '1 impressora Bronc + 10 mil pontos no app E-Bronc';
export const KIT_IMAGE = '/tattooweek/bronc/impressora.jpg';

// Brinde do público: chaveiros exclusivos da Bronc, enquanto durarem
export const PUBLIC_GIFT = {
  id: 'bronc-chaveiro',
  campaign: 'tattooweek-2026',
  title: 'Chaveiro exclusivo Bronc',
  total: 200,
  image: '/tattooweek/bronc/chaveiro-produto.jpg',
};

export const hasGift = (c) => c?.id === PUBLIC_GIFT.campaign;

// Selo premiado: quem do público encostar nesse selo secreto ganha o chaveiro (definido no admin / SQL)
export const isGiftSeal = (c, tag) => hasGift(c) && !!c?.gift_seal_slug && tag?.slug === c.gift_seal_slug;

export async function giftStatus(campaignId, participantId) {
  const [all, mine] = await Promise.all([
    supabase.from('tw_events').select('id', { count: 'exact', head: true }).eq('campaign_id', campaignId).eq('type', 'gift_claim').eq('ref', PUBLIC_GIFT.id),
    participantId
      ? supabase.from('tw_events').select('id, created_at').eq('campaign_id', campaignId).eq('type', 'gift_claim').eq('ref', PUBLIC_GIFT.id).eq('participant_id', participantId).limit(1)
      : Promise.resolve({ data: [] }),
  ]);
  return { claimed: all.count || 0, left: Math.max(0, PUBLIC_GIFT.total - (all.count || 0)), mine: mine.data?.[0] || null };
}

export async function claimGift(campaignId, participantId) {
  const st = await giftStatus(campaignId, participantId);
  if (st.mine) return st;
  if (st.left <= 0) throw new Error('Os chaveiros acabaram. Valeu por jogar!');
  const { error } = await supabase.from('tw_events').insert([{ type: 'gift_claim', ref: PUBLIC_GIFT.id, participant_id: participantId, campaign_id: campaignId }]);
  if (error) throw error;
  return giftStatus(campaignId, participantId);
}

// Código curto que a equipe confere no stand
export const giftCode = (participantId) => (participantId || '').replace(/-/g, '').slice(0, 6).toUpperCase();

export function kitItems(campaign) {
  const items = campaign?.prize_items || [];
  return items.length ? items : DEFAULT_KIT;
}

export function dateSP(ts) {
  return new Date(ts).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

// Dia de jogo de um envio (envios antigos não têm play_day: usa a data do envio)
export const subDay = (s) => s.play_day || dateSP(s.created_at);

// 1, 2 ou 3 nos dias do evento; null fora deles (antes do evento tudo fica liberado para teste)
export function eventDayNumber(campaign, date = todaySP()) {
  const i = (campaign?.event_days || []).indexOf(date);
  return i >= 0 ? i + 1 : null;
}

// Missões do tatuador que podem ser refeitas a cada dia (o ranking zera todo dia)
export const isDailyMission = (m) => m.track === 'artist' && !['selo', 'passaporte', 'surpresa'].includes(m.category);

// Missão com "Dia" marcado no admin só aparece naquele dia do evento
export function missionForToday(m, campaign) {
  if (!m.day) return true;
  const d = eventDayNumber(campaign);
  return d == null || d === Number(m.day);
}

export async function loadArtistDaily(campaign) {
  const [r, tags, sealSubs] = await Promise.all([
    supabase.from('tw_ranking_daily').select('*').eq('campaign_id', campaign.id).eq('track', 'artist')
      .order('points', { ascending: false }).order('last_at').limit(2000),
    supabase.from('tw_artists').select('id').eq('campaign_id', campaign.id).eq('kind', 'secret').eq('active', true),
    supabase.from('tw_submissions').select('participant_id, artist_id, created_at, mission:tw_missions!inner(category, campaign_id)')
      .eq('mission.campaign_id', campaign.id).eq('mission.category', 'selo').eq('status', 'approved').limit(5000),
  ]);
  const secretIds = new Set((tags.data || []).map(t => t.id));
  const need = secretIds.size;
  // participante → selo → dia em que achou
  const found = {};
  for (const s of sealSubs.data || []) {
    if (!secretIds.has(s.artist_id)) continue;
    const d = dateSP(s.created_at);
    const byP = (found[s.participant_id] ||= {});
    if (!byP[s.artist_id] || d < byP[s.artist_id]) byP[s.artist_id] = d;
  }
  const sealsOf = (pid, upTo) => Object.values(found[pid] || {}).filter(d => !upTo || d <= upTo).length;
  const eligible = (pid, upTo) => sealsOf(pid, upTo) >= need;

  const rows = r.data || [];
  const today = todaySP();
  const days = [...new Set(rows.map(x => x.day))].sort();
  const winners = {};
  const winnerSet = new Set();
  for (const day of days) {
    if (day >= today) break; // o dia de hoje ainda está em disputa
    const w = rows.find(x => x.day === day && !winnerSet.has(x.participant_id) && eligible(x.participant_id, day));
    if (w) { winners[day] = w; winnerSet.add(w.participant_id); }
  }
  // Ranking de um dia sem quem já levou kit em dia anterior
  const rankingOf = (day) => rows.filter(x => x.day === day && !(winnerSet.has(x.participant_id) && winners[day]?.participant_id !== x.participant_id));
  const todayRows = rankingOf(today);
  const leader = todayRows.find(x => eligible(x.participant_id, today)) || null;
  return { need, sealsOf, eligible, winners, winnerSet, rankingOf, todayRows, leader, today };
}

// Recarrega na hora quando entra envio novo (Supabase Realtime) e, de garantia, a cada N segundos
export function useLiveRefresh(key, load, ms = 15000) {
  useEffect(() => {
    let timer = null;
    const soon = () => { clearTimeout(timer); timer = setTimeout(load, 700); };
    load();
    const poll = setInterval(load, ms);
    window.addEventListener('tw-refresh', soon);
    const ch = supabase.channel(`tw-live-${key}-${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tw_submissions' }, soon)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tw_adjustments' }, soon)
      .subscribe();
    return () => { clearInterval(poll); clearTimeout(timer); window.removeEventListener('tw-refresh', soon); supabase.removeChannel(ch); };
  }, [key, load, ms]);
}

// --- Selo secreto lido por quem ainda não está no jogo: fica guardado no celular por 3 h ---
const PENDING_TTL = 3 * 3600 * 1000;
const pendingKey = (cid) => `tw-pending-seals-${cid}`;

export function readPendingSeals(campaignId) {
  try {
    return (JSON.parse(localStorage.getItem(pendingKey(campaignId)) || '[]') || []).filter(x => Date.now() - x.at < PENDING_TTL);
  } catch { return []; }
}

export function savePendingSeal(campaignId, tag) {
  try {
    const list = readPendingSeals(campaignId).filter(x => x.id !== tag.id);
    list.push({ id: tag.id, slug: tag.slug, name: tag.name, at: Date.now() });
    localStorage.setItem(pendingKey(campaignId), JSON.stringify(list));
  } catch { /* sem storage: a pessoa encosta de novo */ }
}

export function clearPendingSeals(campaignId) {
  try { localStorage.removeItem(pendingKey(campaignId)); } catch { /* sem storage */ }
}

// Credita o selo secreto nas trilhas em que a pessoa está inscrita
export async function claimSeal(campaignId, participantId, tracks, tag) {
  const { data: missions } = await supabase.from('tw_missions').select('*').eq('campaign_id', campaignId).eq('category', 'selo').eq('active', true).in('track', tracks);
  let fresh = false;
  let points = 0;
  for (const m of missions || []) {
    const { error } = await supabase.from('tw_submissions').insert([{
      participant_id: participantId, mission_id: m.id, artist_id: tag.id, media: [],
      status: 'approved', points: m.points, note: `Selo secreto: ${tag.name}`, reviewed_at: new Date().toISOString(),
    }]);
    if (!error) { fresh = true; points = Math.max(points, m.points); }
  }
  return { fresh, points };
}

// Quem pegou 3+ selos secretos em menos de 2 minutos (provável link compartilhado)
export async function loadSealSuspects(campaignId) {
  const { data } = await supabase.from('tw_submissions')
    .select('participant_id, artist_id, created_at, participant:tw_participants(name, instagram), mission:tw_missions!inner(category, campaign_id)')
    .eq('mission.campaign_id', campaignId).eq('mission.category', 'selo').limit(5000);
  const by = {};
  for (const s of data || []) {
    const p = (by[s.participant_id] ||= { participant: s.participant, seals: {} });
    const t = new Date(s.created_at).getTime();
    if (!p.seals[s.artist_id] || t < p.seals[s.artist_id]) p.seals[s.artist_id] = t;
  }
  const out = [];
  for (const [pid, p] of Object.entries(by)) {
    const times = Object.values(p.seals).sort((a, b) => a - b);
    let worst = null;
    for (let i = 0; i + 2 < times.length; i++) {
      const span = times[i + 2] - times[i];
      if (span < 120000 && (!worst || span < worst)) worst = span;
    }
    if (worst != null) out.push({ participant_id: pid, name: p.participant?.name, instagram: p.participant?.instagram, seals: times.length, seconds: Math.round(worst / 1000) });
  }
  return out.sort((a, b) => a.seconds - b.seconds);
}

// Avisa as telas abertas para recarregar (ex.: depois de creditar um selo guardado)
export const refreshScreens = () => { try { window.dispatchEvent(new Event('tw-refresh')); } catch { /* sem window */ } };

// Foto de perfil de verdade? (o avatar padrão do Clerk, com as iniciais, não conta)
export function isRealPhoto(url) {
  if (!url) return false;
  const m = url.match(/img\.clerk\.com\/([^/?#]+)/);
  if (!m) return true;
  try { return !/"type":"default"/.test(atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return true; }
}
