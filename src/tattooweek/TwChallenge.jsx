import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Nfc, KeyRound } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard } from './TwShell';
import { useTwParticipant, isMissionLive, CATEGORY_LABELS, PARTNERS } from './twData';

const SECTIONS = ['networking', 'conteudo', 'parceiros', 'secreta'];

export default function TwChallenge() {
  const tw = useTwParticipant();
  return (
    <TwShell>
      <JoinGate tw={tw} mode="artist">
        <ChallengePanel participant={tw.participant} />
      </JoinGate>
    </TwShell>
  );
}

function ChallengePanel({ participant }) {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [artists, setArtists] = useState([]);
  const [subs, setSubs] = useState([]);
  const [scanned, setScanned] = useState(new Set());
  const [rank, setRank] = useState(null);
  const [open, setOpen] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const [m, a, s, e, r] = await Promise.all([
      supabase.from('tw_missions').select('*').eq('track', 'artist').eq('active', true).order('position'),
      supabase.from('tw_artists').select('*').eq('active', true).order('slug'),
      supabase.from('tw_submissions').select('*').eq('participant_id', participant.id),
      supabase.from('tw_events').select('ref').eq('participant_id', participant.id).in('type', ['nfc_scan', 'qr_scan']),
      supabase.from('tw_ranking').select('participant_id, points').eq('track', 'artist').order('points', { ascending: false }).order('last_at'),
    ]);
    setMissions(m.data || []);
    setArtists(a.data || []);
    setSubs(s.data || []);
    setScanned(new Set((e.data || []).map(x => x.ref)));
    const pos = (r.data || []).findIndex(x => x.participant_id === participant.id);
    setRank(pos >= 0 ? pos + 1 : null);
    setLoaded(true);
  }, [participant.id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  if (!loaded) return <div className="tw-center-screen">Carregando desafios...</div>;

  const missionSubs = (id) => subs.filter(s => s.mission_id === id);
  const revealed = new Set(artists.filter(a => a.reveals_mission_id && scanned.has(a.slug)).map(a => a.reveals_mission_id));
  const visible = missions.filter(m => !m.hidden || revealed.has(m.id));
  const surprises = visible.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const passportMission = visible.find(m => m.category === 'passaporte');
  const points = subs.filter(s => s.status === 'approved').reduce((a, s) => a + (s.points || 0), 0);
  const pending = subs.filter(s => s.status === 'pending').length;
  const stamps = passportMission ? missionSubs(passportMission.id) : [];

  return (
    <div className="tw-wrap">
      <span className="tw-kicker">Artist Challenge</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>{participant.name}</h1>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="tw-stat"><b>{points}</b><span>Pontos</span></div>
          <div className="tw-stat"><b>{rank ? `${rank}º` : '–'}</b><span>Ranking</span></div>
          <div className="tw-stat"><b>{scanned.size}</b><span>Conexões</span></div>
          <div className="tw-stat"><b>{pending}</b><span>Em análise</span></div>
        </div>
      </div>

      {surprises.length > 0 && (
        <div className="tw-stack" style={{ marginTop: '1rem' }}>
          {surprises.map(m => <SurpriseCard key={m.id} mission={m} sub={missionSubs(m.id)[0]} onOpen={() => setOpen({ mission: m })} />)}
        </div>
      )}

      {passportMission && (
        <section className="tw-section">
          <div className="tw-between" style={{ marginBottom: '0.8rem' }}>
            <div>
              <span className="tw-kicker"><Nfc size={12} style={{ verticalAlign: -1 }} /> Passaporte NFC</span>
              <h2 className="tw-h3" style={{ marginTop: '0.3rem' }}>{stamps.filter(s => s.status === 'approved').length} de {artists.length} carimbos</h2>
            </div>
            <span className="tw-chip tw-chip-gold">+{passportMission.points} pts cada</span>
          </div>
          <div className="tw-passport">
            {artists.map(a => {
              const s = stamps.find(x => x.artist_id === a.id);
              const cls = s?.status === 'approved' ? 'got' : s?.status === 'pending' ? 'pending' : scanned.has(a.slug) ? 'scanned' : '';
              const content = a.photo_url && cls ? <img src={a.photo_url} alt={a.name} /> : (cls ? a.name.split(' ')[0] : a.slug.replace('artista-', ''));
              return scanned.has(a.slug)
                ? <a key={a.id} className={`tw-stamp ${cls}`} href={`/tattooweek/nfc/${a.slug}`} onClick={e => { e.preventDefault(); navigate(`/tattooweek/nfc/${a.slug}`); }} title={a.name}>{content}</a>
                : <div key={a.id} className="tw-stamp" title="Encontre a credencial">{content}</div>;
            })}
          </div>
          <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '0.7rem' }}>
            Encontre os 20 artistas com credencial, aproxime o celular (ou leia o QR Code) e registre o encontro com uma foto.
          </p>
        </section>
      )}

      {SECTIONS.map(cat => {
        const list = visible.filter(m => m.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="tw-section">
            <span className="tw-kicker">{cat === 'secreta' && <KeyRound size={12} style={{ verticalAlign: -1 }} />} {CATEGORY_LABELS[cat]}</span>
            <div className="tw-stack" style={{ marginTop: '0.7rem' }}>
              {list.map(m => {
                const s = missionSubs(m.id)[0];
                const partner = m.partner && PARTNERS[m.partner];
                return (
                  <button key={m.id} className={`tw-mission ${s?.status === 'approved' ? 'done' : ''}`} disabled={s && s.status !== 'rejected'} onClick={() => setOpen({ mission: m })}>
                    <span className="tw-mission-num">{s?.status === 'approved' ? <Check size={18} /> : m.points}</span>
                    <span className="tw-mission-body">
                      <span className="tw-mission-title">{m.title}</span>
                      <span className="tw-mission-meta">
                        {partner && <span className="tw-chip" style={{ color: partner.color, borderColor: partner.color }}>{partner.name}</span>}
                        {s?.status === 'pending' && <span className="tw-chip tw-chip-warn">Em análise</span>}
                        {s?.status === 'approved' && <span className="tw-chip tw-chip-ok">Aprovada</span>}
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

      <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '2rem' }}>
        Todas as missões do Artist Challenge são validadas pela equipe. Ler uma credencial NFC não conta pontos sozinho — é preciso enviar o registro.
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
