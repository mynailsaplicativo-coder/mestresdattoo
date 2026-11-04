import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Film, Share2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard, BadgeGrid } from './TwShell';
import { useTwParticipant, useCampaign, loadAdjustments, isDayUnlocked, currentDay, isMissionLive, dayName, DAY_BONUS } from './twData';
import { computeBadges, sumPoints, BADGES } from './badges';

const PUBLIC_BADGES = ['primeira', 'dia1', 'dia2', 'dia3', 'maratona', 'explorador', 'relampago'];

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
  const { campaign, base } = useCampaign();
  const [missions, setMissions] = useState(null);
  const [subs, setSubs] = useState([]);
  const [adj, setAdj] = useState({ public: 0, artist: 0 });
  const [day, setDay] = useState(() => currentDay(campaign));
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    const [m, s, a] = await Promise.all([
      supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('track', 'public').eq('active', true).order('day').order('position'),
      supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participant.id).eq('mission.campaign_id', campaign.id),
      loadAdjustments(participant.id, campaign.id),
    ]);
    setAdj(a);
    setMissions(m.data || []);
    setSubs(s.data || []);
  }, [participant.id, campaign.id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000); // missões surpresa aparecem sem recarregar
    return () => clearInterval(t);
  }, [load]);

  if (!missions) return <div className="tw-center-screen">Carregando missões...</div>;

  const subByMission = Object.fromEntries(subs.map(s => [s.mission_id, s]));
  const dayMissions = missions.filter(m => m.category === 'dia' && m.day === day);
  const surprises = missions.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const approved = subs.filter(s => s.status === 'approved');
  const allDayMissions = missions.filter(m => m.category === 'dia');
  const badges = computeBadges({ approved, missions, artistsCount: 0, ranks: {} }).filter(b => PUBLIC_BADGES.includes(b.id));
  const daysComplete = badges.filter(b => b.id.startsWith('dia')).length;
  const points = sumPoints(approved, missions, 'public') + adj.public;
  const doneToday = dayMissions.filter(m => subByMission[m.id] && subByMission[m.id].status !== 'rejected').length;
  const unlocked = isDayUnlocked(campaign, day);
  const finished = campaign.status === 'finished';

  return (
    <div className="tw-wrap">
      <span className="tw-kicker">Meu {campaign.event_name}</span>
      <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>Olá, {participant.name.split(' ')[0]}</h1>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="tw-stat"><b>{points}</b><span>Pontos</span></div>
          <div className="tw-stat"><b>{approved.filter(s => allDayMissions.some(m => m.id === s.mission_id)).length}/{allDayMissions.length}</b><span>Missões</span></div>
          <div className="tw-stat"><b>{daysComplete}</b><span>Dias completos</span></div>
        </div>
      </div>

      {finished && <div className="tw-notice" style={{ marginTop: '1rem' }}>Esta experiência foi encerrada. Seu vídeo e seus selos continuam disponíveis.</div>}

      {!finished && surprises.length > 0 && (
        <div className="tw-stack" style={{ marginTop: '1rem' }}>
          {surprises.map(m => <SurpriseCard key={m.id} mission={m} sub={subByMission[m.id]} onOpen={() => setOpen(m)} />)}
        </div>
      )}

      <div className="tw-tabs" style={{ marginTop: '1.25rem' }}>
        {[1, 2, 3].map(d => (
          <button key={d} className={`tw-tab ${day === d ? 'on' : ''}`} onClick={() => setDay(d)}>
            {!isDayUnlocked(campaign, d) && <Lock size={11} style={{ verticalAlign: -1, marginRight: 3 }} />}Dia {d}
            <small>{dayName(campaign, d)}</small>
          </button>
        ))}
      </div>

      <div style={{ margin: '1rem 0 0.75rem' }}>
        <div className="tw-between" style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }}>
          <span className="tw-p">{doneToday} de {dayMissions.length} missões</span>
          <span className="tw-gold" style={{ fontWeight: 800 }}>Completo = +{DAY_BONUS} pts</span>
        </div>
        <div className="tw-progress"><div style={{ width: `${dayMissions.length ? (doneToday / dayMissions.length) * 100 : 0}%` }} /></div>
      </div>

      {!unlocked && campaign.event_days?.[day - 1] && (
        <div className="tw-notice" style={{ marginBottom: '0.75rem' }}>
          <Lock size={14} style={{ verticalAlign: -2 }} /> As missões do Dia {day} são liberadas em {new Date(`${campaign.event_days[day - 1]}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}.
        </div>
      )}

      <div className="tw-stack">
        {dayMissions.map((m, i) => {
          const s = subByMission[m.id];
          const done = s && s.status === 'approved';
          return (
            <button
              key={m.id}
              className={`tw-mission ${done ? 'done' : ''} ${!unlocked || finished ? 'locked' : ''}`}
              disabled={!unlocked || finished || (s && s.status !== 'rejected')}
              onClick={() => setOpen(m)}
            >
              <span className="tw-mission-num">{done ? <Check size={18} /> : String(i + 1).padStart(2, '0')}</span>
              <span className="tw-mission-body">
                <span className="tw-mission-title">{m.title}</span>
                <span className="tw-mission-meta">
                  <span className="tw-chip">{m.media_count} {m.media_count > 1 ? 'registros' : 'registro'}</span>
                  {s?.status === 'pending' && <span className="tw-chip tw-chip-warn">Em análise</span>}
                  {s?.status === 'rejected' && <span className="tw-chip tw-chip-bad">Recusada · envie de novo</span>}
                </span>
              </span>
              <span className="tw-mission-pts">+{m.points}</span>
            </button>
          );
        })}
        {dayMissions.length === 0 && <div className="tw-empty">Nenhuma missão cadastrada para este dia.</div>}
      </div>

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
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>{approved.length} registros até agora.</p>
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
