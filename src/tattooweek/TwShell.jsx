import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Home, Camera, Swords, Trophy, Film, X, Upload, Loader2, CheckCircle2, Check, Clock, Zap } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { submitMission, useCountdown, CATEGORY_LABELS, PARTNERS } from './twData';
import './tattooweek.css';

const NAV = [
  { to: '/tattooweek', label: 'Início', icon: Home },
  { to: '/tattooweek/meu', label: 'Meu TW', icon: Camera },
  { to: '/tattooweek/artist', label: 'Challenge', icon: Swords },
  { to: '/tattooweek/ranking', label: 'Ranking', icon: Trophy },
  { to: '/tattooweek/retrospectiva', label: 'Vídeo', icon: Film },
];

export function TwShell({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="tw">
      <header className="tw-top">
        <button className="tw-top-brand" onClick={() => navigate('/tattooweek')}>
          <img src="/fotos artistas/logo mestres.png" alt="Mestres da Tattoo" />
          <span>Tattoo Week<br />Experience</span>
        </button>
        <nav className="tw-top-links">
          {NAV.map(n => (
            <button key={n.to} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>{n.label}</button>
          ))}
          <button className={pathname === '/tattooweek/premiacao' ? 'on' : ''} onClick={() => navigate('/tattooweek/premiacao')}>Premiação</button>
        </nav>
        <div className="tw-row">
          <SignedOut>
            <SignInButton mode="modal"><button className="tw-btn tw-btn-sm">Entrar</button></SignInButton>
          </SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </div>
      </header>
      {children}
      <nav className="tw-bottom">
        {NAV.map(n => (
          <button key={n.to} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>
            <n.icon size={20} />{n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Tela de entrada: login (Clerk) + cadastro simples na campanha
export function JoinGate({ tw, mode, children }) {
  const { user, isSignedIn, loading, participant, setParticipant } = tw;
  const [form, setForm] = useState({ name: '', phone: '', instagram: '', city: '', show_in_ranking: true, consent_media: false, consent_marketing: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: f.name || user.fullName || '' }));
  }, [user]);

  const joined = participant && (mode === 'artist' ? participant.in_challenge : participant.in_public);

  if (loading) return <div className="tw-center-screen"><Loader2 className="tw-spin" /> Carregando...</div>;

  if (!isSignedIn) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 420 }}>
          <span className="tw-kicker">{mode === 'artist' ? 'Artist Challenge' : 'Meu Tattoo Week'}</span>
          <h1 className="tw-h2" style={{ marginTop: '0.5rem' }}>Entre para participar</h1>
          <p className="tw-p" style={{ margin: '0.5rem 0 1.5rem' }}>Sem aplicativo. Use seu e-mail ou Google e comece em menos de um minuto.</p>
          <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar / Criar conta</button></SignInButton>
        </div>
      </div>
    );
  }

  if (joined) return children;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!participant && !form.consent_media) { setError('Precisamos da sua autorização para usar suas fotos no seu vídeo.'); return; }
    setSaving(true);
    setError('');
    const flags = mode === 'artist' ? { in_challenge: true } : { in_public: true };
    let res;
    if (participant) {
      res = await supabase.from('tw_participants').update({ ...flags }).eq('id', participant.id).select().single();
    } else {
      res = await supabase.from('tw_participants').insert([{
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: form.name,
        phone: form.phone,
        instagram: form.instagram,
        city: form.city,
        show_in_ranking: form.show_in_ranking,
        consent_media: form.consent_media,
        consent_marketing: form.consent_marketing,
        in_public: mode !== 'artist',
        in_challenge: mode === 'artist',
      }]).select().single();
    }
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setParticipant(res.data);
  };

  // Já tem cadastro em uma experiência: só confirma a entrada na outra
  if (participant) {
    return (
      <div className="tw-center-screen">
        <form onSubmit={handleJoin} style={{ maxWidth: 420, width: '100%' }} className="tw-stack">
          <span className="tw-kicker">{mode === 'artist' ? 'Artist Challenge' : 'Meu Tattoo Week'}</span>
          <h1 className="tw-h2">Olá, {participant.name.split(' ')[0]}!</h1>
          <p className="tw-p">{mode === 'artist'
            ? 'O Artist Challenge é a competição dos tatuadores: networking, conteúdo e desafios dos parceiros.'
            : 'Entre também no Meu Tattoo Week: 30 missões em 3 dias e um vídeo só seu no final.'}</p>
          {error && <div className="tw-error">{error}</div>}
          <button className="tw-btn tw-btn-primary tw-btn-block" disabled={saving}>{saving ? 'Entrando...' : 'Quero participar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <form onSubmit={handleJoin} className="tw-stack">
        <span className="tw-kicker">{mode === 'artist' ? 'Inscrição — Artist Challenge' : 'Inscrição — Meu Tattoo Week'}</span>
        <h1 className="tw-h2">Seu cadastro</h1>
        <p className="tw-p">Rapidinho: só o necessário para acompanhar seu progresso e te entregar o vídeo.</p>
        <label className="tw-field"><span>Nome</span><input className="tw-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
        <label className="tw-field"><span>E-mail</span><input className="tw-input" value={user.primaryEmailAddress?.emailAddress || ''} disabled /></label>
        <label className="tw-field"><span>Telefone / WhatsApp</span><input className="tw-input" type="tel" inputMode="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></label>
        <div className="tw-grid tw-grid-2">
          <label className="tw-field"><span>Instagram {mode === 'artist' ? '' : '(opcional)'}</span><input className="tw-input" placeholder="@seuperfil" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} required={mode === 'artist'} /></label>
          <label className="tw-field"><span>Cidade / Estado</span><input className="tw-input" placeholder="São Paulo, SP" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required={mode === 'artist'} /></label>
        </div>
        <label className="tw-check">
          <input type="checkbox" checked={form.consent_media} onChange={e => setForm({ ...form, consent_media: e.target.checked })} />
          <span>Autorizo o Mestres da Tattoo a armazenar e tratar as fotos e vídeos que eu enviar para validar missões e gerar minha retrospectiva. <b>Obrigatório.</b></span>
        </label>
        <label className="tw-check">
          <input type="checkbox" checked={form.consent_marketing} onChange={e => setForm({ ...form, consent_marketing: e.target.checked })} />
          <span>Autorizo que meus registros sejam divulgados nas redes do Mestres da Tattoo e dos parceiros. Opcional — sem isso, nada seu é publicado.</span>
        </label>
        <label className="tw-check">
          <input type="checkbox" checked={!form.show_in_ranking} onChange={e => setForm({ ...form, show_in_ranking: !e.target.checked })} />
          <span>Participação privada: não mostrar meu nome no ranking público.</span>
        </label>
        {error && <div className="tw-error">{error}</div>}
        <button className="tw-btn tw-btn-primary tw-btn-block" disabled={saving}>{saving ? 'Salvando...' : 'Começar'}</button>
      </form>
    </div>
  );
}

// Envio de missão: escolhe/captura fotos ou vídeos e envia
export function MissionSheet({ mission, participant, artist, onClose, onDone }) {
  const slots = Math.max(1, mission.media_count || 1);
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  const previews = useMemo(() => files.map(f => ({ url: URL.createObjectURL(f), video: f.type.startsWith('video/') })), [files]);
  useEffect(() => () => previews.forEach(p => URL.revokeObjectURL(p.url)), [previews]);

  const addFiles = (list) => {
    setFiles(prev => [...prev, ...Array.from(list)].slice(0, slots));
  };

  const send = async () => {
    setSending(true);
    setError('');
    try {
      const sub = await submitMission({ participant, mission, artistId: artist?.id, files, note });
      setDone(sub);
      onDone?.(sub);
    } catch (e) {
      setError(e.message || 'Não foi possível enviar. Tente de novo.');
    }
    setSending(false);
  };

  const partner = mission.partner && PARTNERS[mission.partner];

  return (
    <div className="tw-sheet-bg" onClick={onClose}>
      <div className="tw-sheet tw-stack" onClick={e => e.stopPropagation()}>
        <div className="tw-between">
          <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
            {mission.day && <span className="tw-chip tw-chip-gold">Dia {mission.day}</span>}
            {mission.category && mission.category !== 'dia' && <span className="tw-chip tw-chip-gold">{CATEGORY_LABELS[mission.category]}</span>}
            {partner && <span className="tw-chip" style={{ color: partner.color, borderColor: partner.color }}>{partner.name}</span>}
            <span className="tw-chip">+{mission.points} pts</span>
          </div>
          <button className="tw-sheet-x" onClick={onClose} aria-label="Fechar"><X size={22} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={56} color="#22c55e" />
            <h2 className="tw-h2" style={{ marginTop: '0.8rem' }}>{done.status === 'approved' ? `+${done.points} pontos!` : 'Enviado!'}</h2>
            <p className="tw-p">{done.status === 'approved'
              ? 'Missão concluída. Esse registro já entrou na sua retrospectiva.'
              : 'Nossa equipe vai validar seu envio. Os pontos entram assim que for aprovado.'}</p>
            <button className="tw-btn tw-btn-primary tw-btn-block" style={{ marginTop: '1.25rem' }} onClick={onClose}>Continuar</button>
          </div>
        ) : (
          <>
            <h2 className="tw-h2" style={{ fontSize: '1.4rem' }}>{mission.title}</h2>
            {artist && <div className="tw-notice">Registro com <b>{artist.name}</b></div>}
            {mission.description && <p className="tw-p">{mission.description}</p>}
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>
              {slots === 1 ? 'Envie 1 foto ou vídeo curto.' : `Envie ${slots} registros (fotos ou vídeos curtos).`}
            </p>

            <div className="tw-drop" style={slots === 1 ? { gridTemplateColumns: '1fr', maxWidth: 220, margin: '0 auto' } : undefined}>
              {Array.from({ length: slots }).map((_, i) => {
                const p = previews[i];
                if (p) {
                  return (
                    <div key={i} className="tw-slot">
                      {p.video ? <video src={p.url} muted playsInline /> : <img src={p.url} alt="" />}
                      <button className="tw-slot-x" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remover"><X size={14} /></button>
                    </div>
                  );
                }
                return (
                  <label key={i} className="tw-slot">
                    <input type="file" accept="image/*,video/*" multiple={slots > 1} hidden onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
                    <div><Camera size={26} /><div style={{ marginTop: 6 }}>Foto ou vídeo</div></div>
                  </label>
                );
              })}
            </div>

            <label className="tw-field"><span>Observação (opcional)</span>
              <textarea className="tw-input" placeholder={mission.track === 'artist' ? 'Nome do artista, @, cidade... ajuda a validar' : 'Conte o momento em uma frase'} value={note} onChange={e => setNote(e.target.value)} />
            </label>

            {error && <div className="tw-error">{error}</div>}
            <button className="tw-btn tw-btn-primary tw-btn-block" disabled={files.length < slots || sending} onClick={send}>
              {sending ? <><Loader2 size={18} className="tw-spin" /> Enviando...</> : <><Upload size={18} /> Enviar missão</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function PartnerStrip() {
  return (
    <div className="tw-partners">
      {['bronc', 'stencilflow', 'inkauthority'].map(k => (
        <span key={k} className="tw-partner" style={{ color: PARTNERS[k].color }}>{PARTNERS[k].name}</span>
      ))}
    </div>
  );
}

export function SurpriseCard({ mission, sub, onOpen }) {
  const left = useCountdown(mission.ends_at);
  return (
    <div className="tw-surprise">
      <div className="tw-between">
        <span className="tw-kicker" style={{ color: '#fca5a5' }}><Zap size={12} style={{ verticalAlign: -1 }} /> Missão surpresa</span>
        {left && <span className="tw-timer"><Clock size={13} style={{ verticalAlign: -2 }} /> {left}</span>}
      </div>
      <h3 className="tw-h3" style={{ margin: '0.5rem 0' }}>{mission.title}</h3>
      {mission.description && <p className="tw-p" style={{ fontSize: '0.88rem', marginBottom: '0.7rem' }}>{mission.description}</p>}
      {sub
        ? <span className="tw-chip tw-chip-ok"><Check size={12} /> Enviada</span>
        : <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={onOpen}>Cumprir agora · +{mission.points} pts</button>}
    </div>
  );
}
