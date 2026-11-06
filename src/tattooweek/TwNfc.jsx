import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AtSign, MapPin, Nfc, KeyRound, Check, Camera, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, MissionSheet } from './TwShell';
import { Char } from './TwArt';
import { useTwParticipant, useCampaign, trackEvent, instagramUrl, activationKey } from './twData';

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

function JoinPrompt({ tw, text }) {
  const navigate = useNavigate();
  const { base } = useCampaign();
  return (
    <div className="tw-card tw-stack" style={{ textAlign: 'left' }}>
      <p className="tw-p" style={{ fontSize: '0.9rem' }}>{text}</p>
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
  const { campaign } = useCampaign();
  const { participant, enrollments, loading } = tw;
  const [result, setResult] = useState(null); // { fresh, points }
  const done = useRef(false);
  const tracks = enrollments.filter(e => e.campaign_id === campaign.id).map(e => e.track);

  useEffect(() => {
    if (loading || !participant || !tracks.length || done.current) return;
    done.current = true;
    (async () => {
      const { data: missions } = await supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('category', 'selo').eq('active', true).in('track', tracks);
      let fresh = false;
      let points = 0;
      for (const m of missions || []) {
        const { error } = await supabase.from('tw_submissions').insert([{
          participant_id: participant.id, mission_id: m.id, artist_id: tag.id, media: [],
          status: 'approved', points: m.points, note: `Selo secreto: ${tag.name}`, reviewed_at: new Date().toISOString(),
        }]);
        if (!error) { fresh = true; points = Math.max(points, m.points); }
      }
      setResult({ fresh, points });
    })();
  }, [loading, participant, tracks.length, tag, campaign.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tw-wrap" style={{ maxWidth: 480 }}>
      <div className="tw-reveal">
        <Char name="caveira" style={{ width: 110, margin: '0 auto 0.5rem' }} />
        <span className="tw-kicker"><KeyRound size={12} style={{ verticalAlign: -1 }} /> Selo secreto</span>
        <div className="tw-reveal-icon" style={{ marginTop: '1rem' }}>{tag.seal_icon || '★'}</div>
        <h1 className="tw-h1" style={{ fontSize: 'clamp(2rem, 9vw, 3rem)' }}>{tag.name}</h1>
        {result?.fresh && <h2 className="tw-h2 tw-gold">+{result.points} pontos!</h2>}
        {result && !result.fresh && <p className="tw-p">Você já tinha este selo. Procure os outros!</p>}
        {!result && participant && tracks.length > 0 && <p className="tw-p"><Loader2 className="tw-spin" size={16} style={{ verticalAlign: -3 }} /> Guardando seu selo...</p>}
        <p className="tw-p" style={{ margin: '1rem 0' }}>{tag.bio || 'Você encontrou um dos selos secretos escondidos no evento.'}</p>
      </div>
      {!loading && (!participant || !tracks.length) && (
        <JoinPrompt tw={tw} text="Entre no jogo para guardar este selo e ganhar os pontos. Depois encoste o celular de novo." />
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
