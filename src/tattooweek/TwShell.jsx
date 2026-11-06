import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Home, Camera, Swords, Trophy, Map as MapIcon, X, Upload, Loader2, CheckCircle2, Check, Clock, Zap, UserRound, Download } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { submitMission, useCountdown, useCampaign, campaignTheme, themeStyle, CATEGORY_LABELS, DEFAULT_PARTNERS } from './twData';
import './tattooweek.css';
import './poster.css';
import { GoldCoin } from './TwArt';

export function TwShell({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ctx = useCampaign();
  const base = ctx?.base;

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const nav = base
    ? [
      { to: base, label: 'Início', icon: Home },
      { to: `${base}/meu`, label: 'Missões', icon: Camera },
      { to: `${base}/artist`, label: 'Challenge', icon: Swords },
      { to: `${base}/ranking`, label: 'Ranking', icon: Trophy },
      { to: `${base}/mapa`, label: 'Mapa', icon: MapIcon },
    ]
    : [{ to: '/desafios', label: 'Desafios', icon: Home }];

  // Quebra antes da última palavra: "Desafio dos" / "Mestres"
  const words = (ctx?.campaign.name || 'Desafio dos Mestres').split(' ');
  const last = words.length > 1 ? words.pop() : '';

  const theme = ctx ? campaignTheme(ctx.campaign) : null;

  return (
    <div className={`tw ${theme?.accents?.length ? 'tw-themed' : ''} ${theme?.style === 'poster' ? 'tw-poster' : ''}`} style={theme && theme.style !== 'poster' ? themeStyle(theme) : undefined}>
      <header className="tw-top">
        <button className="tw-top-brand" onClick={() => navigate(base || '/desafios')}>
          <img src="/fotos artistas/logo mestres.png" alt="Mestres da Tattoo" />
          <span>{words.join(' ')}{last && <><br />{last}</>}</span>
        </button>
        <nav className="tw-top-links">
          {nav.map(n => (
            <button key={n.to} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>{n.label}</button>
          ))}
          {base && <button className={pathname === `${base}/premiacao` ? 'on' : ''} onClick={() => navigate(`${base}/premiacao`)}>Premiação</button>}
        </nav>
        <div className="tw-row">
          <SignedOut>
            <SignInButton mode="modal"><button className="tw-btn tw-btn-sm">Entrar</button></SignInButton>
          </SignedOut>
          <SignedIn>
            <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate('/desafios/perfil')} aria-label="Meu perfil"><UserRound size={16} /></button>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      {ctx && <Announcements campaignId={ctx.campaign.id} />}
      {children}
      {base && (
        <nav className="tw-bottom">
          {nav.map(n => (
            <button key={n.to} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>
              <n.icon size={20} />{n.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

// Tela de entrada: login (Clerk) + cadastro (uma vez) + inscrição na campanha
export function JoinGate({ tw, track, children }) {
  const { campaign } = useCampaign();
  const { user, isSignedIn, loading, participant, setParticipant, isEnrolled, setEnrollments } = tw;
  const [form, setForm] = useState({ name: '', phone: '', instagram: '', city: '', show_in_ranking: true, consent_media: false, consent_marketing: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const label = track === 'artist' ? 'Artist Challenge' : `Meu ${campaign.event_name || 'evento'}`;

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: f.name || user.fullName || '' }));
  }, [user]);

  if (loading) return <div className="tw-center-screen"><Loader2 className="tw-spin" /></div>;

  if (!isSignedIn) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 420 }}>
          <span className="tw-kicker">{label}</span>
          <h1 className="tw-h2" style={{ marginTop: '0.5rem' }}>Entre para participar</h1>
          <p className="tw-p" style={{ margin: '0.5rem 0 1.5rem' }}>Sem aplicativo. Use seu e-mail ou Google e comece em menos de um minuto.</p>
          <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar / Criar conta</button></SignInButton>
        </div>
      </div>
    );
  }

  if (participant?.blocked) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 420 }}>
          <h1 className="tw-h2">Participação suspensa</h1>
          <p className="tw-p" style={{ marginTop: '0.5rem' }}>{participant.blocked_reason || 'Sua participação foi desclassificada pela organização.'} Fale com a equipe do Mestres da Tattoo no evento.</p>
        </div>
      </div>
    );
  }

  if (participant && isEnrolled(campaign.id, track)) return children;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!participant && !form.consent_media) { setError('Precisamos da sua autorização para usar suas fotos no seu vídeo.'); return; }
    setSaving(true);
    setError('');
    let p = participant;
    const flag = track === 'artist' ? { in_challenge: true } : { in_public: true };
    if (!p) {
      const res = await supabase.from('tw_participants').insert([{
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: form.name,
        phone: form.phone,
        instagram: form.instagram,
        city: form.city,
        photo_url: user.imageUrl,
        show_in_ranking: form.show_in_ranking,
        consent_media: form.consent_media,
        consent_marketing: form.consent_marketing,
        in_public: track !== 'artist',
        in_challenge: track === 'artist',
      }]).select().single();
      if (res.error) { setSaving(false); setError(res.error.message); return; }
      p = res.data;
    } else if (!p[track === 'artist' ? 'in_challenge' : 'in_public']) {
      const res = await supabase.from('tw_participants').update(flag).eq('id', p.id).select().single();
      if (res.data) p = res.data;
    }
    const en = await supabase.from('tw_enrollments')
      .upsert({ participant_id: p.id, campaign_id: campaign.id, track }, { onConflict: 'participant_id,campaign_id,track' })
      .select().single();
    setSaving(false);
    if (en.error) { setError(en.error.message); return; }
    setEnrollments(list => [...list, en.data]);
    setParticipant(p);
  };

  // Já tem cadastro: só confirma a inscrição nesta campanha/trilha
  if (participant) {
    return (
      <div className="tw-center-screen">
        <form onSubmit={handleJoin} style={{ maxWidth: 420, width: '100%' }} className="tw-stack">
          <span className="tw-kicker">{label}</span>
          <h1 className="tw-h2">Olá, {participant.name.split(' ')[0]}!</h1>
          <p className="tw-p">{track === 'artist'
            ? 'O Artist Challenge é a competição dos tatuadores: networking, conteúdo e desafios dos parceiros.'
            : `Entre no ${label}: missões todos os dias e um vídeo só seu no final.`}</p>
          {error && <div className="tw-error">{error}</div>}
          <button className="tw-btn tw-btn-primary tw-btn-block" disabled={saving}>{saving ? 'Entrando...' : 'Quero participar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <form onSubmit={handleJoin} className="tw-stack">
        <span className="tw-kicker">Inscrição — {label}</span>
        <h1 className="tw-h2">Seu cadastro</h1>
        <p className="tw-p">Rapidinho: só o necessário para acompanhar seu progresso e te entregar o vídeo. Vale para os próximos desafios também.</p>
        <label className="tw-field"><span>Nome</span><input className="tw-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
        <label className="tw-field"><span>E-mail</span><input className="tw-input" value={user.primaryEmailAddress?.emailAddress || ''} disabled /></label>
        <label className="tw-field"><span>Telefone / WhatsApp</span><input className="tw-input" type="tel" inputMode="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></label>
        <div className="tw-grid tw-grid-2">
          <label className="tw-field"><span>Instagram {track === 'artist' ? '' : '(opcional)'}</span><input className="tw-input" placeholder="@seuperfil" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} required={track === 'artist'} /></label>
          <label className="tw-field"><span>Cidade / Estado</span><input className="tw-input" placeholder="São Paulo, SP" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required={track === 'artist'} /></label>
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
          <span>Participação privada: não mostrar meu nome no ranking nem meu perfil público.</span>
        </label>
        {error && <div className="tw-error">{error}</div>}
        <button className="tw-btn tw-btn-primary tw-btn-block" disabled={saving}>{saving ? 'Salvando...' : 'Começar'}</button>
      </form>
    </div>
  );
}

// Links (https://...) saem do texto da missão e viram botões (ex.: "Baixar na App Store")
const URL_RE = /https?:\/\/[^\s)]+/g;

function splitLinks(text) {
  const links = text.match(URL_RE) || [];
  const clean = text.replace(/\s*\(?https?:\/\/[^\s)]+\)?/g, '').replace(/\s+([.,])/g, '$1').trim();
  return { clean, links };
}

function linkLabel(url) {
  if (url.includes('apps.apple.com')) return 'Baixar na App Store';
  if (url.includes('play.google.com')) return 'Baixar no Google Play';
  return 'Abrir link';
}

// Envio de missão: escolhe/captura fotos ou vídeos e envia
export function MissionSheet({ mission, participant, artist, onClose, onDone }) {
  const ctx = useCampaign();
  const partners = ctx?.partners || DEFAULT_PARTNERS;
  const needsPost = !!mission.require_post;
  const tags = (ctx?.campaign.follow_partners || []).map(id => partners[id]?.instagram).filter(Boolean).map(h => `@${h.replace(/^@/, '')}`);
  // media_count 0 = só resposta (pergunta)
  const slots = Math.max(0, mission.media_count ?? 1);
  const isQuiz = !!mission.answer_hash || mission.category === 'quiz';
  const quizReady = !!mission.answer_hash; // pergunta sem resposta cadastrada no admin fica fechada
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState('');
  const [answer, setAnswer] = useState('');
  const [postUrl, setPostUrl] = useState('');
  // Aceita link de post, reel ou story do Instagram (instagram.com/p/..., /reel/..., /stories/...)
  const postOk = !needsPost || /instagram\.com\/(p|reel|reels|stories|tv)\//i.test(postUrl.trim());
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
      const sub = await submitMission({ participant, mission, artistId: artist?.id, files, note, answer: isQuiz ? answer : undefined, postUrl: needsPost ? postUrl.trim() : undefined });
      setDone(sub);
      onDone?.(sub);
    } catch (e) {
      setError(e.message || 'Não foi possível enviar. Tente de novo.');
    }
    setSending(false);
  };

  const partner = mission.partner && partners[mission.partner];

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
            <p className="tw-p">{isQuiz
              ? 'Resposta certa! Missão concluída.'
              : 'Missão concluída. Esse registro já entrou na sua retrospectiva.'}</p>
            <button className="tw-btn tw-btn-primary tw-btn-block" style={{ marginTop: '1.25rem' }} onClick={onClose}>Continuar</button>
          </div>
        ) : (
          <>
            <h2 className="tw-h2" style={{ fontSize: '1.4rem' }}>{mission.title}</h2>
            {artist && <div className="tw-notice">📍 <b>{artist.name}</b></div>}
            {mission.description && (() => {
              const { clean, links } = splitLinks(mission.description);
              return (
                <>
                  {clean && <p className="tw-p">{clean}</p>}
                  {links.map(url => (
                    <a key={url} className="tw-btn tw-btn-block" href={url} target="_blank" rel="noreferrer">
                      <Download size={18} /> {linkLabel(url)}
                    </a>
                  ))}
                </>
              );
            })()}
            {isQuiz && !quizReady && <div className="tw-notice">Esta pergunta abre em breve. Fique de olho!</div>}
            {isQuiz && quizReady && (
              <label className="tw-field"><span>Sua resposta</span>
                <input className="tw-input" placeholder={mission.answer_hint || 'Digite a resposta'} value={answer} onChange={e => { setAnswer(e.target.value); setError(''); }} autoComplete="off" />
              </label>
            )}
            {slots > 0 && (
              <p className="tw-p" style={{ fontSize: '0.85rem' }}>
                {slots === 1 ? (isQuiz ? 'E envie o print que comprova.' : 'Envie 1 foto ou vídeo curto.') : `Envie ${slots} registros (fotos, vídeos ou prints).`}
              </p>
            )}

            {slots > 0 && <div className="tw-drop" style={slots === 1 ? { gridTemplateColumns: '1fr', maxWidth: 220, margin: '0 auto' } : undefined}>
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
            </div>}

            {needsPost && (
              <div className="tw-card tw-stack" style={{ padding: '0.8rem' }}>
                <b style={{ fontSize: '0.9rem' }}>Poste no seu perfil marcando:</b>
                <div className="tw-tags">{tags.map(t => <code key={t}>{t}</code>)}</div>
                {tags.length > 0 && <button type="button" className="tw-btn tw-btn-sm" onClick={() => navigator.clipboard?.writeText(tags.join(' '))}>Copiar marcações</button>}
                <label className="tw-field"><span>Link do post</span>
                  <input className="tw-input" type="url" inputMode="url" placeholder="https://www.instagram.com/p/..." value={postUrl} onChange={e => setPostUrl(e.target.value)} />
                </label>
                {postUrl && !postOk && <small style={{ color: '#b0123a', fontWeight: 700 }}>Cole o link do post ou reel do Instagram.</small>}
              </div>
            )}

            {!isQuiz && (
              <label className="tw-field"><span>Observação (opcional)</span>
                <textarea className="tw-input" placeholder={mission.track === 'artist' ? 'Nome do artista, @, cidade... ajuda a validar' : 'Conte o momento em uma frase'} value={note} onChange={e => setNote(e.target.value)} />
              </label>
            )}

            {error && <div className="tw-error">{error}</div>}
            <button className="tw-btn tw-btn-primary tw-btn-block" disabled={files.length < slots || (isQuiz && (!quizReady || !answer.trim())) || !postOk || sending} onClick={send}>
              {sending ? <><Loader2 size={18} className="tw-spin" /> Enviando...</> : <><Upload size={18} /> Enviar missão</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Avisos da organização (aba Avisos do admin). Some depois de fechado.
function Announcements({ campaignId }) {
  const [list, setList] = useState([]);
  const [hidden, setHidden] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tw-hidden-notices') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const load = () => {
      const now = new Date().toISOString();
      supabase.from('tw_announcements').select('*').eq('campaign_id', campaignId).eq('active', true)
        .lte('starts_at', now).or(`ends_at.is.null,ends_at.gt.${now}`).order('created_at', { ascending: false })
        .then(({ data }) => setList(data || []));
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [campaignId]);

  const close = (id) => {
    const next = [...hidden, id];
    setHidden(next);
    try { localStorage.setItem('tw-hidden-notices', JSON.stringify(next)); } catch { /* sem storage */ }
  };

  const visible = list.filter(a => !hidden.includes(a.id));
  if (!visible.length) return null;
  return (
    <div className="tw-notices">
      {visible.map(a => (
        <div key={a.id} className={`tw-notice-bar ${a.level === 'urgent' ? 'urgent' : ''}`}>
          <span style={{ flex: 1 }}>
            {a.message}
            {a.link && <> <a href={a.link} className="tw-gold" style={{ fontWeight: 800 }}>Ver</a></>}
          </span>
          <button className="tw-sheet-x" onClick={() => close(a.id)} aria-label="Fechar aviso"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export function PartnerStrip({ list }) {
  return (
    <div className="tw-partners">
      {list.map(p => <span key={p.id} className="tw-partner" style={{ color: p.color }}>{p.name}</span>)}
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
      {sub && sub.status !== 'rejected'
        ? <span className="tw-chip tw-chip-ok"><Check size={12} /> Enviada</span>
        : <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={onOpen}>Cumprir agora · +{mission.points} pts</button>}
    </div>
  );
}

export function BadgeGrid({ badges, all, small }) {
  const earned = new Set(badges.map(b => b.id));
  const list = all || badges;
  if (!list.length) return <div className="tw-empty" style={{ padding: '1.25rem' }}>Cumpra missões para ganhar selos.</div>;
  return (
    <div className={`tw-badge-grid ${small ? 'small' : ''}`}>
      {list.map(b => (
        <div key={b.id} className={`tw-seal ${earned.has(b.id) ? 'on' : ''}`} title={b.desc}>
          <span className="tw-seal-icon">{b.icon}</span>
          <b>{b.title}</b>
          {!small && <small>{b.desc}</small>}
        </div>
      ))}
    </div>
  );
}

// Os 5 selos secretos: medalhão dourado revelado só depois de encontrado
export function SealStrip({ seals, found }) {
  if (!seals.length) return null;
  return (
    <div className="tw-seals">
      {seals.map(s => {
        const got = found.has(s.id);
        return (
          <div key={s.id} className="tw-seal-secret" title={got ? s.name : 'Selo secreto'}>
            <GoldCoin slug={s.slug} name={s.name} found={got} size={64} />
            <small>{got ? s.name : '???'}</small>
          </div>
        );
      })}
    </div>
  );
}
