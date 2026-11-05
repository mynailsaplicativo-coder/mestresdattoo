import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Film, Share2, HelpCircle, Nfc } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard, BadgeGrid, SealStrip } from './TwShell';
import { useTwParticipant, useCampaign, loadAdjustments, isMissionLive } from './twData';
import { computeBadges, sumPoints, BADGES } from './badges';

const PUBLIC_BADGES = ['primeira', 'completo', 'detetive', 'selo1', 'cacador', 'relampago', 'conector', 'parceiros'];
// Missões normais da lista (as outras têm seção própria)
const LIST_CATEGORIES = ['geral', 'quiz', 'parceiros', 'dia', 'networking', 'conteudo'];

export default function TwPublic() {
  const tw = useTwParticipant();
  return (
    <TwShell>
      <JoinGate tw={tw} track="public">
        <PublicPanel participant={tw.participant} />
      </JoinGate>
    </TwShell>
  );
}

function PublicPanel({ participant }) {
  const navigate = useNavigate();
  const { campaign, partners, base } = useCampaign();
  const [missions, setMissions] = useState(null);
  const [tags, setTags] = useState([]);
  const [subs, setSubs] = useState([]);
  const [adj, setAdj] = useState({ public: 0, artist: 0 });
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    const [m, t, s, a] = await Promise.all([
      supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('track', 'public').eq('active', true).order('position'),
      supabase.from('tw_artists').select('id, name, kind, seal_icon').eq('campaign_id', campaign.id).eq('active', true).order('slug'),
      supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participant.id).eq('mission.campaign_id', campaign.id),
      loadAdjustments(participant.id, campaign.id),
    ]);
    setMissions(m.data || []);
    setTags(t.data || []);
    setSubs(s.data || []);
    setAdj(a);
  }, [participant.id, campaign.id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000); // missões surpresa aparecem sem recarregar
    return () => clearInterval(t);
  }, [load]);

  if (!missions) return <div className="tw-center-screen">Carregando missões...</div>;

  const subByMission = Object.fromEntries(subs.filter(s => !s.artist_id).map(s => [s.mission_id, s]));
  const list = missions.filter(m => !m.hidden && LIST_CATEGORIES.includes(m.category));
  const surprises = missions.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const approved = subs.filter(s => s.status === 'approved' && s.mission?.track === 'public');
  const seals = tags.filter(t => t.kind === 'secret');
  const points = tags.filter(t => (t.kind || 'point') === 'point');
  const foundSeals = new Set(approved.filter(s => s.mission?.category === 'selo').map(s => s.artist_id));
  const foundPoints = new Set(approved.filter(s => s.mission?.category === 'passaporte').map(s => s.artist_id));
  const badges = computeBadges({ approved, missions, artistsCount: points.length, secretCount: seals.length, ranks: {} }).filter(b => PUBLIC_BADGES.includes(b.id));
  const total = sumPoints(approved, missions, 'public') + adj.public;
  const done = list.filter(m => subByMission[m.id]?.status === 'approved').length;
  const today = new Date().toDateString();
  const todayPts = approved.filter(s => new Date(s.created_at).toDateString() === today).reduce((acc, s) => acc + (s.points || 0), 0);
  const finished = campaign.status === 'finished';

  return (
    <div className="tw-wrap">
      <span className="tw-kicker">Meu {campaign.event_name}</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>Bora, {participant.name.split(' ')[0]}!</h1>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid tw-stats-4">
          <div className="tw-stat"><b>{total}</b><span>Pontos</span></div>
          <div className="tw-stat"><b>{todayPts}</b><span>Hoje</span></div>
          <div className="tw-stat"><b>{done}/{list.length}</b><span>Missões</span></div>
          <div className="tw-stat"><b>{foundSeals.size}/{seals.length}</b><span>Selos</span></div>
        </div>
        <div className="tw-progress" style={{ marginTop: '1rem' }}><div style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} /></div>
        <p className="tw-p" style={{ fontSize: '0.78rem', marginTop: '0.6rem' }}>Todo dia tem premiação para os 3 primeiros do ranking do dia. Veio só um dia? Dá pra ganhar!</p>
      </div>

      {finished && <div className="tw-notice" style={{ marginTop: '1rem' }}>O jogo foi encerrado. Seu vídeo e seus selos continuam disponíveis.</div>}

      {!finished && surprises.length > 0 && (
        <div className="tw-stack" style={{ marginTop: '1rem' }}>
          {surprises.map(m => <SurpriseCard key={m.id} mission={m} sub={subByMission[m.id]} onOpen={() => setOpen(m)} />)}
        </div>
      )}

      <section className="tw-section">
        <span className="tw-kicker">Missões</span>
        <div className="tw-stack" style={{ marginTop: '0.7rem' }}>
          {list.map(m => {
            const s = subByMission[m.id];
            const ok = s?.status === 'approved';
            const partner = m.partner && partners[m.partner];
            return (
              <button key={m.id} className={`tw-mission ${ok ? 'done' : ''} ${finished ? 'locked' : ''}`} disabled={finished || (s && s.status !== 'rejected')} onClick={() => setOpen(m)}>
                <span className="tw-mission-num">{ok ? <Check size={18} /> : m.category === 'quiz' ? <HelpCircle size={18} /> : m.points}</span>
                <span className="tw-mission-body">
                  <span className="tw-mission-title">{m.title}</span>
                  <span className="tw-mission-meta">
                    {m.category === 'quiz' && <span className="tw-chip tw-chip-quiz">Pergunta</span>}
                    {partner && <span className="tw-chip" style={{ color: partner.color, borderColor: partner.color }}>{partner.name}</span>}
                    {s?.status === 'rejected' && <span className="tw-chip tw-chip-bad">Recusada · envie de novo</span>}
                  </span>
                </span>
                <span className="tw-mission-pts">+{m.points}</span>
              </button>
            );
          })}
          {list.length === 0 && <div className="tw-empty">As missões aparecem aqui quando o jogo começar.</div>}
        </div>
      </section>

      {seals.length > 0 && (
        <section className="tw-section">
          <div className="tw-between" style={{ marginBottom: '0.7rem' }}>
            <span className="tw-kicker">Selos secretos</span>
            <span className="tw-chip tw-chip-gold">+{missions.find(m => m.category === 'selo')?.points || 25} pts cada</span>
          </div>
          <SealStrip seals={seals} found={foundSeals} />
          <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '0.7rem' }}>
            {seals.length} adesivos NFC secretos estão escondidos no evento. Encoste o celular e o selo é seu na hora.
          </p>
        </section>
      )}

      {points.length > 0 && (
        <section className="tw-section">
          <div className="tw-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Nfc color="var(--tw-gold)" size={30} />
            <div style={{ flex: 1 }}>
              <h3 className="tw-h3">Pontos NFC: {foundPoints.size} de {points.length}</h3>
              <p className="tw-p" style={{ fontSize: '0.85rem' }}>Ache os adesivos pelo evento, encoste o celular e registre com uma foto.</p>
            </div>
          </div>
        </section>
      )}

      <section className="tw-section">
        <span className="tw-kicker">Seus selos</span>
        <div style={{ marginTop: '0.7rem' }}>
          <BadgeGrid badges={badges} all={BADGES.filter(b => PUBLIC_BADGES.includes(b.id))} small />
        </div>
      </section>

      <div className="tw-grid tw-grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="tw-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Film color="var(--tw-gold)" size={30} />
          <div style={{ flex: 1 }}>
            <h3 className="tw-h3">Sua retrospectiva</h3>
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>{approved.filter(s => s.media?.length).length} registros até agora.</p>
          </div>
          <button className="tw-btn tw-btn-sm" onClick={() => navigate(`${base}/retrospectiva`)}>Ver vídeo</button>
        </div>
        <div className="tw-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Share2 color="var(--tw-gold)" size={30} />
          <div style={{ flex: 1 }}>
            <h3 className="tw-h3">Card de resultado</h3>
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>Pontos e selos para o Stories.</p>
          </div>
          <button className="tw-btn tw-btn-sm" onClick={() => navigate(`${base}/resultado`)}>Gerar</button>
        </div>
      </div>

      {open && (
        <MissionSheet
          mission={open}
          participant={participant}
          onClose={() => setOpen(null)}
          onDone={() => load()}
        />
      )}
    </div>
  );
}
