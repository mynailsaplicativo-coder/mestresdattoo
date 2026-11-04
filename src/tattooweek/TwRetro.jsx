import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, Download, Share2, Loader2, Film } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate } from './TwShell';
import { useTwParticipant, loadConfig, isAdmin, trackEvent, DAY_NAMES } from './twData';

// Vídeo vertical 720x1280, ~30–60s: abertura, dia 1, dia 2, dia 3, encerramento.
const W = 720;
const H = 1280;
const GOLD = '#eec358';
const MAX_MEDIA = 20;
const IMAGE_SEC = 2.2;
const VIDEO_SEC = 4;

export default function TwRetro() {
  const tw = useTwParticipant();
  const [params] = useSearchParams();
  const adminView = params.get('p') && isAdmin(tw.user);

  return (
    <TwShell>
      {adminView
        ? <RetroLoader participantId={params.get('p')} />
        : (
          <JoinGate tw={tw} mode="public">
            {tw.participant && <RetroLoader participantId={tw.participant.id} />}
          </JoinGate>
        )}
    </TwShell>
  );
}

function RetroLoader({ participantId }) {
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    (async () => {
      const [cfg, p, s] = await Promise.all([
        loadConfig(),
        supabase.from('tw_participants').select('*').eq('id', participantId).single(),
        supabase.from('tw_submissions').select('*, mission:tw_missions(*)').eq('participant_id', participantId).eq('status', 'approved').order('created_at'),
      ]);
      const dayOf = (sub) => {
        if (sub.mission?.day) return sub.mission.day;
        const d = sub.created_at.slice(0, 10);
        const idx = (cfg.event_days || []).indexOf(d);
        return idx >= 0 ? idx + 1 : 3;
      };
      const byDay = { 1: [], 2: [], 3: [] };
      (s.data || []).forEach(sub => {
        (sub.media || []).forEach(m => byDay[dayOf(sub)]?.push({ ...m, caption: sub.mission?.title }));
      });
      // Limita a ~20 registros, distribuídos entre os dias
      const total = byDay[1].length + byDay[2].length + byDay[3].length;
      if (total > MAX_MEDIA) {
        [1, 2, 3].forEach(d => {
          const keep = Math.max(1, Math.round((byDay[d].length / total) * MAX_MEDIA));
          const step = byDay[d].length / keep;
          byDay[d] = byDay[d].length ? Array.from({ length: keep }, (_, i) => byDay[d][Math.floor(i * step)]) : [];
        });
      }
      setState({ participant: p.data, byDay, total, musicUrl: cfg.music_url });
    })();
  }, [participantId]);

  if (!state) return <div className="tw-center-screen">Montando sua retrospectiva...</div>;

  if (state.total === 0) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 380 }}>
          <Film size={48} color="var(--tw-gold)" />
          <h1 className="tw-h2" style={{ marginTop: '1rem' }}>Seu vídeo começa aqui</h1>
          <p className="tw-p" style={{ margin: '0.5rem 0 1.5rem' }}>Cumpra as missões do Meu Tattoo Week. Cada foto ou vídeo aprovado vira uma cena da sua retrospectiva.</p>
          <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => navigate('/tattooweek/meu')}>Ir para as missões</button>
        </div>
      </div>
    );
  }

  return <RetroPlayer {...state} />;
}

function buildScenes(byDay, name, branded) {
  const scenes = [{ kind: 'intro', dur: 2.6, name }];
  [1, 2, 3].forEach(d => {
    if (!byDay[d].length) return;
    scenes.push({ kind: 'day', dur: 1.8, day: d });
    byDay[d].forEach(m => scenes.push({ kind: m.type, dur: m.type === 'video' ? VIDEO_SEC : IMAGE_SEC, media: m }));
  });
  scenes.push({ kind: 'outro', dur: 3.2, branded });
  let t = 0;
  scenes.forEach(s => { s.start = t; t += s.dur; });
  return { scenes, total: t };
}

function loadAsset(m) {
  return new Promise((resolve) => {
    if (m.type === 'video') {
      const v = document.createElement('video');
      v.crossOrigin = 'anonymous';
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.src = m.url;
      v.onloadeddata = () => resolve(v);
      v.onerror = () => resolve(null);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = m.url;
    }
  });
}

function drawCover(ctx, el, zoom = 1) {
  const sw = el.videoWidth || el.naturalWidth || el.width;
  const sh = el.videoHeight || el.naturalHeight || el.height;
  if (!sw || !sh) return;
  const scale = Math.max(W / sw, H / sh) * zoom;
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(el, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

function text(ctx, str, x, y, size, color = '#fff', weight = 900, align = 'center') {
  ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
}

function wrap(ctx, str, maxW) {
  const words = (str || '').split(' ');
  const lines = [];
  let line = '';
  words.forEach(w => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

function RetroPlayer({ participant, byDay, musicUrl }) {
  const canvasRef = useRef(null);
  const assetsRef = useRef(new Map());
  const logoRef = useRef(null);
  const rafRef = useRef(0);
  const clockRef = useRef({ startedAt: 0, offset: 0 });
  const recRef = useRef(null);
  const audioRef = useRef(null);
  const activeVideoRef = useRef(null);

  const [branded, setBranded] = useState(true);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [output, setOutput] = useState(null);

  const { scenes, total } = useMemo(() => buildScenes(byDay, participant?.name || '', branded), [byDay, participant?.name, branded]);

  useEffect(() => {
    let alive = true;
    const all = [1, 2, 3].flatMap(d => byDay[d]);
    const logo = new Image();
    logo.src = '/fotos artistas/logo mestres.png';
    logoRef.current = logo;
    Promise.all(all.map(async m => [m.url, await loadAsset(m)])).then(entries => {
      if (!alive) return;
      entries.forEach(([url, el]) => el && assetsRef.current.set(url, el));
      setReady(true);
    });
    return () => { alive = false; };
  }, [byDay]);

  const draw = useCallback((t, showBars) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const scene = scenes.find(s => t >= s.start && t < s.start + s.dur) || scenes[scenes.length - 1];
    const local = t - scene.start;
    const p = Math.min(1, local / scene.dur);
    const fadeIn = Math.min(1, local / 0.35);

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, W, H);

    if (scene.kind === 'image' || scene.kind === 'video') {
      const el = assetsRef.current.get(scene.media.url);
      if (scene.kind === 'video' && el) {
        if (activeVideoRef.current !== el) {
          activeVideoRef.current?.pause();
          activeVideoRef.current = el;
          el.currentTime = 0;
          el.play().catch(() => {});
        }
      } else if (activeVideoRef.current) {
        activeVideoRef.current.pause();
        activeVideoRef.current = null;
      }
      ctx.globalAlpha = fadeIn;
      if (el) drawCover(ctx, el, scene.kind === 'image' ? 1 + 0.08 * p : 1);
      ctx.globalAlpha = 1;
      const g = ctx.createLinearGradient(0, H * 0.7, 0, H);
      g.addColorStop(0, 'rgba(5,6,8,0)');
      g.addColorStop(1, 'rgba(5,6,8,0.85)');
      ctx.fillStyle = g;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);
      if (scene.media.caption) {
        ctx.font = '800 34px Inter, system-ui, sans-serif';
        const lines = wrap(ctx, scene.media.caption, W - 120);
        lines.slice(0, 3).forEach((l, i) => text(ctx, l, 60, H - 110 - (lines.length - 1 - i) * 44, 34, '#fff', 800, 'left'));
      }
    } else {
      if (activeVideoRef.current) { activeVideoRef.current.pause(); activeVideoRef.current = null; }
      ctx.globalAlpha = fadeIn;
      if (scene.kind === 'intro') {
        if (logoRef.current?.complete && logoRef.current.naturalWidth) {
          const lw = 320;
          const lh = lw * (logoRef.current.naturalHeight / logoRef.current.naturalWidth);
          ctx.drawImage(logoRef.current, (W - lw) / 2, 330, lw, lh);
        }
        text(ctx, 'MEU', W / 2, 640, 64, GOLD);
        text(ctx, 'TATTOO WEEK', W / 2, 730, 92);
        text(ctx, (scene.name || '').toUpperCase(), W / 2, 830, 40, 'rgba(255,255,255,0.7)', 700);
      } else if (scene.kind === 'day') {
        text(ctx, `DIA ${scene.day}`, W / 2, 600, 150, GOLD);
        text(ctx, DAY_NAMES[scene.day].toUpperCase(), W / 2, 700, 56);
      } else if (scene.kind === 'outro') {
        text(ctx, 'TATTOO WEEK', W / 2, 560, 80);
        text(ctx, 'EXPERIENCE', W / 2, 640, 80, GOLD);
        text(ctx, 'uma realização Mestres da Tattoo', W / 2, 730, 32, 'rgba(255,255,255,0.75)', 600);
        if (scene.branded) {
          text(ctx, 'BRONC  ·  STENCILFLOW  ·  INK AUTHORITY', W / 2, 1080, 26, 'rgba(255,255,255,0.5)', 800);
        }
      }
      ctx.globalAlpha = 1;
    }

    if (showBars) {
      const gap = 6;
      const bw = (W - 48 - gap * (scenes.length - 1)) / scenes.length;
      scenes.forEach((s, i) => {
        const x = 24 + i * (bw + gap);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(x, 24, bw, 5);
        const fill = t >= s.start + s.dur ? 1 : t < s.start ? 0 : (t - s.start) / s.dur;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, 24, bw * fill, 5);
      });
    }
  }, [scenes]);

  // Primeiro quadro
  useEffect(() => { if (ready) draw(0, true); }, [ready, draw]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    activeVideoRef.current?.pause();
    activeVideoRef.current = null;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const loop = useCallback((showBars, onEnd) => {
    const t = clockRef.current.offset + (performance.now() - clockRef.current.startedAt) / 1000;
    if (t >= total) {
      draw(total - 0.01, showBars);
      clockRef.current.offset = 0;
      stop();
      onEnd?.();
      return;
    }
    draw(t, showBars);
    rafRef.current = requestAnimationFrame(() => loop(showBars, onEnd));
  }, [draw, total, stop]);

  const play = () => {
    clockRef.current.startedAt = performance.now();
    setPlaying(true);
    loop(true);
  };

  const pause = () => {
    clockRef.current.offset += (performance.now() - clockRef.current.startedAt) / 1000;
    stop();
  };

  const record = async () => {
    setOutput(null);
    setRecording(true);
    const stream = canvasRef.current.captureStream(30);

    if (musicUrl) {
      try {
        const audio = new Audio(musicUrl);
        audio.crossOrigin = 'anonymous';
        audioRef.current = audio;
        const actx = new AudioContext();
        const src = actx.createMediaElementSource(audio);
        const dest = actx.createMediaStreamDestination();
        src.connect(dest);
        src.connect(actx.destination);
        dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
        await audio.play();
      } catch { /* sem trilha: grava só o vídeo */ }
    }

    const mime = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => window.MediaRecorder?.isTypeSupported?.(m));
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined);
    const chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const type = rec.mimeType || 'video/webm';
      const blob = new Blob(chunks, { type });
      const ext = type.includes('mp4') ? 'mp4' : 'webm';
      setOutput({ url: URL.createObjectURL(blob), blob, ext, type });
      setRecording(false);
      trackEvent('video_generated', branded ? 'branded' : 'clean', participant?.id);
    };
    recRef.current = rec;
    rec.start(250);
    clockRef.current = { startedAt: performance.now(), offset: 0 };
    setPlaying(true);
    loop(false, () => setTimeout(() => rec.state !== 'inactive' && rec.stop(), 300));
  };

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); audioRef.current?.pause(); }, []);

  const fileName = `meu-tattoo-week.${output?.ext}`;
  const canShareFile = output && navigator.canShare?.({ files: [new File([output.blob], fileName, { type: output.type })] });

  const share = async () => {
    try {
      await navigator.share({ files: [new File([output.blob], fileName, { type: output.type })], title: 'Meu Tattoo Week' });
      trackEvent('video_shared', 'native', participant?.id);
    } catch { /* usuário cancelou */ }
  };

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <span className="tw-kicker">Minha retrospectiva</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>Meu Tattoo Week</h1>

      <div className="tw-retro-stage">
        <canvas ref={canvasRef} width={W} height={H} />
        {!ready && <div className="tw-retro-tap"><Loader2 className="tw-spin" size={36} /></div>}
        {ready && !playing && !recording && (
          <button className="tw-retro-tap" onClick={play} aria-label="Assistir"><Play size={64} /></button>
        )}
        {playing && !recording && <button className="tw-retro-tap" style={{ background: 'transparent' }} onClick={pause} aria-label="Pausar" />}
      </div>

      <div className="tw-stack" style={{ marginTop: '1rem' }}>
        <div className="tw-row" style={{ justifyContent: 'center' }}>
          {playing && !recording
            ? <button className="tw-btn tw-btn-ghost tw-btn-sm" onClick={pause}><Pause size={16} /> Pausar</button>
            : <button className="tw-btn tw-btn-ghost tw-btn-sm" onClick={play} disabled={!ready || recording}><Play size={16} /> Assistir</button>}
          <span className="tw-p" style={{ fontSize: '0.8rem' }}>{Math.round(total)}s</span>
        </div>

        <label className="tw-check">
          <input type="checkbox" checked={!branded} onChange={e => setBranded(!e.target.checked)} disabled={recording} />
          <span>Versão pessoal: sem a assinatura dos parceiros no final.</span>
        </label>

        {!output && (
          <button className="tw-btn tw-btn-primary tw-btn-block" onClick={record} disabled={!ready || recording || !window.MediaRecorder}>
            {recording ? <><Loader2 size={18} className="tw-spin" /> Gravando seu vídeo… ({Math.round(total)}s)</> : <><Film size={18} /> Gerar meu vídeo</>}
          </button>
        )}
        {recording && <p className="tw-p" style={{ fontSize: '0.8rem', textAlign: 'center' }}>Mantenha esta tela aberta até terminar.</p>}
        {!window.MediaRecorder && <div className="tw-notice">Seu navegador não grava vídeo. Atualize o navegador ou abra no Chrome/Safari.</div>}

        {output && (
          <div className="tw-card tw-card-gold tw-stack">
            <h3 className="tw-h3">Seu vídeo está pronto 🎬</h3>
            <video src={output.url} controls playsInline style={{ width: '100%', borderRadius: 10, maxHeight: 420, background: '#000' }} />
            {canShareFile && <button className="tw-btn tw-btn-primary tw-btn-block" onClick={share}><Share2 size={18} /> Compartilhar</button>}
            <a className="tw-btn tw-btn-block" href={output.url} download={fileName} onClick={() => trackEvent('video_shared', 'download', participant?.id)}><Download size={18} /> Baixar vídeo</a>
            <button className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setOutput(null)}>Gerar de novo</button>
          </div>
        )}
      </div>
    </div>
  );
}
