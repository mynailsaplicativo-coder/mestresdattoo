import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AtSign, MapPin, Nfc, KeyRound, Check, Camera, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, MissionSheet } from './TwShell';
import { useTwParticipant, useCampaign, trackEvent, instagramUrl, activationKey, secretArt, savePendingSeal, claimSeal, isGiftSeal, claimGift, giftCode, PUBLIC_GIFT } from './twData';
import { Char, Cloud, Sparkle } from './TwArt';

// Página aberta pelo adesivo NFC (ou QR). Três tipos: ponto, selo secreto e ativação do Artist Challenge.
export default function TwNfc() {
  const { artistSlug: slug } = useParams();
  const [params] = useSearchParams();
  const { campaign } = useCampaign();
  const tw = useTwParticipant();
  const { participant, loading } = tw;
  const [tag, setTag] = useState(undefined);
  const tracked = useRef('');

  useEffect(() => {
    supabase.from('tw_artists').select('*, secret:tw_missions!tw_artists_reveals_mission_id_fkey(*)').eq('campaign_id', campaign.id).eq('slug', slug).maybeSingle()
      .then(({ data }) => setTag(data || null));
  }, [slug, campaign.id]);

  // Registra a leitura (uma vez por sessão do navegador por adesivo)
  useEffect(() => {
    if (loading || !tag) return;
    const key = `tw-scan-${campaign.id}-${slug}-${participant?.id || 'anon'}`;
    if (tracked.current === key) return; // re-registra se a pessoa entrar na conta depois de ler
    tracked.current = key;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* modo privado */ }
    trackEvent(params.get('src') === 'qr' ? 'qr_scan' : 'nfc_scan', slug, participant?.id, campaign.id);
  }, [loading, tag, slug, participant, params, campaign.id]);

  if (tag === undefined) return <TwShell><div className="tw-center-screen"><Loader2 className="tw-spin" /></div></TwShell>;
  if (tag === null || !tag.active) return <TwShell><NotFound /></TwShell>;

  const kind = tag.kind || 'point';
  return (
    <TwShell>
      {kind === 'secret' && <SecretSeal tag={tag} tw={tw} />}
      {kind === 'activation' && <Activation tag={tag} tw={tw} />}
      {kind === 'point' && <Point tag={tag} tw={tw} />}
    </TwShell>
  );
}

function NotFound() {
  const navigate = useNavigate();
  const { campaign, base } = useCampaign();
  return (
    <div className="tw-center-screen">
      <div>
        <Nfc size={48} color="var(--tw-gold)" />
        <h1 className="tw-h2" style={{ marginTop: '1rem' }}>Adesivo não encontrado</h1>
        <button className="tw-btn" style={{ marginTop: '1rem' }} onClick={() => navigate(base)}>Ir para {campaign.name}</button>
      </div>
    </div>
  );
}

function JoinPrompt({ tw, text, bare }) {
  const navigate = useNavigate();
  const { base } = useCampaign();
  return (
    <div className={bare ? 'tw-stack' : 'tw-card tw-stack'} style={{ textAlign: 'left', marginTop: bare ? '0.9rem' : undefined }}>
      {text && <p className="tw-p" style={{ fontSize: '0.9rem' }}>{text}</p>}
      {tw.isSignedIn
        ? <div className="tw-cta-row">
            <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/meu`)}>Sou visitante</button>
            <button className="tw-btn" onClick={() => navigate(`${base}/artist`)}>Sou tatuador</button>
          </div>
        : <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar e participar</button></SignInButton>}
    </div>
  );
}

// --- Selo secreto: encostou, ganhou ---

function SecretSeal({ tag, tw }) {
  const navigate = useNavigate();
  const { campaign, base } = useCampaign();
  const { participant, enrollments, loading } = tw;
  const [result, setResult] = useState(null); // { fresh, points }
  const [gift, setGift] = useState(null);
  const done = useRef(false);
  const tracks = enrollments.filter(e => e.campaign_id === campaign.id).map(e => e.track);
  const inGame = !!participant && tracks.length > 0;
  const publicOnly = inGame && !tracks.includes('artist');
  const prizeSeal = isGiftSeal(campaign, tag);

  // Guarda o selo no celular na hora (mesmo se o login demorar): quem entrar no jogo depois recebe sozinho
  useEffect(() => { savePendingSeal(campaign.id, tag); }, [campaign.id, tag]);

  useEffect(() => {
    if (loading || done.current || !inGame) return;
    done.current = true;
    claimSeal(campaign.id, participant.id, tracks, tag).then(async r => {
      // Selo premiado do público: garante o chaveiro Bronc (enquanto durar)
      if (prizeSeal && tracks.includes('public')) {
        try { setGift(await claimGift(campaign.id, participant.id)); } catch (e) { setGift({ error: e.message }); }
      }
      setResult(r);
      if (r.fresh) { try { navigator.vibrate?.([60, 40, 140]); } catch { /* sem vibração */ } }
    });
  }, [loading, inGame, participant, tracks.length, tag, campaign.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tw-wrap tw-seal-page" style={{ maxWidth: 520 }}>
      <div className="tw-seal-scene" aria-hidden="true">
        <Cloud className="tw-seal-cloud c1" />
        <Cloud className="tw-seal-cloud c2" />
        <Sparkle className="tw-seal-spark s1" />
        <Sparkle className="tw-seal-spark s2" fill="#ff8fd8" />
        <Sparkle className="tw-seal-spark s3" fill="#7fe7f2" />
      </div>
      <div className="tw-reveal tw-seal-card">
        <span className="tw-seal-ribbon"><KeyRound size={13} style={{ verticalAlign: -2 }} /> Selo secreto encontrado!</span>
        <div className={`tw-gold-stage ${result?.fresh || !inGame ? 'fresh' : ''}`}>
          <span className="tw-gold-rays" />
          <span className="tw-gold-glow" />
          {Array.from({ length: 14 }).map((_, i) => <i key={i} className="tw-gold-spark" style={{ '--a': `${i * (360 / 14)}deg`, '--d': `${(i % 4) * 0.12}s` }} />)}
          {secretArt(tag.slug)
            ? <img className="tw-gold-medal" src={secretArt(tag.slug)} alt={tag.name} />
            : <div className="tw-reveal-icon">{tag.seal_icon || '★'}</div>}
        </div>
        <h1 className="tw-h1" style={{ fontSize: 'clamp(2rem, 9vw, 3rem)' }}>{tag.name}</h1>
        {result?.fresh && !publicOnly && <div className="tw-seal-points">+{result.points} pontos!</div>}
        {result?.fresh && publicOnly && !gift && <div className="tw-seal-points">Selo na sua faixa!</div>}
        {result && !result.fresh && !gift && <p className="tw-p">Você já tinha este selo. Procure os outros!</p>}
        {gift?.mine && (
          <div className="tw-card tw-stack" style={{ marginTop: '1rem', background: '#0b0b10', color: '#fff', border: '3px solid #f07c2a' }}>
            <span className="tw-kicker" style={{ color: '#f07c2a' }}>Selo premiado!</span>
            <h2 className="tw-h3" style={{ color: '#fff' }}>Você ganhou um {PUBLIC_GIFT.title}</h2>
            <img src={PUBLIC_GIFT.image} alt={PUBLIC_GIFT.title} style={{ width: '100%', borderRadius: 12, border: '2px solid #f07c2a' }} />
            <span className="tw-gift-code" style={{ alignSelf: 'center' }}>{giftCode(participant.id)}</span>
            <p className="tw-p" style={{ color: '#ddd', fontSize: '0.88rem' }}>Mostre esta tela e o código no stand da Bronc para retirar. O código também fica na sua aba Missões.</p>
          </div>
        )}
        {gift && !gift.mine && <p className="tw-p">Este era o selo premiado, mas os chaveiros já acabaram. Valeu por jogar!</p>}
        {!result && inGame && <p className="tw-p"><Loader2 className="tw-spin" size={16} style={{ verticalAlign: -3 }} /> Guardando seu selo...</p>}
        <p className="tw-p" style={{ margin: '1rem 0 0' }}>{tag.bio || 'Você encontrou um dos selos secretos escondidos no evento.'}</p>
        {result && (
          <button className="tw-btn tw-btn-primary tw-btn-block" style={{ marginTop: '1.25rem' }} onClick={() => navigate(`${base}/${tracks.includes('artist') ? 'artist' : 'meu'}`)}>Ver meus selos</button>
        )}
      </div>

      {!loading && !inGame && (
        <div className="tw-card tw-card-gold tw-seal-join">
          <Char name="oni" className="tw-seal-join-char" />
          <span className="tw-kicker">Esse selo já é quase seu</span>
          <h2 className="tw-h3" style={{ margin: '0.3rem 0' }}>Entre no Desafio dos Mestres em 1 minuto</h2>
          <p className="tw-p" style={{ fontSize: '0.9rem' }}>
            Guardamos o <b style={{ color: 'var(--tw-text)' }}>{tag.name}</b> aqui no seu celular por 3 horas. Entrou no jogo, ele cai na sua conta sozinho. Um dos selos secretos é o selo premiado do chaveiro exclusivo Bronc: será que é este?
          </p>
          <JoinPrompt tw={tw} text="" bare />
        </div>
      )}
    </div>
  );
}

// --- Cadastro/ativação do Artist Challenge (o único NFC dos artistas, no stand da Bronc) ---

function Activation({ tag, tw }) {
  const navigate = useNavigate();
  const { campaign, base } = useCampaign();
  const { participant, enrollments, setEnrollments, loading } = tw;
  const [state, setState] = useState('idle');
  const enrollment = enrollments.find(e => e.campaign_id === campaign.id && e.track === 'artist');

  useEffect(() => {
    try { sessionStorage.setItem(activationKey(campaign.id), String(Date.now())); } catch { /* sem storage */ }
  }, [campaign.id]);

  useEffect(() => {
    if (!enrollment) return;
    if (enrollment.activated_at) { setState('active'); return; }
    const at = new Date().toISOString();
    supabase.from('tw_enrollments').update({ activated_at: at }).eq('id', enrollment.id).then(() => {
      setEnrollments(list => list.map(e => (e.id === enrollment.id ? { ...e, activated_at: at } : e)));
      setState('active');
    });
  }, [enrollment, setEnrollments]);

  const go = () => navigate(`${base}/artist`);

  return (
    <div className="tw-bronc-hero">
      <img className="tw-bronc-img" src="/tattooweek/bronc/welcome.jpg" alt="Welcome to the Bronc & Bigwasp" />
      <div className="tw-wrap" style={{ maxWidth: 520, textAlign: 'center' }}>
        <div className="tw-bronc" style={{ marginTop: '0.5rem' }}>
          <img className="tw-bronc-img" src="/tattooweek/bronc/dragao.jpg" alt="" style={{ maxHeight: 260, objectFit: 'cover' }} />
          <div className="tw-bronc-body">
            <span className="tw-kicker">{tag.location || 'Stand da Bronc'}</span>
            <h2 style={{ fontSize: '1.7rem' }}>{state === 'active' ? 'Challenge liberado!' : 'Artist Challenge'}</h2>
            <p style={{ marginBottom: '1.2rem' }}>
              {state === 'active'
                ? 'Você está dentro. Poste cada missão no seu perfil marcando os parceiros e dispute o kit do tatuador do dia.'
                : 'Tatuador: faça seu cadastro, siga os perfis dos parceiros e o desafio libera na hora. Todo dia, o melhor tatuador leva um kit.'}
            </p>
            {state === 'active'
              ? <button className="tw-btn tw-btn-block" onClick={go}>Ver minhas missões</button>
              : !loading && (
                participant
                  ? <button className="tw-btn tw-btn-block" onClick={go}>Entrar no Artist Challenge</button>
                  : tw.isSignedIn
                    ? <button className="tw-btn tw-btn-block" onClick={go}>Fazer meu cadastro</button>
                    : <SignInButton mode="modal"><button className="tw-btn tw-btn-block">Entrar e fazer cadastro</button></SignInButton>
              )}
          </div>
        </div>
        <img src="/tattooweek/bronc/faixa.jpg" alt="Bronc · Bigwasp · Born to Bronc" style={{ width: '100%', marginTop: '1rem', borderRadius: 12 }} />
      </div>
    </div>
  );
}

// --- Ponto NFC: lugar/stand do evento, registra com foto ---

function Point({ tag, tw }) {
  const { campaign } = useCampaign();
  const { participant, enrollments, loading } = tw;
  const [missions, setMissions] = useState([]);
  const [subs, setSubs] = useState([]);
  const [open, setOpen] = useState(null);
  const tracks = enrollments.filter(e => e.campaign_id === campaign.id).map(e => e.track);
  const ig = instagramUrl(tag.instagram);

  useEffect(() => {
    supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('category', 'passaporte').eq('active', true)
      .then(({ data }) => setMissions(data || []));
  }, [campaign.id]);

  useEffect(() => {
    if (!participant) return;
    supabase.from('tw_submissions').select('*').eq('participant_id', participant.id).eq('artist_id', tag.id)
      .then(({ data }) => setSubs(data || []));
  }, [participant, tag.id]);

  // Uma missão de carimbo por trilha em que a pessoa joga (artista primeiro)
  const passport = ['artist', 'public'].filter(t => tracks.includes(t)).map(t => missions.find(m => m.track === t)).find(Boolean);
  const stamp = passport && subs.find(s => s.mission_id === passport.id);
  const secret = tag.secret?.active ? tag.secret : null;
  const secretSub = secret && subs.find(s => s.mission_id === secret.id);
  const openGame = campaign.status !== 'finished';

  return (
    <>
      <div className="tw-artist-hero">
        {tag.photo_url
          ? <img src={tag.photo_url} alt={tag.name} />
          : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 50% 30%, rgba(var(--tw-gold-rgb), 0.2), var(--tw-bg))' }}><Nfc size={96} color="var(--tw-gold)" style={{ opacity: 0.45 }} /></div>}
        <div className="tw-artist-name">
          <span className="tw-chip tw-chip-gold"><Nfc size={12} /> Ponto NFC</span>
          <h1 className="tw-h1" style={{ fontSize: 'clamp(2rem, 10vw, 3.4rem)', margin: '0.5rem 0 0.2rem' }}>{tag.name}</h1>
          <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.4rem 1rem', fontSize: '0.9rem', color: 'var(--tw-muted)' }}>
            {(tag.location || tag.city) && <span><MapPin size={14} style={{ verticalAlign: -2 }} /> {tag.location || tag.city}</span>}
            {tag.styles && <span>{tag.styles}</span>}
          </div>
        </div>
      </div>

      <div className="tw-wrap tw-stack" style={{ maxWidth: 560 }}>
        {tag.bio && <p className="tw-p">{tag.bio}</p>}
        {ig && <a className="tw-btn tw-btn-ghost tw-btn-block" href={ig} target="_blank" rel="noreferrer"><AtSign size={18} /> {tag.instagram}</a>}

        {tag.mission_text && (
          <div className="tw-card tw-card-gold">
            <span className="tw-kicker">Desafio deste ponto</span>
            <p style={{ margin: '0.5rem 0 0', fontWeight: 700, lineHeight: 1.45 }}>{tag.mission_text}</p>
          </div>
        )}

        {secret && openGame && participant && tracks.includes(secret.track) && (
          <div className="tw-surprise" style={{ animation: 'none', borderColor: 'rgba(var(--tw-gold-rgb), 0.6)', background: 'linear-gradient(120deg, rgba(var(--tw-gold-rgb), 0.18), var(--tw-card) 70%)' }}>
            <span className="tw-kicker"><KeyRound size={12} style={{ verticalAlign: -1 }} /> Missão secreta liberada</span>
            <h3 className="tw-h3" style={{ margin: '0.5rem 0' }}>{secret.title}</h3>
            <p className="tw-p" style={{ fontSize: '0.88rem', marginBottom: '0.8rem' }}>{secret.description}</p>
            {secretSub && secretSub.status !== 'rejected'
              ? <span className="tw-chip tw-chip-ok"><Check size={12} /> Enviada</span>
              : <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={() => setOpen({ mission: secret })}>Cumprir · +{secret.points} pts</button>}
          </div>
        )}

        {passport && openGame && (
          <div className="tw-card">
            <span className="tw-kicker">Registrar este ponto</span>
            <h3 className="tw-h3" style={{ margin: '0.4rem 0 0.8rem' }}>Tire uma foto aqui e ganhe +{passport.points} pts</h3>
            {stamp && stamp.status !== 'rejected'
              ? <span className="tw-chip tw-chip-ok"><Check size={12} /> Ponto registrado</span>
              : <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => setOpen({ mission: passport, artist: tag })}><Camera size={18} /> Registrar com foto</button>}
          </div>
        )}

        {!loading && !passport && openGame && (
          <JoinPrompt tw={tw} text={`Este ponto faz parte do ${campaign.name}. Entre no jogo para registrar e ganhar pontos.`} />
        )}
      </div>

      {open && (
        <MissionSheet
          mission={open.mission}
          artist={open.artist}
          participant={participant}
          onClose={() => setOpen(null)}
          onDone={(sub) => setSubs(prev => [...prev, sub])}
        />
      )}
    </>
  );
}
