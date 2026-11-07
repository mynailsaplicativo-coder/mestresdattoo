import { useState, useEffect, useRef } from 'react';
import { Share2, Download, Loader2 } from 'lucide-react';
import { TwShell, JoinGate, BadgeGrid } from './TwShell';
import { useTwParticipant, useCampaign, trackEvent, downloadBlob, sealItems, secretArt } from './twData';
import { loadCampaignProgress } from './badges';

// Card vertical 1080x1920 (Stories) no visual pôster: foto, pontos, selos secretos e faixa de selos
const W = 1080;
const H = 1920;
const INK = '#1d1646';
const DISPLAY = "'Bagel Fat One', 'Bricolage Grotesque', system-ui, sans-serif";
const BODY = "'Bricolage Grotesque', Inter, system-ui, sans-serif";
const CLOUD = new Path2D('M30 96 C8 96 4 70 24 62 C18 40 44 28 60 40 C66 16 102 8 116 32 C128 10 168 12 172 42 C194 32 222 44 214 68 C236 72 234 96 210 96 Z');
const SPARK = new Path2D('M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z');
const SEAL_ART = new Set(['door', 'megaphone', 'flame', 'search', 'crown', 'eye', 'pen', 'heart', 'stencil', 'book', 'map', 'users', 'mic', 'lightbulb', 'utensils', 'music']);

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

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Cartão-adesivo: sombra dura + contorno grosso, igual ao site
function sticker(ctx, x, y, w, h, r, fill, shadow = 10) {
  roundRect(ctx, x + shadow, y + shadow, w, h, r);
  ctx.fillStyle = INK; ctx.fill();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
}

function cloud(ctx, x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = '#fff'; ctx.fill(CLOUD);
  ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.stroke(CLOUD);
  ctx.restore();
}

function spark(ctx, x, y, scale, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = color; ctx.fill(SPARK);
  ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(SPARK);
  ctx.restore();
}

export function ResultCard({ participant }) {
  const { campaign, base } = useCampaign();
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
      try { await Promise.all([document.fonts.load(`400 80px ${DISPLAY}`), document.fonts.load(`800 40px ${BODY}`)]); } catch { /* usa a fonte do sistema */ }
      const patches = sealItems(data.missions, data.approved).filter(s => s.earned).slice(0, 8);
      const secrets = data.secretTags || [];
      const [logo, avatar, oni, gato, dragao, ...imgs] = await Promise.all([
        loadImage('/fotos artistas/logo mestres.png', false),
        loadImage(participant.photo_url),
        loadImage('/tattooweek/art/oni.webp', false),
        loadImage('/tattooweek/art/gato.webp', false),
        loadImage('/tattooweek/art/dragao.webp', false),
        ...secrets.map(s => loadImage(secretArt(s.slug), false)),
        ...patches.map(p => loadImage(SEAL_ART.has(p.icon) ? `/tattooweek/art/selo-${p.icon}.webp` : null, false)),
      ]);
      if (!alive) return;
      const coinImgs = imgs.slice(0, secrets.length);
      const patchImgs = imgs.slice(secrets.length);
      const ctx = canvasRef.current.getContext('2d');

      const text = (str, x, y, size, { color = INK, font = DISPLAY, weight = 400, align = 'center', max = W - 160 } = {}) => {
        let s = size;
        ctx.font = `${weight} ${s}px ${font}`;
        while (s > 18 && ctx.measureText(str).width > max) { s -= 3; ctx.font = `${weight} ${s}px ${font}`; }
        ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
        ctx.fillText(str, x, y);
      };

      // Céu pastel com pontinhos
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#e9dcff'); sky.addColorStop(0.45, '#ffd9ef'); sky.addColorStop(1, '#d6f7fb');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(29, 22, 70, 0.08)';
      for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); }

      cloud(ctx, -60, 150, 1.35);
      cloud(ctx, 760, 120, 1.3);
      cloud(ctx, 820, 1050, 1.1);
      spark(ctx, 120, 120, 1.6, '#f4e14d');
      spark(ctx, 930, 360, 1.3, '#ff8fd8');
      spark(ctx, 70, 1180, 1.2, '#7fe7f2');

      // Topo
      if (logo) { const lw = 220; ctx.drawImage(logo, (W - lw) / 2, 60, lw, lw * (logo.naturalHeight / logo.naturalWidth)); }
      text(campaign.name, W / 2, 300, 92, { max: W - 420 });
      text(`MEU RESULTADO · ${(campaign.event_name || '').toUpperCase()}`, W / 2, 360, 32, { color: '#d81b7e', font: BODY, weight: 800 });

      // Cartão do participante
      sticker(ctx, 90, 410, W - 180, 640, 48, '#ffffff');
      const cy = 580;
      ctx.save(); ctx.beginPath(); ctx.arc(W / 2, cy, 132, 0, Math.PI * 2); ctx.fillStyle = '#f4e14d'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(W / 2, cy, 116, 0, Math.PI * 2); ctx.closePath(); ctx.fillStyle = '#c9b8ff'; ctx.fill(); ctx.clip();
      if (avatar) {
        const s = Math.max(232 / avatar.naturalWidth, 232 / avatar.naturalHeight);
        ctx.drawImage(avatar, W / 2 - (avatar.naturalWidth * s) / 2, cy - (avatar.naturalHeight * s) / 2, avatar.naturalWidth * s, avatar.naturalHeight * s);
      } else {
        text(participant.name.slice(0, 1).toUpperCase(), W / 2, cy + 45, 130, { color: '#fff' });
      }
      ctx.restore();
      ctx.beginPath(); ctx.arc(W / 2, cy, 116, 0, Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();

      text(participant.name, W / 2, 790, 66, { max: W - 260 });
      if (participant.instagram) text(`@${participant.instagram.replace(/^@/, '')}`, W / 2, 845, 34, { color: '#5d5490', font: BODY, weight: 800 });

      // Números em adesivos coloridos
      const total = (data.points.public || 0) + (data.points.artist || 0);
      const bestRank = [data.ranks.public, data.ranks.artist].filter(Boolean).sort((a, b) => a - b)[0];
      const stats = [[String(total), 'PONTOS', '#f4e14d'], [bestRank ? `${bestRank}º` : '–', 'RANKING', '#ffc2e6'], [String(data.approved.length), 'MISSÕES', '#b5f1f6']];
      stats.forEach(([v, l, c], i) => {
        const bw = 240; const x = W / 2 + (i - 1) * 270 - bw / 2;
        sticker(ctx, x, 880, bw, 140, 30, c, 7);
        text(v, x + bw / 2, 960, 64, { max: bw - 30 });
        text(l, x + bw / 2, 1000, 24, { font: BODY, weight: 800 });
      });

      // Selos secretos (moedas douradas; as que faltam ficam apagadas)
      if (secrets.length) {
        text('SELOS SECRETOS', W / 2, 1120, 36, { color: '#d81b7e', font: BODY, weight: 800 });
        const size = Math.min(170, (W - 200) / secrets.length - 20);
        secrets.forEach((s, i) => {
          const x = W / 2 + (i - (secrets.length - 1) / 2) * (size + 22) - size / 2;
          const img = coinImgs[i];
          ctx.save();
          if (!s.earned) { ctx.globalAlpha = 0.28; ctx.filter = 'grayscale(1)'; }
          if (img) ctx.drawImage(img, x, 1150, size, size);
          else { ctx.beginPath(); ctx.arc(x + size / 2, 1150 + size / 2, size / 2, 0, Math.PI * 2); ctx.fillStyle = '#f1c84b'; ctx.fill(); }
          ctx.restore();
          if (!s.earned) text('?', x + size / 2, 1150 + size / 2 + 28, 80, { color: 'rgba(29,22,70,0.55)' });
        });
        text(`${secrets.filter(s => s.earned).length} de ${secrets.length} encontrados`, W / 2, 1365, 30, { color: '#5d5490', font: BODY, weight: 800 });
      }

      // Faixa de selos bordados (missões cumpridas)
      if (patches.length) {
        sticker(ctx, 90, 1405, W - 180, 300, 40, '#fff6c9', 8);
        text('MINHA FAIXA DE SELOS', W / 2, 1460, 30, { font: BODY, weight: 800 });
        const ps = Math.min(150, (W - 260) / Math.min(patches.length, 5) - 14);
        const perRow = Math.min(patches.length, 5);
        patches.slice(0, 5).forEach((p, i) => {
          const x = W / 2 + (i - (perRow - 1) / 2) * (ps + 14) - ps / 2;
          const img = patchImgs[i];
          if (img) ctx.drawImage(img, x, 1490, ps, ps);
          else { ctx.beginPath(); ctx.arc(x + ps / 2, 1490 + ps / 2, ps / 2, 0, Math.PI * 2); ctx.fillStyle = p.color || '#a995ff'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
          text(p.name, x + ps / 2, 1490 + ps + 34, 22, { font: BODY, weight: 800, max: ps + 10 });
        });
      }

      // Personagens
      if (oni) ctx.drawImage(oni, -10, H - 330, 300, 300 * (oni.naturalHeight / oni.naturalWidth));
      if (dragao) ctx.drawImage(dragao, W - 330, H - 340, 340, 340 * (dragao.naturalHeight / dragao.naturalWidth));
      if (gato) ctx.drawImage(gato, W - 205, 215, 165, 165 * (gato.naturalHeight / gato.naturalWidth));

      // Rodapé
      sticker(ctx, W / 2 - 300, H - 150, 600, 86, 43, '#ffffff', 6);
      text(`mestresdatattoo.com${base}`, W / 2, H - 96, 32, { font: BODY, weight: 800, max: 560 });

      canvasRef.current.toBlob(b => alive && setBlob(b), 'image/png');
    })();
    return () => { alive = false; };
  }, [data, participant, campaign, base]);

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
      <div className="tw-result-stage tw-result-poster">
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
            <span className="tw-kicker">Suas conquistas neste desafio</span>
            <div style={{ marginTop: '0.7rem' }}><BadgeGrid badges={data.badges} /></div>
          </section>
        )}
      </div>
    </div>
  );
}
