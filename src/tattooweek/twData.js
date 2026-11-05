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

export async function loadPartners() {
  const { data } = await supabase.from('tw_partners').select('*').order('created_at');
  if (!data?.length) return DEFAULT_PARTNERS;
  return Object.fromEntries(data.map(p => [p.id, p]));
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

export async function submitMission({ participant, mission, artistId, files, note, answer }) {
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
  };
  const { data, error } = await supabase.from('tw_submissions').insert([row]).select().single();
  if (error) {
    if (error.code === '23505') throw new Error('Você já enviou esta missão.');
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
