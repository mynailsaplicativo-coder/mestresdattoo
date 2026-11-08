import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Nfc, KeyRound, Share2, HelpCircle, Lock, MapPin, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard, SealStrip, KitCard, PartnerLogo, PrivateNotice, NickEditor } from './TwShell';
import { useTwParticipant, useCampaign, loadAdjustments, sealItems, isMissionLive, activationKey, trackEvent, CATEGORY_LABELS, displayName, loadArtistDaily, useLiveRefresh, subDay, todaySP, isDailyMission, missionForToday, eventDayNumber } from './twData';
import { PatchSash, Char } from './TwArt';

const SECTIONS = ['quiz', 'parceiros', 'networking', 'conteudo', 'geral', 'secreta'];
const ACTIVATION_TTL = 3 * 3600 * 1000;

export default function TwChallenge() {
  const tw = useTwParticipant();
  return (
    <TwShell>
      <JoinGate tw={tw} track="artist">
        <ChallengeGate tw={tw} />
      </JoinGate>
    </TwShell>
  );
}

// O Artist Challenge só começa depois de escanear a ativação no stand da Bronc
function ChallengeGate({ tw }) {
  const { campaign } = useCampaign();
  const [activation, setActivation] = useState(undefined);
  const enrollment = tw.enrollments.find(e => e.campaign_id === campaign.id && e.track === 'artist');

  useEffect(() => {
    supabase.from('tw_artists').select('id, name, location').eq('campaign_id', campaign.id).eq('kind', 'activation').eq('active', true).limit(1)
      .then(({ data, error }) => setActivation(error ? null : data?.[0] || null));
  }, [campaign.id]);

  // Leu a ativação antes de se cadastrar: ativa assim que entrar
  useEffect(() => {
    if (!enrollment || enrollment.activated_at || !activation) return;
    let pending = null;
    try { pending = Number(sessionStorage.getItem(activationKey(campaign.id))); } catch { /* sem storage */ }
    if (!pending || Date.now() - pending > ACTIVATION_TTL) return;
    const at = new Date().toISOString();
    supabase.from('tw_enrollments').update({ activated_at: at }).eq('id', enrollment.id).then(() => {
      tw.setEnrollments(list => list.map(e => (e.id === enrollment.id ? { ...e, activated_at: at } : e)));
    });
  }, [enrollment, activation, campaign.id, tw]);

  if (activation === undefined) return <div className="tw-center-screen">Carregando...</div>;
  // Passo 1: seguir os perfis dos parceiros
  if (enrollment && !enrollment.followed_at && (campaign.follow_partners || []).length) {
    return <FollowStep enrollment={enrollment} setEnrollments={tw.setEnrollments} participantId={tw.participant.id} />;
  }
  if (activation && !enrollment?.activated_at) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 420 }}>
          <div className="tw-reveal-icon" style={{ width: 120, height: 120, fontSize: '3rem', animation: 'tw-glow 2.4s ease-in-out infinite' }}><Lock size={48} color="var(--tw-gold)" /></div>
          <span className="tw-kicker">Artist Challenge · passo 2 de 2</span>
          <h1 className="tw-h2" style={{ margin: '0.4rem 0' }}>Falta ativar seu desafio</h1>
          <p className="tw-p">
            Vá até o <b style={{ color: 'var(--tw-text)' }}>{activation.location || 'stand da Bronc'}</b> e encoste o celular no adesivo de ativação (ou leia o QR Code). Seu Artist Challenge libera na hora.
          </p>
          <div className="tw-notice" style={{ marginTop: '1rem' }}><MapPin size={14} style={{ verticalAlign: -2 }} /> Enquanto isso, você já pode jogar o Meu {campaign.event_name} com o público.</div>
        </div>
      </div>
    );
  }
  return <ChallengePanel participant={tw.participant} setParticipantFn={tw.setParticipant} />;
}

// O artista precisa seguir todos os perfis antes de jogar (abre cada um no Instagram)
function FollowStep({ enrollment, setEnrollments, participantId }) {
  const { campaign, partners } = useCampaign();
  const list = (campaign.follow_partners || []).map(id => partners[id]).filter(Boolean);
  const [opened, setOpened] = useState(() => new Set());
  const [saving, setSaving] = useState(false);
  const handle = (p) => (p.instagram || '').replace(/^@/, '').trim();
  const allOpened = list.every(p => !handle(p) || opened.has(p.id));

  const open = (p) => {
    setOpened(o => new Set(o).add(p.id));
    trackEvent('follow_click', p.id, participantId, campaign.id);
  };

  const confirm = async () => {
    setSaving(true);
    const at = new Date().toISOString();
    await supabase.from('tw_enrollments').update({ followed_at: at }).eq('id', enrollment.id);
    setEnrollments(l => l.map(e => (e.id === enrollment.id ? { ...e, followed_at: at } : e)));
    setSaving(false);
  };

  return (
    <div className="tw-wrap" style={{ maxWidth: 520 }}>
      <span className="tw-kicker">Artist Challenge · passo 1 de 2</span>
      <h1 className="tw-h2" style={{ fontSize: '2.2rem', margin: '0.3rem 0 0.5rem' }}>Siga a galera</h1>
      <p className="tw-p" style={{ marginBottom: '1rem' }}>Para participar, siga os {list.length} perfis abaixo. Toque em cada um para abrir no Instagram. Depois, cada missão precisa ser postada no seu perfil marcando todos eles.</p>
      <div className="tw-follow">
        {list.map(p => {
          const h = handle(p);
          const done = opened.has(p.id);
          return h ? (
            <a key={p.id} className={`tw-follow-row ${done ? 'done' : ''}`} href={`https://instagram.com/${h}`} target="_blank" rel="noreferrer" onClick={() => open(p)}>
              {p.logo_url && !done ? <PartnerLogo partner={p} height={42} /> : <span className="tw-follow-dot" style={{ background: p.color || '#fff' }}>{done ? <Check size={18} /> : p.name.slice(0, 1)}</span>}
              <span style={{ flex: 1 }}><b>{p.name}</b><br /><small>@{h}</small></span>
              <span className="tw-chip">{done ? 'Aberto' : 'Seguir'}</span>
            </a>
          ) : (
            <div key={p.id} className="tw-follow-row">
              <span className="tw-follow-dot" style={{ background: p.color || '#fff' }}>{p.name.slice(0, 1)}</span>
              <span style={{ flex: 1 }}><b>{p.name}</b><br /><small>procure no Instagram</small></span>
            </div>
          );
        })}
      </div>
      <button className="tw-btn tw-btn-primary tw-btn-block" style={{ marginTop: '1.25rem' }} disabled={!allOpened || saving} onClick={confirm}>
        {allOpened ? 'Já sigo todos, bora!' : 'Abra todos os perfis para continuar'}
      </button>
    </div>
  );
}

function ChallengePanel({ participant, setParticipantFn }) {
  const navigate = useNavigate();
  const { campaign, partners, base } = useCampaign();
  const [missions, setMissions] = useState([]);
  const [tags, setTags] = useState([]);
  const [subs, setSubs] = useState([]);
  const [scanned, setScanned] = useState(new Set());
  const [daily, setDaily] = useState(null);
  const [adj, setAdj] = useState({ public: 0, artist: 0 });
  const [open, setOpen] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const [m, a, s, e, r, ad] = await Promise.all([
      supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('track', 'artist').eq('active', true).order('position'),
      supabase.from('tw_artists').select('*').eq('campaign_id', campaign.id).eq('active', true).order('slug'),
      supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participant.id).eq('mission.campaign_id', campaign.id),
      supabase.from('tw_events').select('ref').eq('participant_id', participant.id).eq('campaign_id', campaign.id).in('type', ['nfc_scan', 'qr_scan']),
      loadArtistDaily(campaign),
      loadAdjustments(participant.id, campaign.id),
    ]);
    setMissions(m.data || []);
    setTags(a.data || []);
    setSubs(s.data || []);
    setScanned(new Set((e.data || []).map(x => x.ref)));
    setDaily(r);
    setAdj(ad);
    setLoaded(true);
  }, [participant.id, campaign]); // eslint-disable-line react-hooks/exhaustive-deps

  useLiveRefresh(`challenge-${participant.id}`, load, 30000);

  if (!loaded) return <div className="tw-center-screen">Carregando desafios...</div>;

  const kindOf = (t) => t.kind || 'point';
  const points = tags.filter(t => kindOf(t) === 'point');
  const seals = tags.filter(t => kindOf(t) === 'secret');
  const missionSubs = (id) => subs.filter(s => s.mission_id === id);
  const revealed = new Set(tags.filter(a => a.reveals_mission_id && scanned.has(a.slug)).map(a => a.reveals_mission_id));
  const today = todaySP();
  const dayNum = eventDayNumber(campaign);
  const visible = missions.filter(m => (!m.hidden || revealed.has(m.id)) && missionForToday(m, campaign));
  // Missão diária: conta só o envio de hoje (amanhã vale de novo)
  const subFor = (m) => {
    const list = missionSubs(m.id);
    return isDailyMission(m) ? list.find(s => subDay(s) === today) : list[0];
  };
  const surprises = visible.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const passportMission = missions.find(m => m.category === 'passaporte');
  const sealMission = missions.find(m => m.category === 'selo');
  const approved = subs.filter(s => s.status === 'approved' && s.mission?.track === 'artist');
  const total = approved.reduce((a, s) => a + (s.points || 0), 0) + adj.artist;
  const todayRow = daily?.todayRows.find(x => x.participant_id === participant.id);
  const todayPos = todayRow ? daily.todayRows.indexOf(todayRow) + 1 : null;
  const stamps = passportMission ? missionSubs(passportMission.id) : [];
  const foundSeals = new Set(approved.filter(s => s.mission?.category === 'selo').map(s => s.artist_id));
  const seals_ = sealItems(missions, approved);
  const wonDay = daily && Object.entries(daily.winners).find(([, w]) => w.participant_id === participant.id)?.[0];
  const needSeals = daily?.need ?? seals.length;
  const hasAllSeals = foundSeals.size >= needSeals;
  const isLeader = daily?.leader?.participant_id === participant.id;
  const finished = campaign.status === 'finished' || !!wonDay;

  if (wonDay) {
    return (
      <div className="tw-center-screen">
        <div style={{ maxWidth: 440 }}>
          <div className="tw-reveal-icon" style={{ width: 120, height: 120, animation: 'tw-glow 2.4s ease-in-out infinite' }}><Trophy size={52} color="var(--tw-gold)" /></div>
          <span className="tw-kicker">Artist Challenge</span>
          <h1 className="tw-h2" style={{ margin: '0.4rem 0' }}>Você é o tatuador do dia!</h1>
          <p className="tw-p">Você foi o tatuador do dia em {new Date(`${wonDay}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}. Você ganhou 1 impressora Bronc e 10 mil pontos de crédito no app E-Bronc. Procure a equipe no stand da Bronc para retirar.</p>
          <p className="tw-p" style={{ marginTop: '0.8rem' }}>Quem ganha não disputa os outros dias: a vaga fica para outro tatuador. Valeu demais!</p>
          <button className="tw-btn tw-btn-primary tw-btn-block" style={{ marginTop: '1.25rem' }} onClick={() => navigate(`${base}/resultado`)}><Share2 size={14} /> Ver meu card de resultado</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-wrap">
      <div className="tw-between" style={{ alignItems: 'flex-end' }}>
        <div>
          <span className="tw-kicker">Artist Challenge · {campaign.event_name}</span>
          <h1 className="tw-h2" style={{ margin: '0.3rem 0 0.4rem', fontSize: '2.1rem' }}>{displayName(participant)}</h1>
          <NickEditor participant={participant} setParticipant={setParticipantFn} />
        </div>
        <Char name="tigre" style={{ width: 92, marginBottom: '-6px' }} />
      </div>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid tw-stats-4">
          <div className="tw-stat"><b>{todayRow?.points || 0}</b><span>Pontos hoje</span></div>
          <div className="tw-stat"><b>{todayPos ? `${todayPos}º` : '–'}</b><span>Ranking hoje</span></div>
          <div className="tw-stat"><b>{foundSeals.size}/{needSeals}</b><span>Selos secretos</span></div>
          <div className="tw-stat"><b>{total}</b><span>Total no evento</span></div>
        </div>
      </div>

      {finished && <div className="tw-notice" style={{ marginTop: '1rem' }}>O Artist Challenge foi encerrado.</div>}

      <div style={{ marginTop: '1rem' }}><PrivateNotice participant={participant} setParticipant={setParticipantFn} onChange={load} /></div>
      <KitCard campaign={campaign} dayNum={dayNum} hasAllSeals={hasAllSeals} foundSeals={foundSeals.size} needSeals={needSeals} isLeader={isLeader} onRanking={() => navigate(`${base}/ranking`)} />

      {!finished && surprises.length > 0 && (
        <div className="tw-stack" style={{ marginTop: '1rem' }}>
          {surprises.map(m => <SurpriseCard key={m.id} mission={m} sub={subFor(m)} onOpen={() => setOpen({ mission: m })} />)}
        </div>
      )}

      {SECTIONS.map(cat => {
        const list = visible.filter(m => m.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="tw-section">
            <span className="tw-kicker">{cat === 'secreta' && <KeyRound size={12} style={{ verticalAlign: -1 }} />} {cat === 'quiz' ? 'Perguntas' : CATEGORY_LABELS[cat]}</span>
            <div className="tw-stack" style={{ marginTop: '0.7rem' }}>
              {list.map(m => {
                const s = subFor(m);
                const partner = m.partner && partners[m.partner];
                return (
                  <button key={m.id} className={`tw-mission ${s?.status === 'approved' ? 'done' : ''} ${finished ? 'locked' : ''}`} disabled={finished || (s && s.status !== 'rejected')} onClick={() => setOpen({ mission: m })}>
                    <span className="tw-mission-num">{s?.status === 'approved' ? <Check size={18} /> : m.category === 'quiz' ? <HelpCircle size={18} /> : m.points}</span>
                    <span className="tw-mission-body">
                      <span className="tw-mission-title">{m.title}</span>
                      <span className="tw-mission-meta">
                        {partner && <span className="tw-chip" style={{ color: partner.color, borderColor: partner.color }}>{partner.name}</span>}
                        {s?.status === 'rejected' && <span className="tw-chip tw-chip-bad">Recusada · envie de novo</span>}
                      </span>
                    </span>
                    <span className="tw-mission-pts">+{m.points}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {seals.length > 0 && (
        <section className="tw-section">
          <div className="tw-between" style={{ marginBottom: '0.7rem' }}>
            <span className="tw-kicker">Selos secretos</span>
            {sealMission && <span className="tw-chip tw-chip-gold">+{sealMission.points} pts cada</span>}
          </div>
          <SealStrip seals={seals} found={foundSeals} />
        </section>
      )}

      {passportMission && points.length > 0 && (
        <section className="tw-section">
          <div className="tw-between" style={{ marginBottom: '0.8rem' }}>
            <div>
              <span className="tw-kicker"><Nfc size={12} style={{ verticalAlign: -1 }} /> Pontos NFC</span>
              <h2 className="tw-h3" style={{ marginTop: '0.3rem' }}>{stamps.filter(s => s.status === 'approved').length} de {points.length} encontrados</h2>
            </div>
            <span className="tw-chip tw-chip-gold">+{passportMission.points} pts cada</span>
          </div>
          <div className="tw-passport">
            {points.map(a => {
              const s = stamps.find(x => x.artist_id === a.id);
              const cls = s?.status === 'approved' ? 'got' : scanned.has(a.slug) ? 'scanned' : '';
              const content = a.photo_url && cls ? <img src={a.photo_url} alt={a.name} /> : (cls ? a.name.split(' ').slice(-1)[0] : a.slug.replace(/\D/g, ''));
              return scanned.has(a.slug)
                ? <a key={a.id} className={`tw-stamp ${cls}`} href={`${base}/nfc/${a.slug}`} onClick={e => { e.preventDefault(); navigate(`${base}/nfc/${a.slug}`); }} title={a.name}>{content}</a>
                : <div key={a.id} className="tw-stamp" title="Encontre este ponto">{content}</div>;
            })}
          </div>
          <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '0.7rem' }}>
            Os pontos estão espalhados pelo evento. Encoste o celular (ou leia o QR) e registre com uma foto.
          </p>
        </section>
      )}

      <section className="tw-section">
        <div className="tw-between" style={{ marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          <span className="tw-kicker">Sua faixa de selos · {seals_.filter(x => x.earned).length}/{seals_.length}</span>
          <button className="tw-btn tw-btn-sm" onClick={() => navigate(`${base}/resultado`)}><Share2 size={14} /> Card de resultado</button>
        </div>
        <div className="tw-sash-banner"><PatchSash items={seals_} /></div>
      </section>

      <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '2rem' }}>
        Os pontos entram na hora. O ranking do dia zera à meia-noite e as missões valem de novo no dia seguinte. A equipe revisa os envios e pode recusar o que não cumprir a missão.
      </p>

      {open && (
        <MissionSheet
          mission={open.mission}
          artist={open.artist}
          participant={participant}
          onClose={() => setOpen(null)}
          onDone={() => load()}
        />
      )}
    </div>
  );
}
