// Edição da retrospectiva em canvas (vídeo vertical 720x1280 para Stories).
// Linguagem visual do site: céu pastel, nuvens com contorno, adesivos com sombra dura,
// personagens, selos bordados e moedas douradas.

export const W = 720;
export const H = 1280;

const INK = '#1d1646';
const PINK = '#ff4fa3';
const SUN = '#f9e64f';
const LILAC = '#a995ff';
const CYAN = '#7fe7f2';
const DISPLAY = "'Bagel Fat One', 'Bricolage Grotesque', system-ui, sans-serif";
const BODY = "'Bricolage Grotesque', system-ui, sans-serif";

const IMAGE_SEC = 2.5;
const VIDEO_SEC = 4.5;
const WIPE = 0.45; // duração da faixa de transição

// --- easing ---
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeOutBack = (x) => { const c1 = 1.70158; const c3 = c1 + 1; const t = clamp(x); return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeInOut = (x) => { const t = clamp(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const seg = (t, a, b) => clamp((t - a) / (b - a));

// --- roteiro ---
export function buildScenes({ byDay, sealsEarned, coins, stats, track }) {
  const scenes = [{ kind: 'intro', dur: 3.4 }];
  const days = [1, 2, 3].filter(d => byDay[d]?.length);
  let flip = 0;
  days.forEach(d => {
    if (days.length > 1) scenes.push({ kind: 'chapter', dur: 1.7, day: d });
    byDay[d].forEach(m => {
      flip += 1;
      scenes.push({ kind: 'media', dur: m.type === 'video' ? VIDEO_SEC : IMAGE_SEC, media: m, tilt: flip % 2 ? -4 : 3.5, from: flip % 3 });
    });
  });
  if (sealsEarned.length || coins.length) scenes.push({ kind: 'seals', dur: Math.min(5, 2.6 + sealsEarned.length * 0.14 + (coins.length ? 0.8 : 0)) });
  scenes.push({ kind: 'stats', dur: 3.2, stats });
  scenes.push({ kind: 'outro', dur: 3.8 });
  let t = 0;
  scenes.forEach(s => { s.start = t; t += s.dur; s.track = track; });
  return { scenes, total: t };
}

// --- primitivas ---
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function sky(ctx, t, hueShift = 0) {
  const g = ctx.createLinearGradient(0, 0, W * 0.3, H);
  const k = Math.sin(t * 0.6 + hueShift) * 0.08;
  g.addColorStop(0, '#c9a6ff');
  g.addColorStop(0.45 + k, '#ff9ad9');
  g.addColorStop(1, '#8fe9f0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // manchas de luz que passeiam
  const blobs = [[0.15, 0.2, '#ffffff', 0.35], [0.85, 0.35, '#fff2a8', 0.35], [0.3, 0.85, '#d4f7fa', 0.4]];
  blobs.forEach(([bx, by, c, a], i) => {
    const x = (bx + Math.sin(t * 0.4 + i) * 0.05) * W;
    const y = (by + Math.cos(t * 0.35 + i) * 0.04) * H;
    const rg = ctx.createRadialGradient(x, y, 10, x, y, 420);
    rg.addColorStop(0, hexA(c, a));
    rg.addColorStop(1, hexA(c, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  });
  // pontilhado de pôster
  ctx.fillStyle = 'rgba(29, 22, 70, 0.07)';
  for (let y = 11; y < H; y += 24) for (let x = 11; x < W; x += 24) ctx.fillRect(x, y, 2, 2);
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function cloud(ctx, cx, cy, s, fill = '#fff') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  const puffs = [[-70, 10, 42], [-25, -18, 52], [30, -24, 56], [80, 4, 42], [5, 18, 50], [-45, 22, 38], [55, 24, 40]];
  // sombra dura
  ctx.fillStyle = INK;
  puffs.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x + 6, y + 7, r + 5, 0, Math.PI * 2); ctx.fill(); });
  ctx.beginPath();
  puffs.forEach(([x, y, r]) => { ctx.moveTo(x + r + 5, y); ctx.arc(x, y, r + 5, 0, Math.PI * 2); });
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  puffs.forEach(([x, y, r]) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); });
  ctx.fill();
  ctx.restore();
}

function sparkle(ctx, x, y, r, fill, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
  ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
  ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
  ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
}

function sparkles(ctx, t) {
  const list = [[90, 210, 18, SUN], [640, 160, 14, '#ff8fd8'], [600, 520, 12, CYAN], [70, 760, 14, SUN], [660, 980, 16, LILAC]];
  list.forEach(([x, y, r, c], i) => {
    const s = 0.7 + 0.3 * Math.sin(t * 3 + i * 1.7);
    sparkle(ctx, x, y, r * s, c, t * 0.6 + i);
  });
}

// Texto display com contorno e sombra dura (como os títulos do site)
function title(ctx, str, x, y, size, fill = '#fff', align = 'center', maxW = W - 70) {
  let s = size;
  ctx.font = `400 ${s}px ${DISPLAY}`;
  while (s > 24 && ctx.measureText(str).width > maxW) { s -= 4; ctx.font = `400 ${s}px ${DISPLAY}`; }
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.fillStyle = INK;
  ctx.fillText(str, x + s * 0.07, y + s * 0.08);
  ctx.lineWidth = Math.max(6, s * 0.12);
  ctx.strokeStyle = INK;
  ctx.strokeText(str, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
  return s;
}

// Etiqueta-adesivo (fundo, borda e sombra dura)
function sticker(ctx, str, cx, cy, { size = 30, fill = '#fff', color = INK, rot = 0, font = BODY, weight = 800, pad = 18, maxW = W - 80 } = {}) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rot * Math.PI) / 180);
  let s = size;
  ctx.font = `${weight} ${s}px ${font}`;
  while (s > 16 && ctx.measureText(str).width + pad * 2 > maxW) { s -= 2; ctx.font = `${weight} ${s}px ${font}`; }
  const w = ctx.measureText(str).width + pad * 2;
  const h = s * 1.55;
  ctx.fillStyle = INK;
  roundRect(ctx, -w / 2 + 6, -h / 2 + 6, w, h, h * 0.32);
  ctx.fill();
  ctx.fillStyle = fill;
  roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.32);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, 0, s * 0.04);
  ctx.restore();
  return { w, h };
}

function drawContain(ctx, img, cx, cy, size, rot = 0, scale = 1) {
  if (!img?.naturalWidth) return;
  const r = Math.min(size / img.naturalWidth, size / img.naturalHeight) * scale;
  const w = img.naturalWidth * r;
  const h = img.naturalHeight * r;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function coverInto(ctx, el, x, y, w, h, zoom) {
  const sw = el.videoWidth || el.naturalWidth;
  const sh = el.videoHeight || el.naturalHeight;
  if (!sw || !sh) return;
  const s = Math.max(w / sw, h / sh) * zoom;
  const dw = sw * s;
  const dh = sh * s;
  ctx.drawImage(el, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function wrapLines(ctx, str, maxW) {
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

// Faixa diagonal colorida que cobre o corte entre cenas
function wipe(ctx, local) {
  if (local > WIPE) return;
  const p = local / WIPE;
  const colors = [PINK, LILAC, CYAN, SUN];
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.35);
  colors.forEach((c, i) => {
    const off = (easeInOut(p) * 2.4 - 1.2) * H - i * 90;
    ctx.fillStyle = c;
    ctx.fillRect(-W * 1.5, off, W * 3, 110);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.strokeRect(-W * 1.5, off, W * 3, 110);
  });
  ctx.restore();
}

// --- cenas ---
function drawIntro(ctx, t, local, a, ctx2) {
  sky(ctx, t);
  const c1 = easeOutCubic(seg(local, 0, 0.9));
  cloud(ctx, -60 + 160 * c1, 300, 1.1);
  cloud(ctx, W + 80 - 170 * c1, 180, 0.9, '#fff4fb');
  cloud(ctx, W / 2 + 40, H - 120 + 140 * (1 - c1), 1.6, '#f7fdff');
  cloud(ctx, 60, H - 40 + 120 * (1 - c1), 1.3);
  sparkles(ctx, t);

  // personagem cai com quique
  const charImg = a.chars[ctx2.track === 'artist' ? 'tigre' : 'oni'];
  const drop = easeOutBack(seg(local, 0.25, 1.15));
  const bob = Math.sin(t * 3) * 6;
  drawContain(ctx, charImg, W / 2, H - 330 - 380 * (1 - drop) + bob, 420, Math.sin(t * 2) * 0.03, 0.9 + 0.1 * drop);
  drawContain(ctx, a.chars.dragao, 130, 520 + Math.sin(t * 2.2) * 10, 190 * easeOutBack(seg(local, 0.6, 1.3)), -0.1);
  drawContain(ctx, a.chars.gato, W - 120, 560 + Math.cos(t * 2) * 10, 170 * easeOutBack(seg(local, 0.75, 1.45)), 0.1);

  // textos
  const k = easeOutBack(seg(local, 0.1, 0.6));
  if (k > 0) sticker(ctx, ctx2.track === 'artist' ? 'ARTIST CHALLENGE' : 'MESTRES DA TATTOO APRESENTA', W / 2, 150, { size: 26 * k, fill: '#fff', rot: -2 });
  const t1 = easeOutBack(seg(local, 0.35, 0.85));
  if (t1 > 0) title(ctx, 'Meu', W / 2, 300, 96 * t1, SUN);
  const t2 = easeOutBack(seg(local, 0.5, 1.05));
  if (t2 > 0) title(ctx, ctx2.eventName, W / 2, 420, 118 * t2, '#fff');
  const n = easeOutBack(seg(local, 0.95, 1.4));
  if (n > 0) sticker(ctx, ctx2.name.toUpperCase(), W / 2, 520, { size: 40 * n, fill: SUN, rot: 3, font: DISPLAY, weight: 400 });
}

const CHAPTER_CHARS = { 1: 'dragao', 2: 'gato', 3: 'tigre' };
const CHAPTER_BG = { 1: ['#ffb3e1', '#c9a6ff'], 2: ['#9ff0f4', '#c9a6ff'], 3: ['#fff2a8', '#ff9ad9'] };

function drawChapter(ctx, t, local, a, ctx2, scene) {
  const [c0, c1] = CHAPTER_BG[scene.day] || CHAPTER_BG[1];
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // raios saindo do centro
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.rotate(t * 0.25);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let i = 0; i < 16; i++) {
    ctx.rotate(Math.PI / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-60, -1100);
    ctx.lineTo(60, -1100);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const k = easeOutBack(seg(local, 0.05, 0.5));
  title(ctx, `DIA ${scene.day}`, W / 2, H * 0.42, 210 * k, '#fff');
  const s = easeOutBack(seg(local, 0.3, 0.7));
  if (s > 0) sticker(ctx, ctx2.dayName(scene.day).toUpperCase(), W / 2, H * 0.42 + 90, { size: 44 * s, fill: SUN, rot: -3, font: DISPLAY, weight: 400 });
  const slide = easeOutCubic(seg(local, 0.2, 0.9));
  drawContain(ctx, a.chars[CHAPTER_CHARS[scene.day] || 'oni'], W / 2 + (1 - slide) * 600, H - 260 + Math.sin(t * 3) * 8, 380);
}

function drawMedia(ctx, t, local, a, ctx2, scene) {
  sky(ctx, t, scene.start);
  cloud(ctx, 40 + Math.sin(t * 0.5) * 20, 150, 0.8);
  cloud(ctx, W - 30, H - 120 + Math.cos(t * 0.5) * 15, 1.1, '#fff4fb');
  sparkles(ctx, t);

  const el = a.media.get(scene.media.url);
  // entrada da polaroid com mola, vinda de lados diferentes
  const inP = easeOutBack(seg(local, 0, 0.55));
  const fromX = [-W, W, 0][scene.from] * (1 - inP);
  const fromY = scene.from === 2 ? (1 - inP) * H : 0;
  const pw = 560;
  const ph = 760;
  const cx = W / 2 + fromX;
  const cy = 600 + fromY;
  const rot = ((scene.tilt * Math.PI) / 180) * (0.6 + 0.4 * inP);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  // sombra dura + moldura branca
  ctx.fillStyle = INK;
  roundRect(ctx, -pw / 2 + 12, -ph / 2 + 14, pw, ph + 70, 18);
  ctx.fill();
  ctx.fillStyle = '#fff';
  roundRect(ctx, -pw / 2, -ph / 2, pw, ph + 70, 18);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // foto
  const ix = -pw / 2 + 22;
  const iy = -ph / 2 + 22;
  const iw = pw - 44;
  const ih = ph - 44;
  ctx.save();
  roundRect(ctx, ix, iy, iw, ih, 10);
  ctx.clip();
  ctx.fillStyle = '#f1ebff';
  ctx.fillRect(ix, iy, iw, ih);
  if (el) coverInto(ctx, el, ix, iy, iw, ih, 1.02 + 0.07 * seg(local, 0, scene.dur));
  ctx.restore();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  roundRect(ctx, ix, iy, iw, ih, 10);
  ctx.stroke();
  // fita adesiva no topo
  ctx.save();
  ctx.rotate(-0.06);
  ctx.fillStyle = 'rgba(255, 143, 216, 0.85)';
  ctx.fillRect(-70, -ph / 2 - 22, 140, 44);
  ctx.restore();
  ctx.restore();

  // legenda da missão
  const capP = easeOutBack(seg(local, 0.35, 0.8));
  if (capP > 0 && scene.media.caption) {
    ctx.font = `800 30px ${BODY}`;
    const lines = wrapLines(ctx, scene.media.caption, W - 170).slice(0, 2);
    lines.forEach((l, i) => sticker(ctx, l, W / 2, 1080 + i * 58, { size: 30 * capP, fill: i ? '#fff' : SUN, rot: i ? 1.5 : -2 }));
  }

  // selo da missão carimba no canto
  const seal = scene.media.seal;
  const sp = easeOutBack(seg(local, 0.75, 1.2));
  if (seal && sp > 0) {
    const img = a.seals[seal.icon];
    const x = W - 150;
    const y = 250;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.25 - 0.25 * sp);
    ctx.scale(sp * 1.0, sp * 1.0);
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(5, 6, 92, 0, Math.PI * 2);
    ctx.fill();
    if (img) drawContain(ctx, img, 0, 0, 184);
    else { ctx.fillStyle = SUN; ctx.beginPath(); ctx.arc(0, 0, 88, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (sp > 0.9) sticker(ctx, `SELO ${seal.name.toUpperCase()}`, x, y + 118, { size: 20, fill: '#fff', rot: 4, maxW: 300 });
  }
  wipe(ctx, local);
}

function drawSeals(ctx, t, local, a, ctx2) {
  // fundo verde de faixa de escoteiro
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2a8f5a');
  g.addColorStop(1, '#1f6e45');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.setLineDash([14, 12]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  roundRect(ctx, 26, 26, W - 52, H - 52, 30);
  ctx.stroke();
  ctx.setLineDash([]);

  const k = easeOutBack(seg(local, 0, 0.45));
  title(ctx, 'Minha faixa', W / 2, 170, 86 * k, SUN);
  title(ctx, 'de selos', W / 2, 260, 86 * k, '#fff');

  const list = ctx2.sealsEarned.slice(0, 12);
  const cols = list.length > 6 ? 4 : 3;
  const size = cols === 4 ? 150 : 180;
  const gapX = (W - 80) / cols;
  list.forEach((s, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const inRow = Math.min(cols, list.length - row * cols);
    const x = W / 2 + (col - (inRow - 1) / 2) * gapX;
    const y = 400 + row * (size + 40);
    const p = easeOutBack(seg(local, 0.4 + i * 0.12, 0.75 + i * 0.12));
    if (p <= 0) return;
    const img = a.seals[s.icon];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(i * 2.3) * 0.12);
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(4, 5, (size / 2) * p, 0, Math.PI * 2);
    ctx.fill();
    if (img) drawContain(ctx, img, 0, 0, size * p);
    ctx.restore();
  });

  // moedas douradas girando
  const coins = ctx2.coins.slice(0, 5);
  if (coins.length) {
    const base = 400 + Math.ceil(list.length / cols) * (size + 40) + 40;
    const cy = Math.min(H - 170, base + 60);
    const cp = seg(local, 0.6 + list.length * 0.12, 1.4 + list.length * 0.12);
    if (cp > 0) {
      sticker(ctx, coins.length === 1 ? '1 SELO SECRETO DOURADO' : `${coins.length} SELOS SECRETOS DOURADOS`, W / 2, cy - 110, { size: 26, fill: SUN, rot: -2 });
      coins.forEach((slug, i) => {
        const x = W / 2 + (i - (coins.length - 1) / 2) * 128;
        const img = a.coins[slug];
        const spin = Math.cos((t * 2.2 + i * 0.6) * Math.PI);
        const sc = easeOutBack(clamp(cp * 1.4 - i * 0.12));
        if (sc <= 0 || !img) return;
        const rg = ctx.createRadialGradient(x, cy, 10, x, cy, 90);
        rg.addColorStop(0, 'rgba(255, 228, 120, 0.9)');
        rg.addColorStop(1, 'rgba(255, 228, 120, 0)');
        ctx.fillStyle = rg;
        ctx.fillRect(x - 90, cy - 90, 180, 180);
        ctx.save();
        ctx.translate(x, cy);
        ctx.scale(Math.max(0.12, Math.abs(spin)) * sc, sc);
        drawContain(ctx, img, 0, 0, 120);
        ctx.restore();
      });
    }
  }
}

function drawStats(ctx, t, local, a, ctx2, scene) {
  sky(ctx, t, 2);
  sparkles(ctx, t);
  const k = easeOutBack(seg(local, 0, 0.45));
  title(ctx, 'Meus números', W / 2, 190, 88 * k, '#fff');
  const s = scene.stats;
  const cards = [
    ['PONTOS', Math.round(s.points * easeOutCubic(seg(local, 0.3, 1.6))), SUN],
    ['MISSÕES', s.missions, '#ffd3f0'],
    ['SELOS', s.seals, '#c8f4f6'],
    ['RANKING', s.rank ? `${s.rank}º` : '—', '#e4d4ff'],
  ];
  cards.forEach(([label, value, fill], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 70 + col * 300;
    const y = 290 + row * 300;
    const p = easeOutBack(seg(local, 0.2 + i * 0.15, 0.6 + i * 0.15));
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x + 140, y + 130);
    ctx.scale(p, p);
    ctx.rotate(((i % 2 ? 2 : -2) * Math.PI) / 180);
    ctx.fillStyle = INK;
    roundRect(ctx, -140 + 8, -130 + 9, 280, 260, 28);
    ctx.fill();
    ctx.fillStyle = fill;
    roundRect(ctx, -140, -130, 280, 260, 28);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.font = `400 ${String(value).length > 4 ? 72 : 96}px ${DISPLAY}`;
    ctx.fillText(String(value), 0, 20);
    ctx.font = `800 26px ${BODY}`;
    ctx.fillText(label, 0, 85);
    ctx.restore();
  });
  const c = easeOutBack(seg(local, 0.9, 1.5));
  drawContain(ctx, a.chars[ctx2.track === 'artist' ? 'tigre' : 'gato'], W / 2, H - 200 + Math.sin(t * 3) * 8, 300 * c);
}

function drawOutro(ctx, t, local, a, ctx2) {
  sky(ctx, t, 4);
  cloud(ctx, 80, 210, 1.0);
  cloud(ctx, W - 60, 300, 0.85, '#fff4fb');
  sparkles(ctx, t);
  const logo = a.logo;
  const lk = easeOutBack(seg(local, 0, 0.5));
  if (logo) drawContain(ctx, logo, W / 2, 200, 300 * lk);
  const words = ctx2.campaignName.split(' ');
  const last = words.length > 1 ? words.pop() : '';
  const k = easeOutBack(seg(local, 0.2, 0.7));
  title(ctx, words.join(' '), W / 2, 430, 96 * k, '#fff');
  if (last) title(ctx, last, W / 2, 540, 120 * k, SUN);
  const s = easeOutBack(seg(local, 0.5, 0.9));
  if (s > 0) sticker(ctx, ctx2.eventLine, W / 2, 630, { size: 28 * s, fill: '#fff', rot: -2 });
  if (ctx2.branded && ctx2.partnerLine) {
    const pp = easeOutBack(seg(local, 0.7, 1.1));
    if (pp > 0) sticker(ctx, ctx2.partnerLine, W / 2, 712, { size: 22 * pp, fill: SUN, rot: 1.5, maxW: W - 60 });
  }
  // desfile dos personagens
  const names = ['tigre', 'gato', 'oni', 'dragao', 'caveira'];
  names.forEach((n, i) => {
    const p = easeOutBack(seg(local, 0.6 + i * 0.12, 1.1 + i * 0.12));
    const x = 75 + i * 142;
    const y = H - 230 + Math.sin(t * 3.2 + i) * 12 + (1 - p) * 400;
    drawContain(ctx, a.chars[n], x, y, n === 'oni' ? 220 : 170);
  });
  const u = seg(local, 1.4, 1.9);
  if (u > 0) {
    ctx.globalAlpha = u;
    sticker(ctx, 'mestresdatattoo.com', W / 2, H - 70, { size: 26, fill: '#fff' });
    ctx.globalAlpha = 1;
  }
}

// --- renderizador ---
export function createRenderer({ scenes, total, assets, info }) {
  let activeVideo = null;
  return function draw(ctx, t, { showBars = false } = {}) {
    const scene = scenes.find(s => t >= s.start && t < s.start + s.dur) || scenes[scenes.length - 1];
    const local = t - scene.start;
    ctx.save();
    ctx.globalAlpha = 1;
    // vídeo do participante: toca só na cena dele
    const el = scene.kind === 'media' ? assets.media.get(scene.media.url) : null;
    if (el && el.tagName === 'VIDEO') {
      if (activeVideo !== el) { activeVideo?.pause(); activeVideo = el; el.currentTime = 0; el.play().catch(() => {}); }
    } else if (activeVideo) { activeVideo.pause(); activeVideo = null; }

    if (scene.kind === 'intro') drawIntro(ctx, t, local, assets, info);
    else if (scene.kind === 'chapter') { drawChapter(ctx, t, local, assets, info, scene); wipe(ctx, local); }
    else if (scene.kind === 'media') drawMedia(ctx, t, local, assets, info, scene);
    else if (scene.kind === 'seals') { drawSeals(ctx, t, local, assets, info); wipe(ctx, local); }
    else if (scene.kind === 'stats') { drawStats(ctx, t, local, assets, info, scene); wipe(ctx, local); }
    else if (scene.kind === 'outro') { drawOutro(ctx, t, local, assets, info); wipe(ctx, local); }

    if (showBars) {
      const gap = 5;
      const bw = (W - 48 - gap * (scenes.length - 1)) / scenes.length;
      scenes.forEach((s, i) => {
        const x = 24 + i * (bw + gap);
        ctx.fillStyle = 'rgba(29,22,70,0.25)';
        ctx.fillRect(x, 20, bw, 6);
        const fill = t >= s.start + s.dur ? 1 : t < s.start ? 0 : (t - s.start) / s.dur;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, 20, bw * fill, 6);
      });
    }
    ctx.restore();
    return t < total;
  };
}

export function stopRendererVideos(assets) {
  assets.media.forEach(el => { if (el.tagName === 'VIDEO') el.pause(); });
}
