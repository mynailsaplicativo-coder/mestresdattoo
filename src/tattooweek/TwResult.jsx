import { useState, useEffect, useRef } from 'react';
import { Share2, Download, Loader2 } from 'lucide-react';
import { TwShell, JoinGate, BadgeGrid } from './TwShell';
import { useTwParticipant, useCampaign, trackEvent, downloadBlob, campaignTheme } from './twData';
import { loadCampaignProgress } from './badges';

// Card vertical 1080x1920 (Stories) com pontos, posição e selos
const W = 1080;
const H = 1920;

export default function TwResult() {
  const tw = useTwParticipant();
  const { campaign } = useCampaign();
  const enrolledArtist = tw.participant && tw.isEnrolled(campaign.id, 'artist');
  return (
    <TwShell>
      {enrolledArtist
        ? <ResultCard participant={tw.participant} />
        : <JoinGate tw={tw} track="public">{tw.participant && <ResultCard participant={tw.participant} />}</JoinGate>}
    </TwShell>
  );
}

function loadImage(src, cors = true) {
  return new Promise(resolve => {
    if (!src) return resolve(null);
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function ResultCard({ participant }) {
  const { campaign, base } = useCampaign();
  const theme = campaignTheme(campaign);
  const GOLD = theme.primary;
  const canvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    loadCampaignProgress(participant.id, campaign.id).then(setData);
  }, [participant.id, campaign.id]);

  useEffect(() => {
    if (!data) return;
    let alive = true;
    (async () => {
      const [logo, avatar] = await Promise.all([loadImage('/fotos artistas/logo mestres.png', false), loadImage(participant.photo_url)]);
      if (!alive) return;
      const ctx = canvasRef.current.getContext('2d');
      const t = (str, x, y, size, color = '#fff', weight = 900, align = 'center') => {
        ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        let s = size;
        while (s > 20 && ctx.measureText(str).width > W - 120) { s -= 4; ctx.font = `${weight} ${s}px Inter, system-ui, sans-serif`; }
        ctx.fillText(str, x, y);
      };

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W / 2, 380, 50, W / 2, 380, 900);
      glow.addColorStop(0, (theme.accents[0] || GOLD) + '55');
      glow.addColorStop(1, theme.bg + '00');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = GOLD + '88';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, W - 80, H - 80);

      if (logo) {
        const lw = 300;
        ctx.drawImage(logo, (W - lw) / 2, 100, lw, lw * (logo.naturalHeight / logo.naturalWidth));
      }
      t('MEU RESULTADO', W / 2, 400, 40, GOLD, 900);
      t(campaign.name.toUpperCase(), W / 2, 460, 34, 'rgba(255,255,255,0.7)', 800);

      // Avatar
      const cy = 640;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, cy, 130, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = '#14171d';
      ctx.fill();
      ctx.clip();
      if (avatar) {
        const s = Math.max(260 / avatar.naturalWidth, 260 / avatar.naturalHeight);
        ctx.drawImage(avatar, W / 2 - (avatar.naturalWidth * s) / 2, cy - (avatar.naturalHeight * s) / 2, avatar.naturalWidth * s, avatar.naturalHeight * s);
      } else {
        t(participant.name.slice(0, 1).toUpperCase(), W / 2, cy + 40, 120, GOLD);
      }
      ctx.restore();
      ctx.beginPath();
      ctx.arc(W / 2, cy, 130, 0, Math.PI * 2);
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 6;
      ctx.stroke();

      t(participant.name.toUpperCase(), W / 2, 870, 76);
      if (participant.instagram) t(participant.instagram, W / 2, 930, 36, 'rgba(255,255,255,0.6)', 700);

      // Números
      const total = (data.points.public || 0) + (data.points.artist || 0);
      const bestRank = [data.ranks.public, data.ranks.artist].filter(Boolean).sort((a, b) => a - b)[0];
      const stats = [
        [String(total), 'PONTOS'],
        [bestRank ? `${bestRank}º` : '–', 'RANKING'],
        [String(data.approved.length), 'MISSÕES'],
      ];
      stats.forEach(([v, l], i) => {
        const x = W / 2 + (i - 1) * 320;
        t(v, x, 1100, 110, GOLD);
        t(l, x, 1160, 30, 'rgba(255,255,255,0.6)', 800);
      });

      // Selos (até 8)
      const seals = data.badges.slice(0, 8);
      if (seals.length) {
        t('SELOS CONQUISTADOS', W / 2, 1290, 32, GOLD, 900);
        seals.forEach((b, i) => {
          const row = Math.floor(i / 4);
          const inRow = Math.min(4, seals.length - row * 4);
          const col = i % 4;
          const x = W / 2 + (col - (inRow - 1) / 2) * 230;
          const y = 1400 + row * 200;
          ctx.font = '90px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(b.icon, x, y);
          ctx.font = '800 26px Inter, system-ui, sans-serif';
          ctx.fillStyle = '#fff';
          ctx.fillText(b.title, x, y + 50);
        });
      }

      t(`mestresdatattoo.com.br${base}`, W / 2, H - 100, 30, 'rgba(255,255,255,0.55)', 700);
      canvasRef.current.toBlob(b => alive && setBlob(b), 'image/png');
    })();
    return () => { alive = false; };
  }, [data, participant, campaign, base, GOLD, theme.bg, theme.accents]);

  const fileName = `resultado-${campaign.slug}.png`;
  const file = blob && new File([blob], fileName, { type: 'image/png' });
  const canShare = file && navigator.canShare?.({ files: [file] });

  const share = async () => {
    try {
      await navigator.share({ files: [file], title: `Meu resultado — ${campaign.name}` });
      trackEvent('result_shared', 'native', participant.id, campaign.id);
    } catch { /* cancelado */ }
  };

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <span className="tw-kicker">Card de resultado</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>Compartilhe sua jornada</h1>
      <div className="tw-result-stage">
        <canvas ref={canvasRef} width={W} height={H} />
      </div>
      <div className="tw-stack" style={{ marginTop: '1rem' }}>
        {!blob && <div className="tw-center-screen" style={{ minHeight: 60 }}><Loader2 className="tw-spin" /></div>}
        {canShare && <button className="tw-btn tw-btn-primary tw-btn-block" onClick={share}><Share2 size={18} /> Compartilhar no Stories</button>}
        {blob && (
          <button className="tw-btn tw-btn-block" onClick={() => { downloadBlob(blob, fileName); trackEvent('result_shared', 'download', participant.id, campaign.id); }}>
            <Download size={18} /> Baixar imagem
          </button>
        )}
        {data && (
          <section className="tw-section">
            <span className="tw-kicker">Seus selos nesta experiência</span>
            <div style={{ marginTop: '0.7rem' }}><BadgeGrid badges={data.badges} /></div>
          </section>
        )}
      </div>
    </div>
  );
}
