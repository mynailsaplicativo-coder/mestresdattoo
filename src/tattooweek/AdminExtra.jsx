import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Tv, RefreshCw, Star, Download, X, Ban, Trash2, Plus, Save, Trophy, Wand2, PackageCheck, Megaphone, UserPlus, ExternalLink, Gift,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { campaignBase, downloadBlob, CATEGORY_LABELS } from './twData';
import { loadCampaignProgress } from './badges';

const ago = (iso) => {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Date(iso).toLocaleDateString('pt-BR');
};

const csv = (rows) => '﻿' + rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');

function Media({ m }) {
  return m.type === 'video' ? <video src={m.url} muted playsInline preload="metadata" /> : <img src={m.url} alt="" loading="lazy" />;
}

// --- Ao vivo ---

export function Live({ campaign, onOpenParticipant }) {
  const [d, setD] = useState(null);
  const [at, setAt] = useState(null);

  const load = useCallback(async () => {
    const since = new Date(Date.now() - 3600000).toISOString();
    const [feed, r, en, hour, scans] = await Promise.all([
      supabase.from('tw_submissions').select('id, status, media, created_at, participant_id, participant:tw_participants(name, instagram), mission:tw_missions!inner(campaign_id, title, track, category)')
        .eq('mission.campaign_id', campaign.id).order('created_at', { ascending: false }).limit(30),
      supabase.from('tw_ranking').select('participant_id, name, track, points').eq('campaign_id', campaign.id).order('points', { ascending: false }).order('last_at'),
      supabase.from('tw_enrollments').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id),
      supabase.from('tw_submissions').select('id, mission:tw_missions!inner(campaign_id)', { count: 'exact', head: true }).eq('mission.campaign_id', campaign.id).gte('created_at', since),
      supabase.from('tw_events').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id).in('type', ['nfc_scan', 'qr_scan']).gte('created_at', since),
    ]);
    const rows = r.data || [];
    setD({
      feed: feed.data || [],
      artist: rows.filter(x => x.track === 'artist').slice(0, 5),
      public: rows.filter(x => x.track === 'public').slice(0, 5),
      people: en.count || 0,
      lastHour: hour.count || 0,
      scansHour: scans.count || 0,
    });
    setAt(new Date());
  }, [campaign.id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  const reject = async (row) => {
    const reason = prompt('Recusar este envio? Motivo (opcional):');
    if (reason === null) return;
    await supabase.from('tw_submissions').update({ status: 'rejected', points: 0, reviewer_note: reason || null, reviewed_at: new Date().toISOString() }).eq('id', row.id);
    load();
  };

  if (!d) return <p className="tw-p">Carregando...</p>;
  const telao = `${campaignBase(campaign)}/telao`;

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Ao vivo</h1>
        <div className="tw-row">
          <span className="tw-p" style={{ fontSize: '0.78rem' }}>Atualiza a cada 30s · {at?.toLocaleTimeString('pt-BR')}</span>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={load}><RefreshCw size={14} /></button>
          <a className="tw-btn tw-btn-sm tw-btn-primary" href={telao} target="_blank" rel="noreferrer"><Tv size={14} /> Abrir telão</a>
        </div>
      </div>
      <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
        <div className="tw-card tw-kpi"><b>{d.people}</b><span>Inscritos</span></div>
        <div className="tw-card tw-kpi"><b>{d.lastHour}</b><span>Envios na última hora</span></div>
        <div className="tw-card tw-kpi"><b>{d.scansHour}</b><span>Leituras NFC/QR (1h)</span></div>
      </div>
      <div className="tw-grid tw-grid-2">
        <div className="tw-card">
          <h3 className="tw-h3" style={{ marginBottom: '0.5rem' }}>Últimos envios</h3>
          {d.feed.length === 0 && <p className="tw-p">Nenhum envio ainda.</p>}
          {d.feed.map(f => (
            <div key={f.id} className="tw-feed-item">
              {f.media?.[0] ? <Media m={f.media[0]} /> : <div style={{ width: 44, height: 44 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <button className="tw-gold" style={{ background: 'none', border: 0, padding: 0, font: 'inherit', fontWeight: 800, cursor: 'pointer' }} onClick={() => onOpenParticipant(f.participant_id)}>{f.participant?.name}</button>
                <div className="tw-p" style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.mission?.title}</div>
              </div>
              <span className={`tw-chip ${f.status === 'approved' ? 'tw-chip-ok' : f.status === 'rejected' ? 'tw-chip-bad' : 'tw-chip-warn'}`}>{ago(f.created_at)}</span>
              {f.status !== 'rejected' && <button className="tw-icon-btn" title="Recusar" onClick={() => reject(f)}><X size={14} /></button>}
            </div>
          ))}
        </div>
        <div className="tw-stack">
          {[['Top 5 Artist Challenge', d.artist], [`Top 5 Meu ${campaign.event_name || 'evento'}`, d.public]].map(([t, list]) => (
            <div key={t} className="tw-card">
              <h3 className="tw-h3" style={{ marginBottom: '0.5rem' }}>{t}</h3>
              {list.length === 0 && <p className="tw-p">Ninguém pontuou ainda.</p>}
              {list.map((r, i) => (
                <div key={r.participant_id} className="tw-between" style={{ padding: '0.35rem 0', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => onOpenParticipant(r.participant_id)}>
                  <span><b className="tw-gold">{i + 1}º</b> {r.name}</span><b>{r.points}</b>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Galeria de conteúdo ---

export function Gallery({ campaign, onOpenParticipant }) {
  const [rows, setRows] = useState(null);
  const [f, setF] = useState({ track: 'all', consent: false, favorites: false, type: 'all', mission: '' });
  const [missions, setMissions] = useState([]);

  const load = useCallback(async () => {
    let q = supabase.from('tw_submissions')
      .select('id, media, favorite, created_at, participant_id, participant:tw_participants!inner(name, instagram, consent_marketing), mission:tw_missions!inner(id, campaign_id, title, track)')
      .eq('mission.campaign_id', campaign.id).eq('status', 'approved').order('created_at', { ascending: false }).limit(300);
    if (f.consent) q = q.eq('participant.consent_marketing', true);
    if (f.favorites) q = q.eq('favorite', true);
    if (f.track !== 'all') q = q.eq('mission.track', f.track);
    if (f.mission) q = q.eq('mission_id', f.mission);
    const { data } = await q;
    setRows(data || []);
  }, [campaign.id, f]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    supabase.from('tw_missions').select('id, title').eq('campaign_id', campaign.id).order('track').order('day').order('position').then(({ data }) => setMissions(data || []));
  }, [campaign.id]);

  const items = (rows || []).flatMap(s => (s.media || []).map(m => ({ ...m, s }))).filter(m => f.type === 'all' || m.type === f.type);

  const toggleFav = async (s) => {
    await supabase.from('tw_submissions').update({ favorite: !s.favorite }).eq('id', s.id);
    setRows(rs => rs.map(r => (r.id === s.id ? { ...r, favorite: !r.favorite } : r)));
  };

  const reject = async (s) => {
    if (!confirm('Recusar este envio? Ele sai da galeria, da retrospectiva e perde os pontos.')) return;
    await supabase.from('tw_submissions').update({ status: 'rejected', points: 0, reviewed_at: new Date().toISOString() }).eq('id', s.id);
    setRows(rs => rs.filter(r => r.id !== s.id));
  };

  const exportList = () => downloadBlob(new Blob([csv([
    ['participante', 'instagram', 'autoriza_divulgacao', 'missao', 'tipo', 'url', 'favorito', 'data'],
    ...items.map(m => [m.s.participant?.name, m.s.participant?.instagram, m.s.participant?.consent_marketing ? 'sim' : 'não', m.s.mission?.title, m.type, m.url, m.s.favorite ? 'sim' : '', new Date(m.s.created_at).toLocaleString('pt-BR')]),
  ])], { type: 'text/csv;charset=utf-8' }), `galeria-${campaign.slug}.csv`);

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Galeria ({items.length})</h1>
        <button className="tw-btn tw-btn-sm" onClick={exportList}><Download size={14} /> Exportar lista</button>
      </div>
      <div className="tw-row" style={{ flexWrap: 'wrap' }}>
        <select className="tw-input" style={{ width: 'auto' }} value={f.track} onChange={e => setF({ ...f, track: e.target.value })}>
          <option value="all">Todas as trilhas</option><option value="public">Público</option><option value="artist">Artist Challenge</option>
        </select>
        <select className="tw-input" style={{ width: 'auto' }} value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>
          <option value="all">Fotos e vídeos</option><option value="image">Só fotos</option><option value="video">Só vídeos</option>
        </select>
        <select className="tw-input" style={{ width: 'auto', maxWidth: 260 }} value={f.mission} onChange={e => setF({ ...f, mission: e.target.value })}>
          <option value="">Todas as missões</option>{missions.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><input type="checkbox" checked={f.consent} onChange={e => setF({ ...f, consent: e.target.checked })} /> Só quem autorizou divulgação</label>
        <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><input type="checkbox" checked={f.favorites} onChange={e => setF({ ...f, favorites: e.target.checked })} /> Só favoritos</label>
      </div>
      <p className="tw-p" style={{ fontSize: '0.8rem' }}>⭐ marca favoritos (melhor conteúdo, posts dos parceiros). Só publique nas redes quem autorizou divulgação.</p>
      {rows === null && <p className="tw-p">Carregando...</p>}
      <div className="tw-gallery">
        {items.map((m, i) => (
          <div key={`${m.url}-${i}`} className="tw-gallery-item">
            <a href={m.url} target="_blank" rel="noreferrer"><Media m={m} /></a>
            <div className="tw-gallery-actions">
              <button className={`tw-icon-btn ${m.s.favorite ? 'on' : ''}`} title="Favorito" onClick={() => toggleFav(m.s)}><Star size={14} fill={m.s.favorite ? 'currentColor' : 'none'} /></button>
              <a className="tw-icon-btn" href={m.url} download title="Baixar"><Download size={14} /></a>
              <button className="tw-icon-btn" title="Recusar" onClick={() => reject(m.s)}><X size={14} /></button>
            </div>
            <div className="tw-gallery-meta">
              <button style={{ background: 'none', border: 0, padding: 0, color: '#fff', font: 'inherit', fontWeight: 800, cursor: 'pointer' }} onClick={() => onOpenParticipant(m.s.participant_id)}>{m.s.participant?.name}</button>
              {!m.s.participant?.consent_marketing && <span style={{ color: '#fca5a5' }}> · sem autorização</span>}
              <br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>{m.s.mission?.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Ficha do participante ---

export function ParticipantSheet({ participantId, campaign, role, onClose, onChanged }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [p, setP] = useState(null);
  const [subs, setSubs] = useState([]);
  const [adjs, setAdjs] = useState([]);
  const [progress, setProgress] = useState(null);
  const [missions, setMissions] = useState([]);
  const [artists, setArtists] = useState([]);
  const [adj, setAdj] = useState({ track: 'artist', points: 10, reason: '' });
  const [credit, setCredit] = useState({ mission: '', artist: '' });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const [a, s, ad, m, ar, pr] = await Promise.all([
      supabase.from('tw_participants').select('*').eq('id', participantId).single(),
      supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*), artist:tw_artists(name)').eq('participant_id', participantId).eq('mission.campaign_id', campaign.id).order('created_at', { ascending: false }),
      supabase.from('tw_adjustments').select('*').eq('participant_id', participantId).eq('campaign_id', campaign.id).order('created_at', { ascending: false }),
      supabase.from('tw_missions').select('id, title, track, category, points').eq('campaign_id', campaign.id).eq('active', true).order('track').order('day').order('position'),
      supabase.from('tw_artists').select('id, name, slug').eq('campaign_id', campaign.id).eq('active', true).order('slug'),
      loadCampaignProgress(participantId, campaign.id),
    ]);
    setP(a.data);
    setSubs(s.data || []);
    setAdjs(ad.data || []);
    setMissions(m.data || []);
    setArtists(ar.data || []);
    setProgress(pr);
  }, [participantId, campaign.id]);

  useEffect(() => { load(); }, [load]);

  const done = async (text) => { setMsg(text); await load(); onChanged?.(); };

  const setStatus = async (s, status) => {
    await supabase.from('tw_submissions').update({ status, points: status === 'approved' ? s.mission.points : 0, reviewed_at: new Date().toISOString() }).eq('id', s.id);
    done(status === 'approved' ? 'Envio aprovado.' : 'Envio recusado.');
  };

  const addAdjustment = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('tw_adjustments').insert([{
      participant_id: participantId, campaign_id: campaign.id, track: adj.track, points: Number(adj.points),
      reason: adj.reason || null, created_by: user?.primaryEmailAddress?.emailAddress,
    }]);
    if (error) { setMsg(error.message); return; }
    setAdj({ ...adj, reason: '' });
    done('Ajuste registrado.');
  };

  const removeAdjustment = async (id) => {
    await supabase.from('tw_adjustments').delete().eq('id', id);
    done('Ajuste removido.');
  };

  // Alternativa manual quando NFC/internet falham: credita a missão sem foto
  const giveCredit = async (e) => {
    e.preventDefault();
    const m = missions.find(x => x.id === credit.mission);
    if (!m) return;
    const artistId = m.category === 'passaporte' ? credit.artist || null : null;
    if (m.category === 'passaporte' && !artistId) { setMsg('Escolha o artista do carimbo.'); return; }
    let del = supabase.from('tw_submissions').delete().eq('participant_id', participantId).eq('mission_id', m.id);
    del = artistId ? del.eq('artist_id', artistId) : del.is('artist_id', null);
    await del;
    const { error } = await supabase.from('tw_submissions').insert([{
      participant_id: participantId, mission_id: m.id, artist_id: artistId, media: [], status: 'approved', points: m.points,
      note: `Crédito manual por ${user?.primaryEmailAddress?.emailAddress || 'equipe'}`, reviewed_at: new Date().toISOString(),
    }]);
    if (error) { setMsg(error.message); return; }
    setCredit({ mission: '', artist: '' });
    done('Missão creditada.');
  };

  const toggleBlock = async () => {
    if (p.blocked) {
      await supabase.from('tw_participants').update({ blocked: false, blocked_reason: null }).eq('id', p.id);
      done('Participante reativado.');
    } else {
      const reason = prompt('Motivo da desclassificação (aparece para o participante):');
      if (reason === null) return;
      await supabase.from('tw_participants').update({ blocked: true, blocked_reason: reason || null }).eq('id', p.id);
      done('Participante desclassificado: saiu do ranking.');
    }
  };

  const removeFromCampaign = async () => {
    if (!confirm(`Remover ${p.name} desta campanha? Os envios dele nesta campanha são apagados e isso não pode ser desfeito.`)) return;
    const ids = subs.map(s => s.id);
    if (ids.length) await supabase.from('tw_submissions').delete().in('id', ids);
    await supabase.from('tw_adjustments').delete().eq('participant_id', p.id).eq('campaign_id', campaign.id);
    await supabase.from('tw_enrollments').delete().eq('participant_id', p.id).eq('campaign_id', campaign.id);
    onChanged?.();
    onClose();
  };

  const creditMission = missions.find(x => x.id === credit.mission);

  return (
    <div className="tw-sheet-bg" onClick={onClose}>
      <div className="tw-sheet tw-stack tw-modal-wide" onClick={e => e.stopPropagation()}>
        {!p || !progress ? <p className="tw-p">Carregando...</p> : (
          <>
            <div className="tw-between" style={{ alignItems: 'flex-start' }}>
              <div className="tw-row">
                <div className="tw-avatar" style={{ width: 64, height: 64, flex: '0 0 64px', fontSize: '1.4rem' }}>{p.photo_url ? <img src={p.photo_url} alt="" /> : p.name.slice(0, 1)}</div>
                <div>
                  <h2 className="tw-h2" style={{ fontSize: '1.4rem', margin: 0 }}>{p.name} {p.blocked && <span className="tw-chip tw-chip-bad">Desclassificado</span>}</h2>
                  <div className="tw-p" style={{ fontSize: '0.82rem' }}>{[p.email, p.phone, p.instagram, p.city].filter(Boolean).join(' · ')}</div>
                  <div className="tw-row" style={{ gap: '0.3rem', marginTop: 4, flexWrap: 'wrap' }}>
                    {p.consent_marketing ? <span className="tw-chip tw-chip-ok">Autoriza divulgação</span> : <span className="tw-chip">Não autoriza divulgação</span>}
                    {!p.show_in_ranking && <span className="tw-chip">Participação privada</span>}
                  </div>
                </div>
              </div>
              <button className="tw-sheet-x" onClick={onClose}><X size={22} /></button>
            </div>
            {msg && <div className="tw-notice">{msg}</div>}

            <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="tw-card tw-kpi"><b>{progress.points.public || 0}</b><span>Pts público{progress.ranks.public ? ` · ${progress.ranks.public}º` : ''}</span></div>
              <div className="tw-card tw-kpi"><b>{progress.points.artist || 0}</b><span>Pts challenge{progress.ranks.artist ? ` · ${progress.ranks.artist}º` : ''}</span></div>
              <div className="tw-card tw-kpi"><b>{progress.approved.length}</b><span>Missões</span></div>
              <div className="tw-card tw-kpi"><b>{progress.badges.length}</b><span>Selos</span></div>
            </div>
            <div style={{ fontSize: '1.3rem', letterSpacing: 2 }}>{progress.badges.map(b => <span key={b.id} title={b.title}>{b.icon}</span>)}</div>

            <div className="tw-grid tw-grid-2">
              <form className="tw-card tw-stack" onSubmit={addAdjustment}>
                <h3 className="tw-h3">Ajuste de pontos</h3>
                <div className="tw-row">
                  <select className="tw-input" style={{ width: 'auto' }} value={adj.track} onChange={e => setAdj({ ...adj, track: e.target.value })}><option value="artist">Challenge</option><option value="public">Público</option></select>
                  <input className="tw-input" type="number" style={{ width: 100 }} value={adj.points} onChange={e => setAdj({ ...adj, points: e.target.value })} />
                </div>
                <input className="tw-input" placeholder="Motivo (ex.: bônus palco, penalidade fraude)" value={adj.reason} onChange={e => setAdj({ ...adj, reason: e.target.value })} required />
                <button className="tw-btn tw-btn-sm tw-btn-primary"><Plus size={14} /> Aplicar (use negativo para penalidade)</button>
                {adjs.map(a => (
                  <div key={a.id} className="tw-between" style={{ fontSize: '0.82rem' }}>
                    <span><b style={{ color: a.points < 0 ? '#fca5a5' : '#86efac' }}>{a.points > 0 ? '+' : ''}{a.points}</b> {a.track === 'artist' ? 'challenge' : 'público'} · {a.reason}</span>
                    <button type="button" className="tw-icon-btn" onClick={() => removeAdjustment(a.id)} title="Remover"><Trash2 size={13} /></button>
                  </div>
                ))}
              </form>
              <form className="tw-card tw-stack" onSubmit={giveCredit}>
                <h3 className="tw-h3">Creditar missão manualmente</h3>
                <p className="tw-p" style={{ fontSize: '0.8rem' }}>Para quando o NFC, a câmera ou a internet falharem e a equipe viu a missão sendo cumprida.</p>
                <select className="tw-input" value={credit.mission} onChange={e => setCredit({ ...credit, mission: e.target.value })} required>
                  <option value="">Escolha a missão</option>
                  {missions.map(m => <option key={m.id} value={m.id}>{m.track === 'artist' ? '[Challenge] ' : '[Público] '}{m.title} (+{m.points})</option>)}
                </select>
                {creditMission?.category === 'passaporte' && (
                  <select className="tw-input" value={credit.artist} onChange={e => setCredit({ ...credit, artist: e.target.value })} required>
                    <option value="">Carimbo de qual artista?</option>
                    {artists.map(a => <option key={a.id} value={a.id}>{a.name} ({a.slug})</option>)}
                  </select>
                )}
                <button className="tw-btn tw-btn-sm tw-btn-primary"><Gift size={14} /> Creditar</button>
              </form>
            </div>

            <h3 className="tw-h3">Envios ({subs.length})</h3>
            <div className="tw-stack">
              {subs.map(s => (
                <div key={s.id} className="tw-card" style={{ padding: '0.7rem' }}>
                  <div className="tw-between" style={{ flexWrap: 'wrap' }}>
                    <div>
                      <b style={{ fontSize: '0.9rem' }}>{s.mission.title}</b>
                      <div className="tw-p" style={{ fontSize: '0.76rem' }}>
                        {CATEGORY_LABELS[s.mission.category]}{s.artist ? ` · com ${s.artist.name}` : ''} · {new Date(s.created_at).toLocaleString('pt-BR')} · {s.points} pts
                        {s.note && ` · “${s.note}”`}
                      </div>
                    </div>
                    <div className="tw-row">
                      <span className={`tw-chip ${s.status === 'approved' ? 'tw-chip-ok' : s.status === 'rejected' ? 'tw-chip-bad' : 'tw-chip-warn'}`}>{s.status === 'approved' ? 'Aprovado' : s.status === 'rejected' ? 'Recusado' : 'Pendente'}</span>
                      {s.status !== 'approved' && <button className="tw-btn tw-btn-sm tw-btn-ok" onClick={() => setStatus(s, 'approved')}>Aprovar</button>}
                      {s.status !== 'rejected' && <button className="tw-btn tw-btn-sm tw-btn-bad" onClick={() => setStatus(s, 'rejected')}>Recusar</button>}
                    </div>
                  </div>
                  {s.media?.length > 0 && <div className="tw-thumbs" style={{ marginTop: '0.5rem' }}>{s.media.map(m => <a key={m.url} href={m.url} target="_blank" rel="noreferrer" style={{ width: 64, height: 84 }}><Media m={m} /></a>)}</div>}
                </div>
              ))}
            </div>

            <div className="tw-row" style={{ flexWrap: 'wrap' }}>
              <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate(`${campaignBase(campaign)}/retrospectiva?p=${p.id}`)}>Ver retrospectiva</button>
              <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate(`/experience/perfil/${p.id}`)}><ExternalLink size={14} /> Perfil</button>
              <button className="tw-btn tw-btn-sm tw-btn-bad" onClick={toggleBlock}><Ban size={14} /> {p.blocked ? 'Reativar' : 'Desclassificar'}</button>
              {role === 'admin' && <button className="tw-btn tw-btn-sm tw-btn-bad" onClick={removeFromCampaign}><Trash2 size={14} /> Remover da campanha</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Premiação ---

const RULES = {
  artist_rank: 'Ranking Artist Challenge',
  public_rank: 'Ranking público',
  passport: 'Mais carimbos NFC',
  manual: 'Escolha manual',
};

function code() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function Awards({ campaign, reload, onOpenParticipant }) {
  const [rows, setRows] = useState(null);
  const [people, setPeople] = useState([]);
  const [edit, setEdit] = useState(null);
  const [published, setPublished] = useState(!!campaign.awards_published);

  const load = useCallback(async () => {
    const [a, en] = await Promise.all([
      supabase.from('tw_awards').select('*, participant:tw_participants(id, name, instagram, phone, email)').eq('campaign_id', campaign.id).order('position'),
      supabase.from('tw_enrollments').select('participant:tw_participants(id, name, instagram, blocked)').eq('campaign_id', campaign.id),
    ]);
    setRows(a.data || []);
    const map = {};
    (en.data || []).forEach(e => { if (e.participant && !e.participant.blocked) map[e.participant.id] = e.participant; });
    setPeople(Object.values(map).sort((x, y) => x.name.localeCompare(y.name)));
  }, [campaign.id]);

  useEffect(() => { load(); }, [load]);

  // Sugere vencedores pelas regras de cada prêmio (sem repetir pessoa entre prêmios)
  const suggest = async () => {
    const [r, pass] = await Promise.all([
      supabase.from('tw_ranking').select('participant_id, track, points').eq('campaign_id', campaign.id).order('points', { ascending: false }).order('last_at'),
      supabase.from('tw_submissions').select('participant_id, created_at, participant:tw_participants!inner(show_in_ranking, blocked), mission:tw_missions!inner(campaign_id, category)')
        .eq('mission.campaign_id', campaign.id).eq('mission.category', 'passaporte').eq('status', 'approved'),
    ]);
    const stampCount = {};
    const lastAt = {};
    (pass.data || []).filter(x => !x.participant.blocked).forEach(x => {
      stampCount[x.participant_id] = (stampCount[x.participant_id] || 0) + 1;
      if (!lastAt[x.participant_id] || x.created_at > lastAt[x.participant_id]) lastAt[x.participant_id] = x.created_at;
    });
    const lists = {
      artist_rank: (r.data || []).filter(x => x.track === 'artist').map(x => x.participant_id),
      public_rank: (r.data || []).filter(x => x.track === 'public').map(x => x.participant_id),
      passport: Object.keys(stampCount).sort((a, b) => stampCount[b] - stampCount[a] || lastAt[a].localeCompare(lastAt[b])),
    };
    const used = new Set(rows.filter(a => a.participant_id && a.status !== 'open').map(a => a.participant_id));
    let changed = 0;
    for (const a of rows) {
      if (a.status !== 'open' || a.rule === 'manual' || !lists[a.rule]) continue;
      const pick = lists[a.rule].filter(id => !used.has(id))[(a.rank || 1) - 1];
      if (!pick) continue;
      used.add(pick);
      await supabase.from('tw_awards').update({ participant_id: pick }).eq('id', a.id);
      changed++;
    }
    await load();
    alert(changed ? `${changed} sugestão(ões) preenchida(s). Confira e clique em “Confirmar vencedor”.` : 'Nenhuma sugestão nova (prêmios manuais ou já confirmados).');
  };

  const update = async (a, patch) => {
    await supabase.from('tw_awards').update(patch).eq('id', a.id);
    load();
  };

  const save = async (e) => {
    e.preventDefault();
    const { participant, ...row } = edit;
    void participant;
    const data = { ...row, campaign_id: campaign.id, rank: Number(row.rank) || 1, position: Number(row.position) || 0 };
    const { error } = row.id ? await supabase.from('tw_awards').update(data).eq('id', row.id) : await supabase.from('tw_awards').insert([data]);
    if (error) { alert(error.message); return; }
    setEdit(null);
    load();
  };

  const remove = async (a) => {
    if (!confirm(`Excluir o prêmio “${a.title}”?`)) return;
    await supabase.from('tw_awards').delete().eq('id', a.id);
    load();
  };

  const togglePublish = async () => {
    await supabase.from('tw_campaigns').update({ awards_published: !published }).eq('id', campaign.id);
    setPublished(!published);
    reload();
  };

  const exportCsv = () => downloadBlob(new Blob([csv([
    ['premio', 'vencedor', 'instagram', 'telefone', 'email', 'codigo', 'status', 'entregue_em'],
    ...rows.map(a => [a.title, a.participant?.name, a.participant?.instagram, a.participant?.phone, a.participant?.email, a.redeem_code, a.status, a.delivered_at && new Date(a.delivered_at).toLocaleString('pt-BR')]),
  ])], { type: 'text/csv;charset=utf-8' }), `premiacao-${campaign.slug}.csv`);

  if (!rows) return <p className="tw-p">Carregando...</p>;

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Premiação</h1>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <button className="tw-btn tw-btn-sm" onClick={suggest}><Wand2 size={14} /> Sugerir vencedores</button>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={exportCsv}><Download size={14} /> CSV</button>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setEdit({ title: '', description: '', rule: 'manual', rank: 1, position: rows.length + 1, status: 'open' })}><Plus size={14} /> Prêmio</button>
        </div>
      </div>
      <label className="tw-check">
        <input type="checkbox" checked={published} onChange={togglePublish} />
        <span><b>Publicar vencedores</b> na página de premiação do site. Deixe desligado até o anúncio oficial.</span>
      </label>

      {edit && (
        <form className="tw-card tw-card-gold tw-stack" onSubmit={save}>
          <div className="tw-grid tw-grid-2">
            <input className="tw-input" placeholder="Título (ex.: 1º lugar Artist Challenge)" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} required />
            <input className="tw-input" placeholder="O que ganha (ex.: O Kit dos Mestres)" value={edit.description || ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
          </div>
          <div className="tw-row" style={{ flexWrap: 'wrap' }}>
            <select className="tw-input" style={{ width: 'auto' }} value={edit.rule} onChange={e => setEdit({ ...edit, rule: e.target.value })}>{Object.entries(RULES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            {edit.rule !== 'manual' && <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.85rem' }}>Posição <input className="tw-input" type="number" min="1" style={{ width: 70 }} value={edit.rank} onChange={e => setEdit({ ...edit, rank: e.target.value })} /></label>}
            <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.85rem' }}>Ordem <input className="tw-input" type="number" style={{ width: 70 }} value={edit.position} onChange={e => setEdit({ ...edit, position: e.target.value })} /></label>
          </div>
          <div className="tw-row"><button className="tw-btn tw-btn-sm tw-btn-primary"><Save size={14} /> Salvar</button><button type="button" className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setEdit(null)}>Cancelar</button></div>
        </form>
      )}

      {rows.length === 0 && <div className="tw-empty">Nenhum prêmio cadastrado.</div>}
      {rows.map(a => (
        <div key={a.id} className="tw-card tw-stack">
          <div className="tw-between" style={{ flexWrap: 'wrap' }}>
            <div>
              <h3 className="tw-h3"><Trophy size={16} color="var(--tw-gold)" style={{ verticalAlign: -2 }} /> {a.title}</h3>
              <div className="tw-p" style={{ fontSize: '0.8rem' }}>{a.description} · {RULES[a.rule]}{a.rule !== 'manual' ? ` · ${a.rank}º` : ''}</div>
            </div>
            <div className="tw-row">
              <span className={`tw-chip ${a.status === 'delivered' ? 'tw-chip-ok' : a.status === 'awarded' ? 'tw-chip-gold' : ''}`}>{a.status === 'delivered' ? 'Entregue' : a.status === 'awarded' ? 'Vencedor confirmado' : 'Em aberto'}</span>
              <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setEdit({ ...a })}>Editar</button>
              <button className="tw-icon-btn" onClick={() => remove(a)} title="Excluir"><Trash2 size={13} /></button>
            </div>
          </div>
          <div className="tw-row" style={{ flexWrap: 'wrap' }}>
            <select className="tw-input" style={{ width: 'auto', minWidth: 220 }} value={a.participant_id || ''} disabled={a.status !== 'open'} onChange={e => update(a, { participant_id: e.target.value || null })}>
              <option value="">— escolher vencedor —</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.name} {p.instagram || ''}</option>)}
            </select>
            {a.participant && <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => onOpenParticipant(a.participant.id)}>Ficha</button>}
            {a.status === 'open' && a.participant_id && <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => update(a, { status: 'awarded', redeem_code: a.redeem_code || code() })}><Trophy size={14} /> Confirmar vencedor</button>}
            {a.status === 'awarded' && <button className="tw-btn tw-btn-sm tw-btn-ok" onClick={() => update(a, { status: 'delivered', delivered_at: new Date().toISOString() })}><PackageCheck size={14} /> Marcar entregue</button>}
            {a.status !== 'open' && <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => update(a, { status: 'open', delivered_at: null })}>Reabrir</button>}
          </div>
          {a.redeem_code && a.status !== 'open' && (
            <div className="tw-notice">Código de resgate: <b style={{ fontSize: '1.1rem', letterSpacing: 2 }}>{a.redeem_code}</b> · {a.participant?.phone} {a.participant?.email}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Avisos ---

export function Announcements({ campaign }) {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ message: '', level: 'info', link: '', hours: 2 });

  const load = useCallback(async () => {
    const { data } = await supabase.from('tw_announcements').select('*').eq('campaign_id', campaign.id).order('created_at', { ascending: false });
    setRows(data || []);
  }, [campaign.id]);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    const now = new Date();
    const { error } = await supabase.from('tw_announcements').insert([{
      campaign_id: campaign.id, message: f.message, level: f.level, link: f.link || null,
      starts_at: now.toISOString(), ends_at: Number(f.hours) > 0 ? new Date(now.getTime() + Number(f.hours) * 3600000).toISOString() : null,
    }]);
    if (error) { alert(error.message); return; }
    setF({ ...f, message: '', link: '' });
    load();
  };

  const toggle = async (a) => { await supabase.from('tw_announcements').update({ active: !a.active }).eq('id', a.id); load(); };
  const remove = async (a) => { await supabase.from('tw_announcements').delete().eq('id', a.id); load(); };
  const live = (a) => a.active && (!a.ends_at || new Date(a.ends_at) > new Date());

  return (
    <div className="tw-stack" style={{ maxWidth: 760 }}>
      <h1 className="tw-h2">Avisos</h1>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>Aparecem no topo de todas as páginas da campanha em até 1 minuto. Ex.: “Show do Matuê começa em 30 min no palco principal”, “Missão relâmpago no stand da Bronc!”.</p>
      <form className="tw-card tw-stack" onSubmit={create}>
        <textarea className="tw-input" placeholder="Mensagem" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required />
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <select className="tw-input" style={{ width: 'auto' }} value={f.level} onChange={e => setF({ ...f, level: e.target.value })}><option value="info">Normal (dourado)</option><option value="urgent">Urgente (vermelho)</option></select>
          <input className="tw-input" style={{ flex: 1, minWidth: 180 }} placeholder="Link opcional (ex.: /tattooweek/artist)" value={f.link} onChange={e => setF({ ...f, link: e.target.value })} />
          <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.85rem' }}>Duração (h, 0 = sem fim) <input className="tw-input" type="number" min="0" style={{ width: 70 }} value={f.hours} onChange={e => setF({ ...f, hours: e.target.value })} /></label>
          <button className="tw-btn tw-btn-sm tw-btn-primary"><Megaphone size={14} /> Publicar</button>
        </div>
      </form>
      {rows.map(a => (
        <div key={a.id} className={`tw-notice-bar ${a.level === 'urgent' ? 'urgent' : ''}`} style={{ opacity: live(a) ? 1 : 0.5 }}>
          <span style={{ flex: 1 }}>{a.message}<br /><small className="tw-p">{new Date(a.created_at).toLocaleString('pt-BR')}{a.ends_at ? ` → ${new Date(a.ends_at).toLocaleString('pt-BR')}` : ''} · {live(a) ? 'no ar' : 'fora do ar'}</small></span>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => toggle(a)}>{a.active ? 'Tirar do ar' : 'Reativar'}</button>
          <button className="tw-icon-btn" onClick={() => remove(a)} title="Excluir"><Trash2 size={13} /></button>
        </div>
      ))}
    </div>
  );
}

// --- Equipe ---

export function Staff() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ email: '', name: '', role: 'moderator' });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('tw_staff').select('*').order('created_at');
    if (error) setMsg('Rode o tattooweek_fase4_admin.sql no Supabase para ativar a equipe.');
    setRows(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('tw_staff').upsert({ ...f, email: f.email.trim().toLowerCase() });
    if (error) { setMsg(error.message); return; }
    setF({ email: '', name: '', role: 'moderator' });
    load();
  };

  const setRole = async (r, role) => { await supabase.from('tw_staff').update({ role }).eq('email', r.email); load(); };
  const remove = async (r) => {
    if (!confirm(`Remover o acesso de ${r.email}?`)) return;
    await supabase.from('tw_staff').delete().eq('email', r.email);
    load();
  };

  return (
    <div className="tw-stack" style={{ maxWidth: 760 }}>
      <h1 className="tw-h2">Equipe</h1>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>
        <b>Moderador:</b> ao vivo, moderação, galeria e participantes (para quem valida missões no evento). <b>Admin:</b> tudo, incluindo campanhas, parceiros, premiação e equipe.
        A pessoa entra com o mesmo e-mail cadastrado aqui.
      </p>
      {msg && <div className="tw-notice">{msg}</div>}
      <form className="tw-card tw-row" style={{ flexWrap: 'wrap' }} onSubmit={add}>
        <input className="tw-input" style={{ flex: '2 1 200px' }} type="email" placeholder="e-mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required />
        <input className="tw-input" style={{ flex: '1 1 140px' }} placeholder="Nome" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
        <select className="tw-input" style={{ width: 'auto' }} value={f.role} onChange={e => setF({ ...f, role: e.target.value })}><option value="moderator">Moderador</option><option value="admin">Admin</option></select>
        <button className="tw-btn tw-btn-sm tw-btn-primary"><UserPlus size={14} /> Adicionar</button>
      </form>
      <div className="tw-table-wrap">
        <table className="tw-table">
          <tbody>
            {rows.map(r => (
              <tr key={r.email}>
                <td><b>{r.name || '—'}</b><div className="tw-p" style={{ fontSize: '0.78rem' }}>{r.email}</div></td>
                <td><select className="tw-input" value={r.role} onChange={e => setRole(r, e.target.value)}><option value="moderator">Moderador</option><option value="admin">Admin</option></select></td>
                <td style={{ textAlign: 'right' }}><button className="tw-icon-btn" onClick={() => remove(r)} title="Remover"><Trash2 size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

