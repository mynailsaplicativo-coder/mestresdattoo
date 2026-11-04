import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Film } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard } from './TwShell';
import { useTwParticipant, loadConfig, isDayUnlocked, currentDay, isMissionLive, DAY_NAMES, DAY_BONUS } from './twData';

export default function TwPublic() {
  const tw = useTwParticipant();
  return (
    <TwShell>
      <JoinGate tw={tw} mode="public">
        <PublicPanel participant={tw.participant} />
      </JoinGate>
    </TwShell>
  );
}

function PublicPanel({ participant }) {
  const navigate = useNavigate();
  const [cfg, setCfg] = useState(null);
  const [missions, setMissions] = useState([]);
  const [subs, setSubs] = useState([]);
  const [day, setDay] = useState(1);
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    const [c, m, s] = await Promise.all([
      loadConfig(),
      supabase.from('tw_missions').select('*').eq('track', 'public').eq('active', true).order('day').order('position'),
      supabase.from('tw_submissions').select('*').eq('participant_id', participant.id),
    ]);
    setCfg(c);
    setMissions(m.data || []);
    setSubs(s.data || []);
    return c;
  }, [participant.id]);

  useEffect(() => {
    load().then(c => setDay(currentDay(c)));
    const t = setInterval(load, 60000); // missões surpresa aparecem sem recarregar
    return () => clearInterval(t);
  }, [load]);

  if (!cfg) return <div className="tw-center-screen">Carregando missões...</div>;

  const subByMission = Object.fromEntries(subs.map(s => [s.mission_id, s]));
  const dayMissions = missions.filter(m => m.category === 'dia' && m.day === day);
  const surprises = missions.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const counted = subs.filter(s => s.status === 'approved');
  const allDayMissions = missions.filter(m => m.category === 'dia');
  const daysComplete = [1, 2, 3].filter(d => {
    const list = allDayMissions.filter(m => m.day === d);
    return list.length > 0 && list.every(m => subByMission[m.id]?.status === 'approved');
  }).length;
  const points = counted.reduce((a, s) => a + (s.points || 0), 0) + daysComplete * DAY_BONUS;
  const doneToday = dayMissions.filter(m => subByMission[m.id] && subByMission[m.id].status !== 'rejected').length;
  const unlocked = isDayUnlocked(cfg, day);

  return (
    <div className="tw-wrap">
      <div className="tw-between" style={{ alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <span className="tw-kicker">Meu Tattoo Week</span>
          <h1 className="tw-h2" style={{ marginTop: '0.3rem' }}>Olá, {participant.name.split(' ')[0]}</h1>
        </div>
      </div>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="tw-stat"><b>{points}</b><span>Pontos</span></div>
          <div className="tw-stat"><b>{counted.filter(s => allDayMissions.some(m => m.id === s.mission_id)).length}/{allDayMissions.length}</b><span>Missões</span></div>
          <div className="tw-stat"><b>{daysComplete}</b><span>Dias completos</span></div>
        </div>
      </div>

      {surprises.length > 0 && (
        <div className="tw-stack" style={{ marginTop: '1rem' }}>
          {surprises.map(m => <SurpriseCard key={m.id} mission={m} sub={subByMission[m.id]} onOpen={() => setOpen(m)} />)}
        </div>
      )}

      <div className="tw-tabs" style={{ marginTop: '1.25rem' }}>
        {[1, 2, 3].map(d => (
          <button key={d} className={`tw-tab ${day === d ? 'on' : ''}`} onClick={() => setDay(d)}>
            {!isDayUnlocked(cfg, d) && <Lock size={11} style={{ verticalAlign: -1, marginRight: 3 }} />}Dia {d}
            <small>{DAY_NAMES[d]}</small>
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

      {!unlocked && (
        <div className="tw-notice" style={{ marginBottom: '0.75rem' }}>
          <Lock size={14} style={{ verticalAlign: -2 }} /> As missões do Dia {day} são liberadas em {new Date(`${cfg.event_days[day - 1]}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}.
        </div>
      )}

      <div className="tw-stack">
        {dayMissions.map((m, i) => {
          const s = subByMission[m.id];
          const done = s && s.status === 'approved';
          return (
            <button
              key={m.id}
              className={`tw-mission ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
              disabled={!unlocked || (s && s.status !== 'rejected')}
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

      <div className="tw-card" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Film color="var(--tw-gold)" size={32} />
        <div style={{ flex: '1 1 200px' }}>
          <h3 className="tw-h3">Sua retrospectiva</h3>
          <p className="tw-p" style={{ fontSize: '0.88rem' }}>{counted.length} registros até agora. Quanto mais missões, melhor fica o vídeo.</p>
        </div>
        <button className="tw-btn tw-btn-sm" onClick={() => navigate('/tattooweek/retrospectiva')}>Ver meu vídeo</button>
      </div>

      {open && (
        <MissionSheet
          mission={open}
          participant={participant}
          onClose={() => setOpen(null)}
          onDone={(sub) => setSubs(prev => [...prev.filter(s => s.mission_id !== sub.mission_id), sub])}
        />
      )}
    </div>
  );
}
