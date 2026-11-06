import { useId } from 'react';
import {
  DoorOpen, Megaphone, Flame, Search, Crown, Eye, PenTool, Heart, PenLine, BookOpen, Map, Users, Mic, Lightbulb,
  Utensils, Music, Star, Camera, Zap, KeyRound, HelpCircle,
} from 'lucide-react';

// Arte original do Desafio dos Mestres: nuvens de pôster, brilhos, mascote e selos bordados.
const INK = '#1d1646';

const SEAL_ICONS = {
  door: DoorOpen, megaphone: Megaphone, flame: Flame, search: Search, crown: Crown, eye: Eye, pen: PenTool,
  heart: Heart, stencil: PenLine, book: BookOpen, map: Map, users: Users, mic: Mic, lightbulb: Lightbulb,
  utensils: Utensils, music: Music, star: Star, camera: Camera, zap: Zap, key: KeyRound, help: HelpCircle,
};



// Nuvem fofa com contorno grosso (estilo pôster)
export function Cloud({ className, fill = '#fff', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 240 110" aria-hidden="true">
      <path
        d="M30 96 C8 96 4 70 24 62 C18 40 44 28 60 40 C66 16 102 8 116 32 C128 10 168 12 172 42 C194 32 222 44 214 68 C236 72 234 96 210 96 Z"
        fill={fill} stroke={INK} strokeWidth="5" strokeLinejoin="round"
      />
      <path d="M58 70 C66 62 78 62 84 70" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M140 64 C150 56 164 58 168 66" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

// Brilho de quatro pontas
export function Sparkle({ className, fill = '#f4e14d', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill={fill} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

// Mascote: a Nuvi, nuvenzinha tatuadora com a máquina na mão
export function Mascot({ className, mood = 'happy', style }) {
  const mouth = mood === 'wow'
    ? <ellipse cx="100" cy="104" rx="9" ry="11" fill={INK} />
    : <path d="M86 98 C92 112 108 112 114 98 Z" fill={INK} />;
  return (
    <svg className={className} style={style} viewBox="0 0 210 190" aria-hidden="true">
      {/* corpo */}
      <path
        d="M44 150 C14 150 10 112 36 104 C26 72 60 54 80 70 C86 38 132 30 144 62 C168 50 196 72 184 100 C206 110 200 150 170 150 Z"
        fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round"
      />
      {/* chifrinhos */}
      <path d="M78 66 C70 44 82 36 90 52" fill="#ff8fd8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M140 60 C150 38 138 30 130 46" fill="#ff8fd8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {/* olhos */}
      <ellipse cx="80" cy="88" rx="13" ry="16" fill={INK} />
      <ellipse cx="122" cy="88" rx="13" ry="16" fill={INK} />
      <circle cx="84" cy="82" r="5" fill="#fff" />
      <circle cx="126" cy="82" r="5" fill="#fff" />
      {/* bochechas */}
      <ellipse cx="62" cy="106" rx="10" ry="6" fill="#ff8fd8" opacity="0.8" />
      <ellipse cx="140" cy="106" rx="10" ry="6" fill="#ff8fd8" opacity="0.8" />
      {mouth}
      {/* tatuagem de estrela no corpo */}
      <path d="M58 128 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill="#f4e14d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* máquina de tatuagem */}
      <g transform="rotate(-28 170 120)">
        <rect x="156" y="96" width="26" height="40" rx="6" fill="#a995ff" stroke={INK} strokeWidth="5" />
        <rect x="162" y="104" width="14" height="8" rx="3" fill="#7fe7f2" stroke={INK} strokeWidth="3" />
        <path d="M169 136 L169 158" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M169 158 L169 166" stroke="#ff6fa8" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* braço */}
      <path d="M150 128 C160 132 166 128 168 122" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// Selos com ilustração bordada pronta (public/tattooweek/art/selo-<ícone>.webp)
const SEAL_ART = new Set(['door', 'megaphone', 'flame', 'search', 'crown', 'eye', 'pen', 'heart', 'stencil', 'book', 'map', 'users', 'mic', 'lightbulb', 'utensils', 'music']);

// Personagens da campanha (oni, dragão, gato, caveira, tigre)
export function Char({ name, className, style, alt = '' }) {
  return <img className={`tw-char ${className || ''}`} style={style} src={`/tattooweek/art/${name}.webp`} alt={alt} loading="lazy" decoding="async" draggable="false" />;
}

// Selo bordado de escoteiro. earned=false mostra a silhueta para descobrir.
export function Patch({ name, icon = 'star', color = '#a995ff', earned = true, size = 112 }) {
  const id = useId().replace(/:/g, '');
  const Icon = SEAL_ICONS[icon] || Star;
  if (SEAL_ART.has(icon)) {
    return (
      <span className={`tw-patch tw-patch-art ${earned ? 'on' : ''}`} style={{ width: size, height: size }} role="img" aria-label={earned ? `Selo ${name}` : 'Selo a descobrir'}>
        <img src={`/tattooweek/art/selo-${icon}.webp`} alt="" loading="lazy" draggable="false" />
        {!earned && <b>?</b>}
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`tw-patch ${earned ? 'on' : ''}`} role="img" aria-label={earned ? `Selo ${name}` : 'Selo a descobrir'}>
      <defs>
        <radialGradient id={`g${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor={earned ? color : '#d9d4ee'} />
        </radialGradient>
        <path id={`a${id}`} d="M22 64 A38 38 0 0 0 98 64" />
      </defs>
      {/* borda bordada */}
      <circle cx="60" cy="60" r="56" fill={earned ? INK : '#bdb6dc'} />
      <circle cx="60" cy="60" r="51" fill={`url(#g${id})`} />
      <circle cx="60" cy="60" r="51" fill="none" stroke={earned ? '#fff' : '#8f88b4'} strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="38" fill="none" stroke={INK} strokeOpacity="0.15" strokeWidth="1.5" />
      {earned
        ? <Icon x="40" y="26" width="40" height="40" color={INK} strokeWidth={2.2} />
        : <text x="60" y="58" textAnchor="middle" fontSize="34" fontWeight="900" fill="#8f88b4" fontFamily="'Bagel Fat One', system-ui">?</text>}
      <text fontSize="11" fontWeight="800" fill={earned ? INK : '#8f88b4'} letterSpacing="0.6" fontFamily="'Bricolage Grotesque', system-ui">
        <textPath href={`#a${id}`} startOffset="50%" textAnchor="middle">{earned ? name.toUpperCase() : '???'}</textPath>
      </text>
    </svg>
  );
}

// Faixa de selos: os da missão ganha ficam coloridos, os outros em silhueta
export function PatchSash({ items }) {
  if (!items.length) return null;
  return (
    <div className="tw-sash">
      {items.map(it => (
        <div key={it.key} className="tw-sash-item">
          <Patch name={it.name} icon={it.icon} color={it.color} earned={it.earned} size={96} />
          <small>{it.earned ? it.name : it.hint}</small>
        </div>
      ))}
    </div>
  );
}
