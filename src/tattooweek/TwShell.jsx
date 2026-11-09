import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Home, Camera, Swords, Trophy, Map as MapIcon, X, Upload, Loader2, CheckCircle2, Check, Clock, Zap, UserRound, Download, Gift } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { submitMission, useCountdown, useCampaign, campaignTheme, themeStyle, CATEGORY_LABELS, DEFAULT_PARTNERS, kitItems, PARTNER_LOGOS, KIT_IMAGE, uploadMedia, readPendingSeals, clearPendingSeals, claimSeal, secretArt, refreshScreens, isRealPhoto, isGiftSeal, claimGift, cleanNick, nickError, nickSaveError } from './twData';
import './tattooweek.css';
import './poster.css';
import { GoldCoin, Char, Cloud, Sparkle, Patch } from './TwArt';

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
  // Fora de uma campanha (hub, perfil) usa o mesmo visual pôster do Desafio dos Mestres
  const poster = !ctx || theme?.style === 'poster';

  return (
    <div className={`tw ${theme?.accents?.length ? 'tw-themed' : ''} ${poster ? 'tw-poster' : ''}`} style={theme && !poster ? themeStyle(theme) : undefined}>
      <header className="tw-top">
        <button className="tw-top-brand" onClick={() => navigate(base || '/desafios')}>
          <img src="/fotos artistas/logo mestres.png" alt="Mestres da Tattoo" />
          <span>{words.join(' ')}{last && <><br />{last}</>}</span>
        </button>
        <nav className="tw-top-links">
          {nav.map(n => (
            <button key={n.to} data-tour={`nav-${n.label}`} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>{n.label}</button>
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
            <button key={n.to} data-tour={`nav-${n.label}`} className={pathname === n.to ? 'on' : ''} onClick={() => navigate(n.to)}>
              <n.icon size={20} />{n.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

// Tela de entrada: login (Clerk) + cadastro (uma vez) + inscrição na campanha
function friendlyError(err) {
  const msg = err?.message || String(err || '');
  if (/fetch|network|Failed/i.test(msg)) return 'Sem conexão agora. Confira a internet e toque de novo.';
  return `Não deu para concluir: ${msg}. Toque de novo; se continuar, chame a equipe.`;
}

// Cenário pôster das telas de entrada (nuvens, brilhos e personagens)
function JoinScene({ left = 'oni', right = 'gato' }) {
  return (
    <div className="tw-join-scene" aria-hidden="true">
      <Cloud className="tw-join-cloud c1" />
      <Cloud className="tw-join-cloud c2" />
      <Sparkle className="tw-join-spark s1" />
      <Sparkle className="tw-join-spark s2" fill="#ff8fd8" />
      <Char name={left} className="tw-join-char left" />
      <Char name={right} className="tw-join-char right" />
    </div>
  );
}

// Dica de como resolver a missão (fica fechada até a pessoa tocar)
function MissionHint({ text }) {
  const [open, setOpen] = useState(false);
  return open
    ? <div className="tw-hint"><b>💡 Dica:</b> {text}</div>
    : <button type="button" className="tw-hint-btn" onClick={() => setOpen(true)}>💡 Ver dica de como fazer</button>;
}

// Nick do jogo (opcional): aparece no ranking e no telão no lugar do nome
function NickField({ value, onChange }) {
  const err = nickError(value);
  return (
    <label className="tw-field">
      <span>Seu nick no jogo <small style={{ opacity: 0.7 }}>(opcional · aparece no ranking e no telão)</small></span>
      <input className="tw-input" placeholder="ex.: TattooKing" maxLength={20} value={value} onChange={e => onChange(e.target.value.replace(/\s+/g, ''))} autoComplete="off" />
      {value && err && <small style={{ color: '#dc2626', fontWeight: 700 }}>{err}</small>}
    </label>
  );
}

// Editar o nick depois, direto do painel do jogo
export function NickEditor({ participant, setParticipant }) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(participant?.nickname || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (!participant) return null;
  const save = async (e) => {
    e.preventDefault();
    const problem = nickError(v);
    if (problem) { setErr(problem); return; }
    setBusy(true); setErr('');
    const nick = cleanNick(v) || null;
    const { data, error } = await supabase.from('tw_participants').update({ nickname: nick }).eq('id', participant.id).select().single();
    setBusy(false);
    if (error) { setErr(nickSaveError(error)); return; }
    setParticipant?.(data); setOpen(false);
  };
  if (!open) {
    return (
      <button type="button" data-tour="nick" className="tw-chip" style={{ cursor: 'pointer', marginBottom: '0.8rem' }} onClick={() => { setV(participant.nickname || ''); setOpen(true); }}>
        {participant.nickname ? <>Nick: <b>{participant.nickname}</b> · trocar</> : '+ Criar meu nick do jogo'}
      </button>
    );
  }
  return (
    <form className="tw-card tw-stack" style={{ marginBottom: '1rem' }} onSubmit={save}>
      <label className="tw-field"><span>Seu nick no jogo (aparece no ranking e no telão)</span>
        <input className="tw-input" autoFocus maxLength={20} placeholder="ex.: TattooKing" value={v} onChange={e => setV(e.target.value.replace(/\s+/g, ''))} autoComplete="off" />
      </label>
      {err && <div className="tw-error">{err}</div>}
      <div className="tw-row" style={{ gap: '0.5rem' }}>
        <button className="tw-btn tw-btn-primary tw-btn-sm" disabled={busy}>{busy ? 'Salvando...' : 'Salvar nick'}</button>
        <button type="button" className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </form>
  );
}

// Foto de perfil: obrigatória no cadastro (vai no ranking, no card e no vídeo)
function AvatarPick({ preview, onPick, required }) {
  return (
    <label className={`tw-avatar-pick ${preview ? 'has' : ''} ${required && !preview ? 'need' : ''}`}>
      <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ''; }} />
      <span className="tw-avatar-pick-img">{preview ? <img src={preview} alt="Sua foto" /> : <Camera size={34} />}</span>
      <span className="tw-avatar-pick-txt">{preview ? 'Trocar foto' : 'Adicionar sua foto'}{required && !preview && <b> · obrigatório</b>}</span>
    </label>
  );
}

// Quem já está no jogo sem foto de verdade: pede a foto no topo (sobe na hora)
function PhotoNudge({ participant, setParticipant, user }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (isRealPhoto(participant.photo_url)) return null;
  const pick = async (file) => {
    if (!file.type.startsWith('image/')) { setErr('Escolha uma foto (imagem).'); return; }
    setBusy(true); setErr('');
    try {
      const m = await uploadMedia(file, `perfil/${user?.id || participant.id}`);
      const { data, error } = await supabase.from('tw_participants').update({ photo_url: m.url }).eq('id', participant.id).select().single();
      if (error) throw error;
      setParticipant(data);
    } catch (e) { setErr(friendlyError(e)); }
    setBusy(false);
  };
  return (
    <div className="tw-wrap" style={{ paddingBottom: 0 }}>
      <div className="tw-card tw-card-gold tw-photo-nudge">
        <AvatarPick preview={null} onPick={pick} required />
        <div>
          <h3 className="tw-h3">{busy ? 'Subindo sua foto...' : 'Coloque sua foto de perfil'}</h3>
          <p className="tw-p" style={{ fontSize: '0.85rem' }}>Ela aparece no ranking, no telão, no seu card de resultado e no vídeo. Toque no círculo para escolher.</p>
          {err && <div className="tw-error" style={{ marginTop: '0.4rem' }}>{err}</div>}
        </div>
      </div>
    </div>
  );
}

// Selos secretos lidos antes de entrar no jogo: credita e mostra a revelação
function PendingSeals({ participant, campaign, enrollments }) {
  const [shown, setShown] = useState(null);
  const tracks = enrollments.filter(e => e.campaign_id === campaign.id).map(e => e.track);
  useEffect(() => {
    const list = readPendingSeals(campaign.id);
    if (!list.length || !tracks.length) return;
    let alive = true;
    (async () => {
      let points = 0;
      const got = [];
      for (const tag of list) {
        const r = await claimSeal(campaign.id, participant.id, tracks, tag);
        if (r.fresh) { points += r.points; got.push(tag); }
      }
      clearPendingSeals(campaign.id);
      let gift = null;
      const giftTag = tracks.includes('public') && list.find(tag => isGiftSeal(campaign, tag));
      if (giftTag) { try { gift = await claimGift(campaign.id, participant.id); } catch { /* esgotado */ } }
      if (alive && (got.length || gift?.mine)) {
        setShown({ got: got.length ? got : [giftTag], points, gift, publicOnly: !tracks.includes('artist') });
        refreshScreens();
        try { navigator.vibrate?.([60, 40, 140]); } catch { /* sem vibração */ }
      }
    })();
    return () => { alive = false; };
  }, [participant.id, campaign.id, tracks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shown) return null;
  const first = shown.got[0];
  return (
    <div className="tw-modal" onClick={e => { if (e.target === e.currentTarget) setShown(null); }}>
      <div className="tw-card tw-reveal" style={{ width: 'min(440px, 100%)', marginTop: '6vh' }}>
        <span className="tw-seal-ribbon">Selo guardado!</span>
        <div className="tw-gold-stage fresh">
          <span className="tw-gold-rays" />
          <span className="tw-gold-glow" />
          {Array.from({ length: 14 }).map((_, i) => <i key={i} className="tw-gold-spark" style={{ '--a': `${i * (360 / 14)}deg`, '--d': `${(i % 4) * 0.12}s` }} />)}
          {secretArt(first.slug) ? <img className="tw-gold-medal" src={secretArt(first.slug)} alt={first.name} /> : <div className="tw-reveal-icon">★</div>}
        </div>
        <h2 className="tw-h2">{shown.got.length > 1 ? `${shown.got.length} selos secretos` : first.name}</h2>
        {!shown.publicOnly && shown.points > 0 && <div className="tw-seal-points">+{shown.points} pontos!</div>}
        {shown.gift?.mine && <div className="tw-seal-points" style={{ background: '#f07c2a' }}>Selo premiado: chaveiro Bronc!</div>}
        <p className="tw-p" style={{ margin: '0.6rem 0 1rem' }}>{shown.gift?.mine ? 'Você achou o selo premiado! Mostre esta tela e seu código na aba Missões, no stand da Bronc, para retirar o chaveiro exclusivo.' : 'O selo que você encontrou antes de entrar já está na sua conta. Bora achar os outros!'}</p>
        <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => setShown(null)}>Bora!</button>
      </div>
    </div>
  );
}

export function JoinGate({ tw, track, children }) {
  const { campaign } = useCampaign();
  const { user, isSignedIn, loading, participant, setParticipant, isEnrolled, setEnrollments, enrollments } = tw;
  const [form, setForm] = useState({ name: '', nickname: '', phone: '', instagram: '', city: '', show_in_ranking: true, consent_media: false, consent_marketing: false });
  const [photo, setPhoto] = useState(null); // { file, preview }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const label = track === 'artist' ? 'Artist Challenge' : `Meu ${campaign.event_name || 'evento'}`;
  const pendingCount = readPendingSeals(campaign.id).length;

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: f.name || user.fullName || '' }));
  }, [user]);
  useEffect(() => () => { if (photo?.preview) URL.revokeObjectURL(photo.preview); }, [photo]);

  const pickPhoto = (file) => {
    if (!file.type.startsWith('image/')) { setError('Escolha uma foto (imagem).'); return; }
    setError('');
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  if (loading) return <div className="tw-center-screen"><Loader2 className="tw-spin" /></div>;

  if (!isSignedIn) {
    return (
      <div className="tw-wrap tw-join" style={{ maxWidth: 520 }}>
        <JoinScene left={track === 'artist' ? 'tigre' : 'oni'} right="gato" />
        <div className="tw-card tw-join-card">
          <span className="tw-kicker">{label}</span>
          <h1 className="tw-h2" style={{ margin: '0.4rem 0' }}>Entre no Desafio dos Mestres</h1>
          {pendingCount > 0 && <div className="tw-notice" style={{ margin: '0.4rem 0 0.8rem' }}>🔑 Você tem {pendingCount} selo{pendingCount > 1 ? 's' : ''} secreto{pendingCount > 1 ? 's' : ''} guardado{pendingCount > 1 ? 's' : ''}. Entre para ele{pendingCount > 1 ? 's' : ''} cair na sua conta!</div>}
          <p className="tw-p">Sem aplicativo. Use seu e-mail ou Google e comece em menos de 1 minuto.</p>
          <ol className="tw-join-steps">
            <li><b>1</b>Entre com e-mail ou Google</li>
            <li><b>2</b>Coloque sua foto e seus dados</li>
            <li><b>3</b>Cumpra missões, ache selos e suba no ranking</li>
          </ol>
          <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar / Criar conta</button></SignInButton>
        </div>
      </div>
    );
  }

  if (participant?.blocked) {
    return (
      <div className="tw-center-screen">
        <div className="tw-card" style={{ maxWidth: 420 }}>
          <h1 className="tw-h2">Participação suspensa</h1>
          <p className="tw-p" style={{ marginTop: '0.5rem' }}>{participant.blocked_reason || 'Sua participação foi desclassificada pela organização.'} Fale com a equipe do Mestres da Tattoo no evento.</p>
        </div>
      </div>
    );
  }

  if (participant && isEnrolled(campaign.id, track)) {
    return <><PhotoNudge participant={participant} setParticipant={setParticipant} user={user} />{children}<PendingSeals participant={participant} campaign={campaign} enrollments={enrollments} /></>;
  }

  const hasPhoto = !!(photo || isRealPhoto(participant?.photo_url) || (!participant && user?.hasImage));

  const uploadPhoto = async () => {
    if (!photo) return null;
    const m = await uploadMedia(photo.file, `perfil/${user.id}`);
    return m.url;
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!participant && !form.consent_media) { setError('Precisamos da sua autorização para usar suas fotos no seu vídeo.'); return; }
    if (!hasPhoto) { setError('Coloque uma foto sua: ela aparece no ranking, no card e no vídeo.'); return; }
    const nickProblem = nickError(form.nickname);
    if (nickProblem) { setError(nickProblem); return; }
    const nick = cleanNick(form.nickname);
    setSaving(true);
    setError('');
    let p = participant;
    try {
      const photoUrl = await uploadPhoto();
      const flag = track === 'artist' ? { in_challenge: true } : { in_public: true };
      if (!p) {
        const res = await supabase.from('tw_participants').insert([{
          clerk_id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: form.name,
          ...(nick ? { nickname: nick } : {}),
          phone: form.phone,
          instagram: form.instagram,
          city: form.city,
          photo_url: photoUrl || user.imageUrl,
          show_in_ranking: form.show_in_ranking,
          consent_media: form.consent_media,
          consent_marketing: form.consent_marketing,
          in_public: track !== 'artist',
          in_challenge: track === 'artist',
        }]).select().single();
        if (res.error && nick && (res.error.code === '23505' || /nickname/i.test(res.error.message || ''))) {
          setSaving(false); setError(nickSaveError(res.error)); return;
        }
        if (res.error) {
          // Cadastro já existe (ex.: conexão caiu no meio): reaproveita em vez de travar
          const again = await supabase.from('tw_participants').select('*').eq('clerk_id', user.id).maybeSingle();
          if (!again.data) { setSaving(false); setError(friendlyError(res.error)); return; }
          p = again.data;
        } else p = res.data;
        setParticipant(p);
      } else {
        const patch = { ...(!p[track === 'artist' ? 'in_challenge' : 'in_public'] ? flag : {}), ...(photoUrl ? { photo_url: photoUrl } : {}), ...(nick && nick !== p.nickname ? { nickname: nick } : {}) };
        if (Object.keys(patch).length) {
          const res = await supabase.from('tw_participants').update(patch).eq('id', p.id).select().single();
          if (res.error && patch.nickname) { setSaving(false); setError(nickSaveError(res.error)); return; }
          if (res.data) p = res.data;
        }
      }
      const en = await supabase.from('tw_enrollments')
        .upsert({ participant_id: p.id, campaign_id: campaign.id, track }, { onConflict: 'participant_id,campaign_id,track' })
        .select().single();
      setSaving(false);
      if (en.error) { setError(friendlyError(en.error)); return; }
      setEnrollments(list => [...list.filter(x => x.id !== en.data.id), en.data]);
      setParticipant(p);
    } catch (err) {
      setSaving(false);
      setError(friendlyError(err));
    }
  };

  // Já tem cadastro: confirma a inscrição nesta trilha (e pede a foto se ainda não tiver)
  if (participant) {
    return (
      <div className="tw-wrap tw-join" style={{ maxWidth: 520 }}>
        <JoinScene left={track === 'artist' ? 'tigre' : 'oni'} right="dragao" />
        <form onSubmit={handleJoin} className="tw-card tw-join-card tw-stack">
          <span className="tw-kicker">{label}</span>
          <h1 className="tw-h2">Olá, {participant.nickname || participant.name.split(' ')[0]}!</h1>
          <AvatarPick preview={photo?.preview || (isRealPhoto(participant.photo_url) ? participant.photo_url : null)} onPick={pickPhoto} required={!isRealPhoto(participant.photo_url)} />
          <p className="tw-p">{track === 'artist'
            ? 'O Artist Challenge é a competição dos tatuadores: 5 missões por dia, selos secretos e, todo dia, 1 impressora Bronc + 10 mil pontos no app E-Bronc.'
            : `Entre no ${label}: missões para montar um vídeo só seu da Tattoo Week, e selos secretos escondidos no evento. Um deles dá um chaveiro exclusivo Bronc!`}</p>
          {!participant.nickname && <NickField value={form.nickname} onChange={v => setForm({ ...form, nickname: v })} />}
          {error && <div className="tw-error">{error}</div>}
          <button className="tw-btn tw-btn-primary tw-btn-block" disabled={saving}>{saving ? 'Entrando...' : 'Quero participar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="tw-wrap tw-join" style={{ maxWidth: 560 }}>
      <JoinScene left={track === 'artist' ? 'tigre' : 'oni'} right="caveira" />
      <form onSubmit={handleJoin} className="tw-card tw-join-card tw-stack">
        <span className="tw-kicker">Inscrição · {label}</span>
        <h1 className="tw-h2">Seu cadastro</h1>
        <p className="tw-p">Rapidinho: só o necessário para acompanhar seu progresso e te entregar o vídeo. Vale para os próximos desafios também.</p>
        <AvatarPick preview={photo?.preview || (user?.hasImage ? user.imageUrl : null)} onPick={pickPhoto} required />
        <label className="tw-field"><span>Nome</span><input className="tw-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
        <NickField value={form.nickname} onChange={v => setForm({ ...form, nickname: v })} />
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
            {mission.track === 'public' ? <span className="tw-chip">vai pro seu vídeo</span> : <span className="tw-chip">+{mission.points} pts</span>}
          </div>
          <button className="tw-sheet-x" onClick={onClose} aria-label="Fechar"><X size={22} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
            {mission.seal_name ? (
              <>
                <span className="tw-seal-ribbon">Selo conquistado!</span>
                <div className="tw-gold-stage fresh tw-patch-stage">
                  <span className="tw-gold-rays" />
                  <span className="tw-gold-glow" />
                  {Array.from({ length: 14 }).map((_, i) => <i key={i} className="tw-gold-spark" style={{ '--a': `${i * (360 / 14)}deg`, '--d': `${(i % 4) * 0.12}s` }} />)}
                  <span className="tw-patch-pop"><Patch name={mission.seal_name} icon={mission.seal_icon || 'star'} color={mission.seal_color || '#a995ff'} size={170} /></span>
                </div>
                <h2 className="tw-h2" style={{ margin: '0.2rem 0' }}>{mission.seal_name}</h2>
              </>
            ) : <CheckCircle2 size={56} color="#22c55e" />}
            <h2 className={mission.seal_name ? 'tw-seal-points' : 'tw-h2'} style={{ marginTop: '0.6rem' }}>{mission.track === 'public' ? 'Guardado no seu vídeo!' : done.status === 'approved' ? `+${done.points} pontos!` : 'Enviado!'}</h2>
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
            {mission.hint && <MissionHint text={mission.hint} />}
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

export function PartnerLogo({ partner, height = 40 }) {
  const meta = PARTNER_LOGOS[partner.id] || {};
  const src = partner.logo_url || meta.src;
  if (!src) return <span className="tw-partner" style={{ color: partner.color }}>{partner.name}</span>;
  const cls = ['tw-plogo', meta.dark && 'dark', meta.square && 'square', src.endsWith('.svg') && 'bare'].filter(Boolean).join(' ');
  return <span className={cls} style={{ height, ...(meta.square ? { width: height } : {}) }}><img src={src} alt={partner.name} loading="lazy" /></span>;
}

export function PartnerStrip({ list }) {
  return (
    <div className="tw-partners">
      {list.map(p => <PartnerLogo key={p.id} partner={p} height={50} />)}
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
        : <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={onOpen}>Cumprir agora{mission.track === 'public' ? '' : ` · +${mission.points} pts`}</button>}
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

// Os selos secretos: medalhão dourado revelado só depois de encontrado
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

// Participação privada: avisa que não aparece no ranking (nem concorre) e deixa sair com um toque
export function PrivateNotice({ participant, setParticipant, onChange }) {
  const [saving, setSaving] = useState(false);
  if (!participant || participant.show_in_ranking !== false) return null;
  const go = async () => {
    setSaving(true);
    const { data } = await supabase.from('tw_participants').update({ show_in_ranking: true }).eq('id', participant.id).select().single();
    setSaving(false);
    if (data) { setParticipant?.(data); onChange?.(); }
  };
  return (
    <div className="tw-notice" style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ flex: '1 1 220px' }}><b>Você está em participação privada.</b> Seu nome não aparece no ranking nem no telão, e você não concorre ao prêmio do dia.</span>
      <button className="tw-btn tw-btn-primary tw-btn-sm" disabled={saving} onClick={go}>{saving ? 'Salvando...' : 'Aparecer no ranking'}</button>
    </div>
  );
}

// Kit do dia do Artist Challenge: o que leva e o que precisa para ganhar
export function KitCard({ campaign, dayNum, hasAllSeals, foundSeals, needSeals, isLeader, onRanking, compact }) {
  const items = kitItems(campaign);
  return (
    <div className="tw-card tw-card-gold tw-kit" data-tour="kit" style={{ marginTop: '1rem' }}>
      <div className="tw-between" style={{ alignItems: 'flex-start', gap: '0.75rem' }}>
        <div>
          <span className="tw-kicker"><Gift size={12} style={{ verticalAlign: -1 }} /> Prêmio do dia{dayNum ? ` · dia ${dayNum}` : ''}</span>
          <h3 className="tw-h3" style={{ margin: '0.25rem 0' }}>1 impressora Bronc + 10 mil pontos no app E-Bronc, por dia, para o tatuador nº 1 do dia</h3>
        </div>
        {isLeader && <span className="tw-chip tw-chip-ok" style={{ whiteSpace: 'nowrap' }}>Você está na frente!</span>}
      </div>
      {!compact && (
        <>
          <img className="tw-kit-photo" src={KIT_IMAGE} alt="Impressora de stencil Bronc" loading="lazy" />
          <ul className="tw-kit-list">
            {items.map(i => <li key={i}>{i}</li>)}
          </ul>
        </>
      )}
      <div className="tw-kit-rules">
        <span className={hasAllSeals ? 'ok' : ''}>{hasAllSeals ? '✓' : '○'} Ter os {needSeals} selos secretos{foundSeals != null ? ` (${foundSeals}/${needSeals})` : ''}</span>
        <span>○ Ser o maior pontuador do dia (empate: quem chegou primeiro)</span>
        <span>○ Quem já ganhou não disputa os outros dias</span>
      </div>
      {onRanking && <button className="tw-btn tw-btn-sm" style={{ marginTop: '0.75rem' }} onClick={onRanking}><Trophy size={14} /> Ranking ao vivo</button>}
    </div>
  );
}

// --- Boas-vindas + tour guiado com setas (aparece na primeira vez que a pessoa entra no jogo) ---
function tourTarget(name) {
  const list = [...document.querySelectorAll(`[data-tour="${name}"]`)];
  return list.find(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) || null;
}

export function GuideTour({ storageKey, welcome, steps, forceOpen, onClose }) {
  const [stage, setStage] = useState(null); // null | 'welcome' | número do passo
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (forceOpen) { setStage('welcome'); return; }
    let seen = false;
    try { seen = !!localStorage.getItem(storageKey); } catch { /* sem storage */ }
    if (!seen) { const t = setTimeout(() => setStage('welcome'), 600); return () => clearTimeout(t); }
  }, [storageKey, forceOpen]);

  const live = typeof stage === 'number' ? steps.filter(s => tourTarget(s.target)) : [];
  const step = typeof stage === 'number' ? live[stage] : null;

  useEffect(() => {
    if (!step) return;
    const el = tourTarget(step.target);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    let raf;
    const tick = () => { const r = el.getBoundingClientRect(); setRect({ x: r.left, y: r.top, w: r.width, h: r.height }); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const finish = () => {
    try { localStorage.setItem(storageKey, '1'); } catch { /* sem storage */ }
    setStage(null); setRect(null); onClose?.();
  };
  const next = () => (stage + 1 < live.length ? setStage(stage + 1) : finish());

  if (stage === null) return null;

  if (stage === 'welcome') {
    return (
      <div className="tw-modal tw-tour-welcome" onClick={e => { if (e.target === e.currentTarget) finish(); }}>
        <div className="tw-card tw-stack" style={{ width: 'min(460px, 100%)', marginTop: '7vh', textAlign: 'center' }}>
          <Char name={welcome.char || 'gato'} className="tw-tour-char" />
          <span className="tw-kicker">{welcome.kicker}</span>
          <h2 className="tw-h2" style={{ margin: '0.2rem 0' }}>{welcome.title}</h2>
          <ol className="tw-join-steps" style={{ textAlign: 'left', margin: '0.6rem 0' }}>
            {welcome.points.map((p, i) => <li key={i}><b>{i + 1}</b>{p}</li>)}
          </ol>
          <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => setStage(0)}>Me mostra por onde começar</button>
          <button className="tw-btn tw-btn-ghost tw-btn-block" onClick={finish}>Já sei, pular</button>
        </div>
      </div>
    );
  }

  if (!step || !rect) return <div className="tw-tour-block" onClick={next} />;
  const pad = 10;
  const below = rect.y + rect.h / 2 < window.innerHeight / 2;
  const hole = { left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 };
  const arrowTop = below ? hole.top + hole.height + 6 : hole.top - 74;
  const cardTop = below ? Math.min(window.innerHeight - 210, hole.top + hole.height + 80) : Math.max(12, hole.top - 74 - 190);
  return (
    <>
      <div className="tw-tour-block" />
      <div className="tw-tour-hole" style={hole} />
      <div className={`tw-tour-arrow ${below ? 'up' : 'down'}`} style={{ top: arrowTop, left: Math.min(window.innerWidth - 70, Math.max(10, rect.x + rect.w / 2 - 30)) }}>{below ? '⬆' : '⬇'}</div>
      <div className="tw-tour-card" style={{ top: cardTop }}>
        <span className="tw-kicker">Passo {stage + 1} de {live.length}</span>
        <h3 className="tw-h3" style={{ margin: '0.2rem 0 0.3rem' }}>{step.title}</h3>
        <p className="tw-p" style={{ fontSize: '0.9rem' }}>{step.text}</p>
        <div className="tw-row" style={{ gap: '0.5rem', marginTop: '0.7rem' }}>
          <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={next}>{stage + 1 < live.length ? 'Próximo' : 'Bora começar!'}</button>
          {stage > 0 && <button className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setStage(stage - 1)}>Voltar</button>}
          <button className="tw-btn tw-btn-ghost tw-btn-sm" style={{ marginLeft: 'auto' }} onClick={finish}>Pular</button>
        </div>
      </div>
    </>
  );
}

export function TourButton({ onClick }) {
  return <button type="button" className="tw-tour-help" onClick={onClick} aria-label="Ver o guia">?</button>;
}
