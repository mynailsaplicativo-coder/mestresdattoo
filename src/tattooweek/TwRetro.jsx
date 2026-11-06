import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, Download, Share2, Loader2, Film } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate } from './TwShell';
import { useTwParticipant, useCampaign, useStaffRole, trackEvent, dayName, campaignPartners, secretArt } from './twData';
import { loadCampaignProgress } from './badges';
import { W, H, buildScenes, createRenderer, stopRendererVideos } from './retroRender';

const MAX_MEDIA = 14;
const CHARS = ['oni', 'dragao', 'gato', 'caveira', 'tigre'];
const SEAL_ART = new Set(['door', 'megaphone', 'flame', 'search', 'crown', 'eye', 'pen', 'heart', 'stencil', 'book', 'map', 'users', 'mic', 'lightbulb', 'utensils', 'music']);

export default function TwRetro() {
  const tw = useTwParticipant();
  const { campaign } = useCampaign();
  const [params] = useSearchParams();
  const staff = useStaffRole();
  const adminView = params.get('p') && staff;
  // Quem está só no Artist Challenge também tem retrospectiva
  const enrolledArtist = tw.participant && tw.isEnrolled(campaign.id, 'artist');

  return (
    <TwShell>
      {adminView || enrolledArtist
        ? <RetroLoader participantId={adminView ? params.get('p') : tw.participant.id} />
        : (
          <JoinGate tw={tw} track="public">
            {tw.participant && <RetroLoader participantId={tw.participant.id} />}
          </JoinGate>
        )}
    </TwShell>
  );
}

function RetroLoader({ participantId }) {
  const navigate = useNavigate();
  const { campaign: cfg, partners, base } = useCampaign();
  const [state, setState] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, s, progress] = await Promise.all([
        supabase.from('tw_participants').select('*').eq('id', participantId).single(),
        supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*), artist:tw_artists(slug, name)')
          .eq('participant_id', participantId).eq('mission.campaign_id', cfg.id).eq('status', 'approved').order('created_at'),
        loadCampaignProgress(participantId, cfg.id),
      ]);
      const subs = s.data || [];
      const dayOf = (sub) => {
        if (sub.mission?.day) return sub.mission.day;
        const d = new Date(sub.created_at).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
        const idx = (cfg.event_days || []).indexOf(d);
        return idx >= 0 ? idx + 1 : 1;
      };
      // Momentos: uma foto/vídeo por missão (o primeiro registro), com o selo da missão
      const byDay = { 1: [], 2: [], 3: [] };
      subs.forEach(sub => {
        const m = (sub.media || [])[0];
        if (!m) return;
        const seal = sub.mission?.seal_name && SEAL_ART.has(sub.mission.seal_icon) ? { name: sub.mission.seal_name, icon: sub.mission.seal_icon } : null;
        byDay[dayOf(sub)].push({ ...m, caption: sub.mission?.title, seal });
      });
      const total = byDay[1].length + byDay[2].length + byDay[3].length;
      if (total > MAX_MEDIA) {
        [1, 2, 3].forEach(d => {
          const keep = Math.max(1, Math.round((byDay[d].length / total) * MAX_MEDIA));
          const step = byDay[d].length / keep;
          byDay[d] = byDay[d].length ? Array.from({ length: keep }, (_, i) => byDay[d][Math.floor(i * step)]) : [];
        });
      }
      const seen = new Set();
      const sealsEarned = subs
        .filter(x => x.mission?.seal_name && SEAL_ART.has(x.mission.seal_icon))
        .map(x => ({ name: x.mission.seal_name, icon: x.mission.seal_icon }))
        .filter(x => !seen.has(x.name) && seen.add(x.name));
      const coins = [...new Set(subs.filter(x => x.mission?.category === 'selo' && x.artist?.slug && secretArt(x.artist.slug)).map(x => x.artist.slug))];
      const track = subs.some(x => x.mission?.track === 'artist') ? 'artist' : 'public';
      const rank = [progress.ranks.artist, progress.ranks.public].filter(Boolean).sort((a, b) => a - b)[0] || null;
      setState({
        participant: p.data,
        byDay,
        total: subs.length,
        musicUrl: cfg.music_url,
        campaign: cfg,
        sealsEarned,
        coins,
        track,
        stats: {
          points: (progress.points.public || 0) + (progress.points.artist || 0),
          missions: subs.filter(x => x.mission?.category !== 'selo').length,
          seals: sealsEarned.length + coins.length,
          rank,
        },
        partnerLine: campaignPartners(cfg, partners).filter(x => x.id !== 'mestres').map(x => x.name.toUpperCase()).join('  ·  '),
      });
    })();
  }, [participantId, cfg, partners]);

  if (!state) return <div className="tw-center-screen">Montando sua retrospectiva...</div>;

  if (state.total === 0) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 380 }}>
          <Film size={48} color="var(--tw-gold)" />
          <h1 className="tw-h2" style={{ marginTop: '1rem' }}>Seu vídeo começa aqui</h1>
          <p className="tw-p" style={{ margin: '0.5rem 0 1.5rem' }}>Cumpra as missões do Meu {cfg.event_name}. Cada foto, selo e moeda dourada vira uma cena da sua retrospectiva.</p>
          <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => navigate(`${base}/meu`)}>Ir para as missões</button>
        </div>
      </div>
    );
  }

  return <RetroPlayer {...state} />;
}

function loadImage(src, cors = false) {
  return new Promise(resolve => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function loadMedia(m) {
  if (m.type !== 'video') return loadImage(m.url, true);
  return new Promise(resolve => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous';
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.src = m.url;
    v.onloadeddata = () => resolve(v);
    v.onerror = () => resolve(null);
  });
}

function RetroPlayer({ participant, byDay, musicUrl, campaign, partnerLine, sealsEarned, coins, track, stats }) {
  const canvasRef = useRef(null);
  const assetsRef = useRef({ media: new Map(), chars: {}, seals: {}, coins: {}, logo: null });
  const rafRef = useRef(0);
  const clockRef = useRef({ startedAt: 0, offset: 0 });
  const recRef = useRef(null);
  const audioRef = useRef(null);

  const [branded, setBranded] = useState(true);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [output, setOutput] = useState(null);

  const { scenes, total } = useMemo(() => buildScenes({ byDay, sealsEarned, coins, stats, track }), [byDay, sealsEarned, coins, stats, track]);

  const info = useMemo(() => ({
    name: participant?.name || '',
    eventName: campaign.event_name || 'Evento',
    campaignName: campaign.name,
    eventLine: [campaign.event_name, (campaign.event_days?.[0] || '').slice(0, 4), campaign.venue].filter(Boolean).join(' · ').toUpperCase(),
    partnerLine,
    branded,
    track,
    sealsEarned,
    coins,
    dayName: (d) => dayName(campaign, d),
  }), [participant?.name, campaign, partnerLine, branded, track, sealsEarned, coins]);

  const draw = useMemo(() => createRenderer({ scenes, total, assets: assetsRef.current, info }), [scenes, total, info]);

  // Carrega fontes, personagens, selos, moedas e as fotos/vídeos da pessoa
  useEffect(() => {
    let alive = true;
    const a = assetsRef.current;
    const media = [1, 2, 3].flatMap(d => byDay[d]);
    (async () => {
      await Promise.all([
        document.fonts?.load?.("400 80px 'Bagel Fat One'"),
        document.fonts?.load?.("800 30px 'Bricolage Grotesque'"),
      ].map(p => p?.catch?.(() => null)));
      const jobs = [
        ...CHARS.map(async n => { a.chars[n] = await loadImage(`/tattooweek/art/${n}.webp`); }),
        ...[...new Set(sealsEarned.map(s => s.icon).concat(media.map(m => m.seal?.icon).filter(Boolean)))]
          .map(async ic => { a.seals[ic] = await loadImage(`/tattooweek/art/selo-${ic}.webp`); }),
        ...coins.map(async slug => { a.coins[slug] = await loadImage(secretArt(slug)); }),
        (async () => { a.logo = await loadImage('/fotos artistas/logo mestres.png'); })(),
        ...media.map(async m => { const el = await loadMedia(m); if (el) a.media.set(m.url, el); }),
      ];
      await Promise.all(jobs);
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, [byDay, sealsEarned, coins]);

  const paint = useCallback((t, showBars) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx, t, { showBars });
  }, [draw]);

  // Primeiro quadro: a abertura já montada
  useEffect(() => { if (ready) paint(1.6, true); }, [ready, paint]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopRendererVideos(assetsRef.current);
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const loop = useCallback((showBars, onEnd) => {
    const t = clockRef.current.offset + (performance.now() - clockRef.current.startedAt) / 1000;
    if (t >= total) {
      paint(total - 0.01, showBars);
      clockRef.current.offset = 0;
      stop();
      onEnd?.();
      return;
    }
    paint(t, showBars);
    rafRef.current = requestAnimationFrame(() => loop(showBars, onEnd));
  }, [paint, total, stop]);

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
        const gain = actx.createGain();
        const dest = actx.createMediaStreamDestination();
        src.connect(gain);
        gain.connect(dest);
        gain.connect(actx.destination);
        // fade-out da trilha no final
        gain.gain.setValueAtTime(1, actx.currentTime + Math.max(0, total - 1.5));
        gain.gain.linearRampToValueAtTime(0, actx.currentTime + total);
        dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
        await audio.play();
      } catch { /* sem trilha: grava só o vídeo */ }
    }

    const mime = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => window.MediaRecorder?.isTypeSupported?.(m));
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 6_000_000 } : undefined);
    const chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const type = rec.mimeType || 'video/webm';
      const blob = new Blob(chunks, { type });
      const ext = type.includes('mp4') ? 'mp4' : 'webm';
      setOutput({ url: URL.createObjectURL(blob), blob, ext, type });
      setRecording(false);
      trackEvent('video_generated', branded ? 'branded' : 'clean', participant?.id, campaign.id);
    };
    recRef.current = rec;
    rec.start(250);
    clockRef.current = { startedAt: performance.now(), offset: 0 };
    setPlaying(true);
    loop(false, () => setTimeout(() => rec.state !== 'inactive' && rec.stop(), 300));
  };

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); audioRef.current?.pause(); }, []);

  const fileName = `meu-${campaign.slug}.${output?.ext}`;
  const canShareFile = output && navigator.canShare?.({ files: [new File([output.blob], fileName, { type: output.type })] });

  const share = async () => {
    try {
      await navigator.share({ files: [new File([output.blob], fileName, { type: output.type })], title: `Meu ${campaign.event_name}` });
      trackEvent('video_shared', 'native', participant?.id, campaign.id);
    } catch { /* usuário cancelou */ }
  };

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <span className="tw-kicker">Minha retrospectiva</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem', fontSize: '2.2rem' }}>Meu {campaign.event_name}</h1>

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
            <a className="tw-btn tw-btn-block" href={output.url} download={fileName} onClick={() => trackEvent('video_shared', 'download', participant?.id, campaign.id)}><Download size={18} /> Baixar vídeo</a>
            <button className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setOutput(null)}>Gerar de novo</button>
          </div>
        )}
      </div>
    </div>
  );
}
