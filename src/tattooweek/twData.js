import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

export const ADMIN_EMAILS = ['yurilojavirtual@gmail.com'];

// url vazia = sem botão de link (preencha com o site oficial do parceiro)
export const PARTNERS = {
  bronc: { name: 'Bronc', url: '', color: '#e4572e', role: 'Desafios técnicos e produtos para premiação' },
  stencilflow: { name: 'STENCILFLOW', url: 'https://stencilflowapp.com.br', color: '#00ff80', role: 'Desafios criativos e acesso Pro' },
  inkauthority: { name: 'Ink Authority', url: '', color: '#7aa2ff', role: 'Desafios educativos e aulas' },
  mestres: { name: 'Mestres da Tattoo', url: '/', color: '#eec358', role: 'Idealização e realização' },
};

export const DAY_NAMES = { 1: 'A chegada', 2: 'A conexão', 3: 'A despedida' };

export const CATEGORY_LABELS = {
  networking: 'Networking',
  conteudo: 'Conteúdo',
  passaporte: 'Passaporte NFC',
  parceiros: 'Parceiros',
  surpresa: 'Missão surpresa',
  secreta: 'Missão secreta',
  dia: 'Missão do dia',
};

export const DAY_BONUS = 50;

export function isAdmin(user) {
  return ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress);
}

// --- Config ---

export async function loadConfig() {
  const { data } = await supabase.from('tw_config').select('*');
  const cfg = { event_days: ['2026-11-20', '2026-11-21', '2026-11-22'], unlock_all: false, music_url: '' };
  (data || []).forEach(row => { cfg[row.key] = row.value; });
  return cfg;
}

export async function saveConfig(key, value) {
  return supabase.from('tw_config').upsert({ key, value });
}

// Dia liberado = a data do dia já chegou (horário local) ou o admin liberou tudo.
export function isDayUnlocked(cfg, day) {
  if (cfg.unlock_all) return true;
  const date = cfg.event_days?.[day - 1];
  if (!date) return false;
  return new Date() >= new Date(`${date}T00:00:00`);
}

export function currentDay(cfg) {
  for (let d = 3; d >= 1; d--) {
    if (isDayUnlocked(cfg, d)) return d;
  }
  return 1;
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
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('tw_participants').select('*').eq('clerk_id', user.id).maybeSingle();
    setParticipant(data || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) reload();
    else setLoading(false);
  }, [isLoaded, isSignedIn, user, reload]);

  return { user, isSignedIn, loading: !isLoaded || loading, participant, setParticipant, reload };
}

export async function trackEvent(type, ref, participantId) {
  await supabase.from('tw_events').insert([{ type, ref, participant_id: participantId || null }]);
}

// --- Upload ---

const MAX_VIDEO_MB = 50;

// Reduz fotos do celular para ~1600px: o upload fica rápido no 4G da convenção.
function compressImage(file, maxSize = 1600, quality = 0.82) {
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

export async function uploadMedia(file, participantId, missionId) {
  const isVideo = file.type.startsWith('video/');
  if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`Vídeo muito grande (máx. ${MAX_VIDEO_MB}MB). Grave um trecho mais curto.`);
  }
  const body = isVideo ? file : await compressImage(file);
  const ext = isVideo ? (file.name.split('.').pop() || 'mp4').toLowerCase() : 'jpg';
  const path = `${participantId}/${missionId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('tattooweek').upload(path, body, {
    contentType: isVideo ? file.type : 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('tattooweek').getPublicUrl(path);
  return { url: data.publicUrl, path, type: isVideo ? 'video' : 'image' };
}

export async function submitMission({ participant, mission, artistId, files, note }) {
  const media = [];
  for (const f of files) {
    media.push(await uploadMedia(f, participant.id, mission.id));
  }
  // Envio recusado pode ser refeito: remove o antigo antes de inserir o novo
  let old = supabase.from('tw_submissions').delete()
    .eq('participant_id', participant.id).eq('mission_id', mission.id).eq('status', 'rejected');
  old = artistId ? old.eq('artist_id', artistId) : old.is('artist_id', null);
  await old;

  const auto = mission.approval === 'auto';
  const row = {
    participant_id: participant.id,
    mission_id: mission.id,
    artist_id: artistId || null,
    media,
    note: note || null,
    status: auto ? 'approved' : 'pending',
    points: auto ? mission.points : 0,
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
