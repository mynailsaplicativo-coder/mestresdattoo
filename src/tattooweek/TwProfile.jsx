import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AtSign, MapPin, Pencil, Save, X, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, BadgeGrid } from './TwShell';
import { useTwParticipant, useStaffRole, instagramUrl, campaignBase, uploadMedia } from './twData';
import { loadCampaignProgress, BADGES, BADGE_BY_ID } from './badges';

// Perfil permanente: soma todas as experiências (histórico, pontos acumulados, selos)
export default function TwProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tw = useTwParticipant();
  const staff = useStaffRole();
  const [person, setPerson] = useState(undefined);
  const [history, setHistory] = useState(null);
  const [editing, setEditing] = useState(false);

  const targetId = id || tw.participant?.id;
  const isSelf = tw.participant && tw.participant.id === targetId;

  const load = useCallback(async () => {
    if (!targetId) return;
    const { data: p } = await supabase.from('tw_participants').select('*').eq('id', targetId).maybeSingle();
    setPerson(p || null);
    if (!p) return;
    const { data: en } = await supabase.from('tw_enrollments').select('*, campaign:tw_campaigns(*)').eq('participant_id', targetId).order('created_at', { ascending: false });
    const byCampaign = {};
    (en || []).forEach(e => {
      if (!e.campaign) return;
      byCampaign[e.campaign_id] ||= { campaign: e.campaign, tracks: [] };
      byCampaign[e.campaign_id].tracks.push(e.track);
    });
    const items = await Promise.all(Object.values(byCampaign).map(async h => ({ ...h, progress: await loadCampaignProgress(targetId, h.campaign.id) })));
    setHistory(items);
  }, [targetId]);

  useEffect(() => { load(); }, [load]);

  if (!id && !tw.loading && !tw.isSignedIn) {
    return (
      <TwShell><div className="tw-center-screen"><div style={{ maxWidth: 380 }}>
        <h1 className="tw-h2">Seu perfil</h1>
        <p className="tw-p" style={{ margin: '0.5rem 0 1.25rem' }}>Entre para ver seu histórico, pontos e selos de todas as experiências.</p>
        <SignInButton mode="modal"><button className="tw-btn tw-btn-primary tw-btn-block">Entrar</button></SignInButton>
      </div></div></TwShell>
    );
  }
  if (!id && !tw.loading && tw.isSignedIn && !tw.participant) {
    return (
      <TwShell><div className="tw-center-screen"><div style={{ maxWidth: 380 }}>
        <h1 className="tw-h2">Você ainda não participou</h1>
        <p className="tw-p" style={{ margin: '0.5rem 0 1.25rem' }}>Entre em uma experiência para começar seu histórico.</p>
        <button className="tw-btn tw-btn-primary tw-btn-block" onClick={() => navigate('/experience')}>Ver experiências</button>
      </div></div></TwShell>
    );
  }
  if (person === undefined || (person && !history)) return <TwShell><div className="tw-center-screen">Carregando perfil...</div></TwShell>;
  if (person === null) return <TwShell><div className="tw-center-screen">Perfil não encontrado.</div></TwShell>;
  if (!person.show_in_ranking && !isSelf && !staff) {
    return <TwShell><div className="tw-center-screen"><div><Lock size={40} color="var(--tw-gold)" /><h1 className="tw-h2" style={{ marginTop: '1rem' }}>Perfil privado</h1></div></div></TwShell>;
  }

  const totalPoints = history.reduce((a, h) => a + (h.progress.points.public || 0) + (h.progress.points.artist || 0), 0);
  const totalMissions = history.reduce((a, h) => a + h.progress.approved.length, 0);
  const earned = new Map();
  history.forEach(h => h.progress.badges.forEach(b => earned.set(b.id, b)));
  if (history.length >= 2) earned.set('veterano', BADGE_BY_ID.veterano);
  const ig = instagramUrl(person.instagram);

  return (
    <TwShell>
      <div className="tw-wrap" style={{ maxWidth: 820 }}>
        <div className="tw-row" style={{ alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div className="tw-avatar">{person.photo_url ? <img src={person.photo_url} alt={person.name} /> : person.name.slice(0, 1)}</div>
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <span className="tw-kicker">{history.some(h => h.tracks.includes('artist')) ? 'Perfil de artista' : 'Perfil'}</span>
            <h1 className="tw-h2" style={{ margin: '0.2rem 0 0.3rem' }}>{person.name}</h1>
            <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.3rem 1rem', fontSize: '0.88rem', color: 'var(--tw-muted)' }}>
              {ig && <a href={ig} target="_blank" rel="noreferrer"><AtSign size={14} style={{ verticalAlign: -2 }} /> {person.instagram.replace(/^@/, '')}</a>}
              {person.city && <span><MapPin size={14} style={{ verticalAlign: -2 }} /> {person.city}</span>}
              {person.studio && <span>{person.studio}</span>}
              {person.styles && <span>{person.styles}</span>}
            </div>
          </div>
          {isSelf && !editing && <button className="tw-btn tw-btn-sm" onClick={() => setEditing(true)}><Pencil size={14} /> Editar perfil</button>}
        </div>
        {person.bio && <p className="tw-p" style={{ marginTop: '1rem' }}>{person.bio}</p>}

        {editing && <ProfileEditor person={person} onClose={() => setEditing(false)} onSaved={(p) => { setPerson(p); tw.setParticipant(p); setEditing(false); }} />}

        <div className="tw-card tw-card-gold" style={{ marginTop: '1.25rem' }}>
          <div className="tw-grid tw-stats-4">
            <div className="tw-stat"><b>{totalPoints}</b><span>Pontos Mestres</span></div>
            <div className="tw-stat"><b>{history.length}</b><span>Experiências</span></div>
            <div className="tw-stat"><b>{totalMissions}</b><span>Missões</span></div>
            <div className="tw-stat"><b>{earned.size}</b><span>Selos</span></div>
          </div>
        </div>

        <section className="tw-section">
          <span className="tw-kicker">Conquistas</span>
          <div style={{ marginTop: '0.7rem' }}><BadgeGrid badges={[...earned.values()]} all={BADGES} small /></div>
        </section>

        <section className="tw-section">
          <span className="tw-kicker">Histórico de participações</span>
          <div className="tw-stack" style={{ marginTop: '0.7rem' }}>
            {history.length === 0 && <div className="tw-empty">Nenhuma experiência ainda.</div>}
            {history.map(h => {
              const c = h.campaign;
              const pr = h.progress;
              return (
                <button key={c.id} className="tw-card tw-history" style={{ width: '100%', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(campaignBase(c))}>
                  {c.hero_image ? <img className="tw-history-img" src={c.hero_image} alt="" /> : <div className="tw-history-img" />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tw-row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                      <b>{c.name}</b>
                      {c.status === 'finished' && <span className="tw-chip">Encerrada</span>}
                    </div>
                    <div className="tw-p" style={{ fontSize: '0.8rem', margin: '0.2rem 0 0.4rem' }}>
                      {h.tracks.includes('public') && `Público: ${pr.points.public || 0} pts${pr.ranks.public ? ` (${pr.ranks.public}º)` : ''}`}
                      {h.tracks.length > 1 && ' · '}
                      {h.tracks.includes('artist') && `Challenge: ${pr.points.artist || 0} pts${pr.ranks.artist ? ` (${pr.ranks.artist}º)` : ''}`}
                    </div>
                    <div style={{ fontSize: '1.1rem', letterSpacing: 2 }}>{pr.badges.map(b => <span key={b.id} title={b.title}>{b.icon}</span>)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </TwShell>
  );
}

function ProfileEditor({ person, onClose, onSaved }) {
  const [f, setF] = useState({
    name: person.name || '', instagram: person.instagram || '', city: person.city || '', studio: person.studio || '',
    styles: person.styles || '', bio: person.bio || '', photo_url: person.photo_url || '',
    show_in_ranking: person.show_in_ranking, consent_marketing: person.consent_marketing,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    try {
      const m = await uploadMedia(file, `profiles/${person.id}`);
      setF(x => ({ ...x, photo_url: m.url }));
    } catch (e) { setError(e.message); }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data, error: err } = await supabase.from('tw_participants').update(f).eq('id', person.id).select().single();
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved(data);
  };

  return (
    <form className="tw-card tw-stack" style={{ marginTop: '1rem' }} onSubmit={save}>
      <div className="tw-between"><h3 className="tw-h3">Editar perfil</h3><button type="button" className="tw-sheet-x" onClick={onClose}><X size={20} /></button></div>
      <div className="tw-row">
        <div className="tw-avatar" style={{ width: 64, height: 64, flex: '0 0 64px', fontSize: '1.4rem' }}>{f.photo_url ? <img src={f.photo_url} alt="" /> : f.name.slice(0, 1)}</div>
        <label className="tw-btn tw-btn-sm">Trocar foto<input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && upload(e.target.files[0])} /></label>
      </div>
      <div className="tw-grid tw-grid-2">
        <label className="tw-field"><span>Nome</span><input className="tw-input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></label>
        <label className="tw-field"><span>Instagram</span><input className="tw-input" value={f.instagram} onChange={e => setF({ ...f, instagram: e.target.value })} /></label>
        <label className="tw-field"><span>Cidade / Estado</span><input className="tw-input" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} /></label>
        <label className="tw-field"><span>Estúdio</span><input className="tw-input" value={f.studio} onChange={e => setF({ ...f, studio: e.target.value })} /></label>
      </div>
      <label className="tw-field"><span>Estilos</span><input className="tw-input" placeholder="Realismo, Old School, Fineline..." value={f.styles} onChange={e => setF({ ...f, styles: e.target.value })} /></label>
      <label className="tw-field"><span>Sobre você</span><textarea className="tw-input" value={f.bio} onChange={e => setF({ ...f, bio: e.target.value })} /></label>
      <label className="tw-check"><input type="checkbox" checked={!f.show_in_ranking} onChange={e => setF({ ...f, show_in_ranking: !e.target.checked })} /><span>Perfil privado: não aparecer no ranking nem ter perfil público.</span></label>
      <label className="tw-check"><input type="checkbox" checked={!!f.consent_marketing} onChange={e => setF({ ...f, consent_marketing: e.target.checked })} /><span>Autorizo a divulgação dos meus registros pelo Mestres da Tattoo e parceiros.</span></label>
      {error && <div className="tw-error">{error}</div>}
      <button className="tw-btn tw-btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}</button>
    </form>
  );
}
