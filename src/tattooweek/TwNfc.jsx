import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AtSign, MapPin, Nfc, KeyRound, Check, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, MissionSheet } from './TwShell';
import { useTwParticipant, useCampaign, trackEvent, instagramUrl } from './twData';

export default function TwNfc() {
  const { artistSlug: slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { campaign, base } = useCampaign();
  const tw = useTwParticipant();
  const { participant, isSignedIn, loading, isEnrolled } = tw;
  const [artist, setArtist] = useState(undefined);
  const [passport, setPassport] = useState(null);
  const [secret, setSecret] = useState(null);
  const [subs, setSubs] = useState([]);
  const [open, setOpen] = useState(null);
  const tracked = useRef('');

  useEffect(() => {
    supabase.from('tw_artists').select('*, secret:tw_missions!tw_artists_reveals_mission_id_fkey(*)').eq('campaign_id', campaign.id).eq('slug', slug).maybeSingle()
      .then(({ data }) => setArtist(data || null));
    supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('category', 'passaporte').eq('active', true).limit(1).maybeSingle()
      .then(({ data }) => setPassport(data));
  }, [slug, campaign.id]);

  // Registra a leitura (uma vez por sessão do navegador por credencial). Não conta pontos.
  useEffect(() => {
    if (loading || !artist) return;
    const key = `tw-scan-${campaign.id}-${slug}-${participant?.id || 'anon'}`;
    if (tracked.current === key) return; // re-registra se a pessoa entrar na conta depois de ler
    tracked.current = key;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* modo privado */ }
    trackEvent(params.get('src') === 'qr' ? 'qr_scan' : 'nfc_scan', slug, participant?.id, campaign.id);
  }, [loading, artist, slug, participant, params, campaign.id]);

  useEffect(() => {
    if (!participant || !artist) return;
    supabase.from('tw_submissions').select('*').eq('participant_id', participant.id)
      .then(({ data }) => setSubs(data || []));
    if (artist.secret?.active) setSecret(artist.secret);
  }, [participant, artist]);

  if (artist === undefined) return <TwShell><div className="tw-center-screen">Lendo credencial...</div></TwShell>;
  if (artist === null || !artist.active) {
    return (
      <TwShell>
        <div className="tw-center-screen">
          <div>
            <Nfc size={48} color="var(--tw-gold)" />
            <h1 className="tw-h2" style={{ marginTop: '1rem' }}>Credencial não encontrada</h1>
            <button className="tw-btn" style={{ marginTop: '1rem' }} onClick={() => navigate(base)}>Ir para {campaign.name}</button>
          </div>
        </div>
      </TwShell>
    );
  }

  const stamp = passport && subs.find(s => s.mission_id === passport.id && s.artist_id === artist.id);
  const secretSub = secret && subs.find(s => s.mission_id === secret.id);
  const inChallenge = participant && isEnrolled(campaign.id, 'artist');
  const open_ = campaign.status !== 'finished';
  const ig = instagramUrl(artist.instagram);

  return (
    <TwShell>
      <div className="tw-artist-hero">
        {artist.photo_url
          ? <img src={artist.photo_url} alt={artist.name} />
          : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 50% 30%, #2a2210, #050608)' }}><Nfc size={96} color="rgba(238,195,88,0.4)" /></div>}
        <div className="tw-artist-name">
          <span className="tw-chip tw-chip-gold"><Nfc size={12} /> Credencial {artist.slug.replace('artista-', '#')}</span>
          <h1 className="tw-h1" style={{ fontSize: 'clamp(2rem, 10vw, 3.4rem)', margin: '0.5rem 0 0.2rem' }}>{artist.name}</h1>
          <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.4rem 1rem', fontSize: '0.9rem', color: 'var(--tw-muted)' }}>
            {artist.city && <span><MapPin size={14} style={{ verticalAlign: -2 }} /> {artist.city}{artist.country ? `, ${artist.country}` : ''}</span>}
            {artist.styles && <span>{artist.styles}</span>}
          </div>
        </div>
      </div>

      <div className="tw-wrap tw-stack" style={{ maxWidth: 560 }}>
        {artist.bio && <p className="tw-p">{artist.bio}</p>}
        {ig && <a className="tw-btn tw-btn-ghost tw-btn-block" href={ig} target="_blank" rel="noreferrer"><AtSign size={18} /> {artist.instagram}</a>}

        {artist.mission_text && (
          <div className="tw-card tw-card-gold">
            <span className="tw-kicker">Missão deste artista</span>
            <p style={{ margin: '0.5rem 0 0', fontWeight: 700, lineHeight: 1.45 }}>{artist.mission_text}</p>
          </div>
        )}

        {secret && open_ && (
          <div className="tw-surprise" style={{ animation: 'none', borderColor: 'rgba(238,195,88,0.6)', background: 'linear-gradient(120deg, rgba(238,195,88,0.18), #0d0f13 70%)' }}>
            <span className="tw-kicker"><KeyRound size={12} style={{ verticalAlign: -1 }} /> Você encontrou a missão secreta</span>
            <h3 className="tw-h3" style={{ margin: '0.5rem 0' }}>{secret.title}</h3>
            <p className="tw-p" style={{ fontSize: '0.88rem', marginBottom: '0.8rem' }}>{secret.description}</p>
            {inChallenge
              ? (secretSub && secretSub.status !== 'rejected'
                ? <span className="tw-chip tw-chip-ok"><Check size={12} /> Enviada</span>
                : <button className="tw-btn tw-btn-primary tw-btn-sm" onClick={() => setOpen({ mission: secret })}>Cumprir · +{secret.points} pts</button>)
              : <p className="tw-p" style={{ fontSize: '0.8rem' }}>Exclusiva para quem está no Artist Challenge.</p>}
          </div>
        )}

        {inChallenge && passport && open_ && (
          <div className="tw-card">
            <span className="tw-kicker">Passaporte NFC</span>
            <h3 className="tw-h3" style={{ margin: '0.4rem 0 0.8rem' }}>Registre seu encontro com {artist.name.split(' ')[0]}</h3>
            {stamp && stamp.status !== 'rejected'
              ? <span className={`tw-chip ${stamp.status === 'approved' ? 'tw-chip-ok' : 'tw-chip-warn'}`}>{stamp.status === 'approved' ? <><Check size={12} /> Carimbo aprovado</> : 'Carimbo em análise'}</span>
              : <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => setOpen({ mission: passport, artist })}><Camera size={18} /> Foto com o artista · +{passport.points} pts</button>}
          </div>
        )}

        {!loading && !inChallenge && open_ && (
          <div className="tw-card tw-stack">
            <h3 className="tw-h3">Isto faz parte da {campaign.name}</h3>
            <p className="tw-p" style={{ fontSize: '0.9rem' }}>
              {isSignedIn
                ? 'Você é tatuador? Entre no Artist Challenge para colecionar carimbos de todos os artistas credenciados.'
                : 'Entre para colecionar este carimbo, cumprir missões e ganhar prêmios dos parceiros.'}
            </p>
            {isSignedIn
              ? <div className="tw-cta-row">
                  <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/artist`)}>Sou tatuador</button>
                  <button className="tw-btn" onClick={() => navigate(`${base}/meu`)}>Sou visitante</button>
                </div>
              : <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar</button></SignInButton>}
          </div>
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
    </TwShell>
  );
}
