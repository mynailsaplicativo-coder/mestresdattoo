import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { QRCodeSVG } from 'qrcode.react';
import { LayoutDashboard, ShieldCheck, ListChecks, Nfc, Users, Settings, Check, X, Zap, Download, Printer, Plus, Save, Film, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { isAdmin, loadConfig, saveConfig, CATEGORY_LABELS, PARTNERS, DAY_NAMES } from './twData';
import './tattooweek.css';

const TABS = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'review', label: 'Moderação', icon: ShieldCheck },
  { id: 'missions', label: 'Missões', icon: ListChecks },
  { id: 'artists', label: 'Credenciais NFC', icon: Nfc },
  { id: 'people', label: 'Participantes', icon: Users },
  { id: 'config', label: 'Configuração', icon: Settings },
];

export default function TwAdmin() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const [tab, setTab] = useState('overview');

  if (!isLoaded) return <div className="tw"><div className="tw-center-screen">Carregando...</div></div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (!isAdmin(user)) {
    return (
      <div className="tw"><div className="tw-center-screen"><div>
        <h2 className="tw-h2">Acesso negado</h2>
        <p className="tw-p">Apenas administradores do Mestres da Tattoo.</p>
        <button className="tw-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/tattooweek')}>Voltar</button>
      </div></div></div>
    );
  }

  return (
    <div className="tw" style={{ paddingBottom: 0 }}>
      <div className="tw-admin">
        <nav className="tw-admin-nav">
          <button onClick={() => navigate('/tattooweek')}><ArrowLeft size={16} /> Site da campanha</button>
          {TABS.map(t => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}><t.icon size={16} /> {t.label}</button>
          ))}
        </nav>
        <main className="tw-admin-main">
          {tab === 'overview' && <Overview />}
          {tab === 'review' && <Review />}
          {tab === 'missions' && <Missions />}
          {tab === 'artists' && <Artists />}
          {tab === 'people' && <People />}
          {tab === 'config' && <Config />}
        </main>
      </div>
    </div>
  );
}

// --- Visão geral: indicadores para o relatório dos parceiros ---

function Overview() {
  const [d, setD] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, s, e, m, a] = await Promise.all([
        supabase.from('tw_participants').select('id, in_public, in_challenge'),
        supabase.from('tw_submissions').select('id, status, mission_id, media, participant_id'),
        supabase.from('tw_events').select('type, ref, participant_id'),
        supabase.from('tw_missions').select('id, partner, track'),
        supabase.from('tw_artists').select('slug, name'),
      ]);
      setD({ p: p.data || [], s: s.data || [], e: e.data || [], m: m.data || [], a: a.data || [] });
    })();
  }, []);

  if (!d) return <p className="tw-p">Carregando indicadores...</p>;

  const missionById = Object.fromEntries(d.m.map(m => [m.id, m]));
  const approved = d.s.filter(s => s.status === 'approved');
  const media = d.s.reduce((a, s) => a + (s.media?.length || 0), 0);
  const scans = d.e.filter(e => e.type === 'nfc_scan' || e.type === 'qr_scan');
  const count = (type, ref) => d.e.filter(e => e.type === type && (ref === undefined || e.ref === ref)).length;
  const partnerDone = (k) => approved.filter(s => missionById[s.mission_id]?.partner === k).length;
  const scansBy = d.a.map(a => ({ name: a.name, n: scans.filter(e => e.ref === a.slug).length })).sort((x, y) => y.n - x.n);
  const maxScan = Math.max(1, ...scansBy.map(x => x.n));

  const kpis = [
    ['Participantes', d.p.length],
    ['No público', d.p.filter(p => p.in_public).length],
    ['No Artist Challenge', d.p.filter(p => p.in_challenge).length],
    ['Missões iniciadas', new Set(d.s.map(s => `${s.participant_id}:${s.mission_id}`)).size],
    ['Missões concluídas', approved.length],
    ['Pendentes', d.s.filter(s => s.status === 'pending').length],
    ['Fotos e vídeos', media],
    ['Leituras NFC', count('nfc_scan')],
    ['Leituras QR', count('qr_scan')],
    ['Vídeos gerados', count('video_generated')],
    ['Vídeos compartilhados', count('video_shared')],
    ['Cliques STENCILFLOW', count('partner_click', 'stencilflow')],
  ];

  return (
    <div className="tw-stack">
      <h1 className="tw-h2">Visão geral</h1>
      <div className="tw-grid tw-grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
        {kpis.map(([label, v]) => <div key={label} className="tw-card tw-kpi"><b>{v}</b><span>{label}</span></div>)}
      </div>

      <div className="tw-grid tw-grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="tw-card tw-stack">
          <h3 className="tw-h3">Resultado por parceiro</h3>
          {['bronc', 'stencilflow', 'inkauthority'].map(k => (
            <div key={k} className="tw-between" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: PARTNERS[k].color, fontWeight: 800 }}>{PARTNERS[k].name}</span>
              <span className="tw-p">{partnerDone(k)} desafios concluídos · {count('partner_click', k)} cliques</span>
            </div>
          ))}
        </div>
        <div className="tw-card tw-stack">
          <h3 className="tw-h3">Leituras por credencial</h3>
          {scansBy.slice(0, 10).map(x => (
            <div key={x.name} className="tw-bar">
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.name}</span>
              <div className="tw-bar-track"><div style={{ width: `${(x.n / maxScan) * 100}%` }} /></div>
              <span className="tw-p" style={{ textAlign: 'right' }}>{x.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Moderação ---

function Review() {
  const [status, setStatus] = useState('pending');
  const [track, setTrack] = useState('all');
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from('tw_submissions')
      .select('*, mission:tw_missions(*), participant:tw_participants(name, instagram, phone), artist:tw_artists(name)')
      .eq('status', status).order('created_at', { ascending: status === 'pending' }).limit(100);
    setRows(data || []);
  }, [status]);

  useEffect(() => { setRows(null); load(); }, [load]);

  const decide = async (row, ok, pts) => {
    const reviewer_note = ok ? null : (prompt('Motivo (opcional, o participante pode reenviar):') || null);
    await supabase.from('tw_submissions').update({
      status: ok ? 'approved' : 'rejected',
      points: ok ? Number(pts ?? row.mission?.points ?? 0) : 0,
      reviewer_note,
      reviewed_at: new Date().toISOString(),
    }).eq('id', row.id);
    setRows(r => r.filter(x => x.id !== row.id));
  };

  const list = (rows || []).filter(r => track === 'all' || r.mission?.track === track);

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Moderação</h1>
        <div className="tw-row">
          <select className="tw-input" style={{ width: 'auto' }} value={track} onChange={e => setTrack(e.target.value)}>
            <option value="all">Todas</option><option value="artist">Artist Challenge</option><option value="public">Público</option>
          </select>
          <select className="tw-input" style={{ width: 'auto' }} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="pending">Pendentes</option><option value="approved">Aprovadas</option><option value="rejected">Recusadas</option>
          </select>
        </div>
      </div>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>Missões do público entram aprovadas automaticamente — use “Aprovadas” para retirar conteúdo impróprio. As do Artist Challenge esperam sua validação.</p>
      {rows === null && <p className="tw-p">Carregando...</p>}
      {rows && list.length === 0 && <div className="tw-empty">Nada aqui. 🎉</div>}
      {list.map(r => <ReviewCard key={r.id} row={r} onDecide={decide} />)}
    </div>
  );
}

function ReviewCard({ row, onDecide }) {
  const [pts, setPts] = useState(row.status === 'approved' ? row.points : row.mission?.points);
  return (
    <div className="tw-card tw-stack">
      <div className="tw-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <div className="tw-row" style={{ gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span className="tw-chip tw-chip-gold">{row.mission?.track === 'artist' ? 'Challenge' : `Público · Dia ${row.mission?.day ?? '-'}`}</span>
            {row.mission?.category && row.mission.category !== 'dia' && <span className="tw-chip">{CATEGORY_LABELS[row.mission.category]}</span>}
          </div>
          <h3 className="tw-h3">{row.mission?.title}</h3>
          <p className="tw-p" style={{ fontSize: '0.85rem' }}>
            <b style={{ color: '#fff' }}>{row.participant?.name}</b> {row.participant?.instagram} · {new Date(row.created_at).toLocaleString('pt-BR')}
            {row.artist && <> · com <b style={{ color: '#fff' }}>{row.artist.name}</b></>}
          </p>
          {row.note && <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>“{row.note}”</p>}
          {row.reviewer_note && <p className="tw-p" style={{ fontSize: '0.8rem' }}>Motivo: {row.reviewer_note}</p>}
        </div>
      </div>
      <div className="tw-thumbs">
        {(row.media || []).map(m => (
          <a key={m.url} href={m.url} target="_blank" rel="noreferrer">
            {m.type === 'video' ? <video src={m.url} muted playsInline preload="metadata" /> : <img src={m.url} alt="" loading="lazy" />}
          </a>
        ))}
      </div>
      <div className="tw-row" style={{ flexWrap: 'wrap' }}>
        <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.8rem' }}>Pontos
          <input className="tw-input" type="number" style={{ width: 80, minHeight: 34, padding: '0.3rem 0.5rem' }} value={pts ?? 0} onChange={e => setPts(e.target.value)} />
        </label>
        {row.status !== 'approved' && <button className="tw-btn tw-btn-sm tw-btn-ok" onClick={() => onDecide(row, true, pts)}><Check size={14} /> Aprovar</button>}
        {row.status === 'approved' && <button className="tw-btn tw-btn-sm tw-btn-ok" onClick={() => onDecide(row, true, pts)}><Save size={14} /> Salvar pontos</button>}
        {row.status !== 'rejected' && <button className="tw-btn tw-btn-sm tw-btn-bad" onClick={() => onDecide(row, false)}><X size={14} /> Recusar</button>}
      </div>
    </div>
  );
}

// --- Missões ---

const EMPTY_MISSION = { track: 'artist', day: '', category: 'networking', partner: '', title: '', description: '', points: 20, media_count: 1, approval: 'manual', hidden: false, active: true };

function Missions() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [surprise, setSurprise] = useState({ track: 'artist', title: '', description: '', points: 30, minutes: 20, media_count: 1 });

  const load = useCallback(async () => {
    const { data } = await supabase.from('tw_missions').select('*').order('track').order('day').order('position');
    setRows(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    const row = { ...edit, day: edit.day ? Number(edit.day) : null, partner: edit.partner || null, points: Number(edit.points), media_count: Number(edit.media_count) };
    const { error } = row.id
      ? await supabase.from('tw_missions').update(row).eq('id', row.id)
      : await supabase.from('tw_missions').insert([row]);
    if (error) { alert(error.message); return; }
    setEdit(null);
    load();
  };

  const launch = async (e) => {
    e.preventDefault();
    const now = new Date();
    const { error } = await supabase.from('tw_missions').insert([{
      track: surprise.track,
      category: 'surpresa',
      title: surprise.title,
      description: surprise.description || null,
      points: Number(surprise.points),
      media_count: Number(surprise.media_count),
      approval: surprise.track === 'public' ? 'auto' : 'manual',
      starts_at: now.toISOString(),
      ends_at: new Date(now.getTime() + Number(surprise.minutes) * 60000).toISOString(),
      position: 0,
    }]);
    if (error) { alert(error.message); return; }
    setSurprise(s => ({ ...s, title: '', description: '' }));
    load();
  };

  const toggle = async (m) => {
    await supabase.from('tw_missions').update({ active: !m.active }).eq('id', m.id);
    load();
  };

  const groups = [
    ['Surpresas', rows.filter(m => m.category === 'surpresa')],
    ...[1, 2, 3].map(d => [`Público · Dia ${d} — ${DAY_NAMES[d]}`, rows.filter(m => m.track === 'public' && m.category === 'dia' && m.day === d)]),
    ['Artist Challenge', rows.filter(m => m.track === 'artist' && m.category !== 'surpresa')],
  ];

  return (
    <div className="tw-stack">
      <div className="tw-between"><h1 className="tw-h2">Missões</h1><button className="tw-btn tw-btn-sm" onClick={() => setEdit({ ...EMPTY_MISSION })}><Plus size={14} /> Nova missão</button></div>

      <form className="tw-surprise tw-stack" style={{ animation: 'none' }} onSubmit={launch}>
        <span className="tw-kicker" style={{ color: '#fca5a5' }}><Zap size={12} /> Lançar missão surpresa agora</span>
        <div className="tw-grid tw-grid-2">
          <input className="tw-input" placeholder="Você tem 20 minutos para encontrar um artista de outro país" value={surprise.title} onChange={e => setSurprise({ ...surprise, title: e.target.value })} required />
          <input className="tw-input" placeholder="Detalhes (opcional)" value={surprise.description} onChange={e => setSurprise({ ...surprise, description: e.target.value })} />
        </div>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <select className="tw-input" style={{ width: 'auto' }} value={surprise.track} onChange={e => setSurprise({ ...surprise, track: e.target.value })}>
            <option value="artist">Tatuadores</option><option value="public">Público</option>
          </select>
          <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.8rem' }}>Minutos <input className="tw-input" type="number" style={{ width: 80 }} value={surprise.minutes} onChange={e => setSurprise({ ...surprise, minutes: e.target.value })} /></label>
          <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.8rem' }}>Pontos <input className="tw-input" type="number" style={{ width: 80 }} value={surprise.points} onChange={e => setSurprise({ ...surprise, points: e.target.value })} /></label>
          <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.8rem' }}>Registros <input className="tw-input" type="number" min="1" max="3" style={{ width: 70 }} value={surprise.media_count} onChange={e => setSurprise({ ...surprise, media_count: e.target.value })} /></label>
          <button className="tw-btn tw-btn-primary tw-btn-sm"><Zap size={14} /> Lançar</button>
        </div>
        <p className="tw-p" style={{ fontSize: '0.78rem' }}>Aparece no painel dos participantes em até 1 minuto, com contagem regressiva.</p>
      </form>

      {edit && (
        <form className="tw-card tw-card-gold tw-stack" onSubmit={save}>
          <h3 className="tw-h3">{edit.id ? 'Editar missão' : 'Nova missão'}</h3>
          <input className="tw-input" placeholder="Título" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} required />
          <textarea className="tw-input" placeholder="Descrição / instruções" value={edit.description || ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
          <div className="tw-grid tw-grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            <label className="tw-field"><span>Trilha</span><select className="tw-input" value={edit.track} onChange={e => setEdit({ ...edit, track: e.target.value })}><option value="public">Público</option><option value="artist">Artist Challenge</option></select></label>
            <label className="tw-field"><span>Categoria</span><select className="tw-input" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })}>{Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className="tw-field"><span>Dia</span><select className="tw-input" value={edit.day ?? ''} onChange={e => setEdit({ ...edit, day: e.target.value })}><option value="">—</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>
            <label className="tw-field"><span>Parceiro</span><select className="tw-input" value={edit.partner || ''} onChange={e => setEdit({ ...edit, partner: e.target.value })}><option value="">—</option>{Object.entries(PARTNERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></label>
            <label className="tw-field"><span>Pontos</span><input className="tw-input" type="number" value={edit.points} onChange={e => setEdit({ ...edit, points: e.target.value })} /></label>
            <label className="tw-field"><span>Registros</span><input className="tw-input" type="number" min="1" max="3" value={edit.media_count} onChange={e => setEdit({ ...edit, media_count: e.target.value })} /></label>
            <label className="tw-field"><span>Aprovação</span><select className="tw-input" value={edit.approval} onChange={e => setEdit({ ...edit, approval: e.target.value })}><option value="auto">Automática</option><option value="manual">Manual</option></select></label>
            <label className="tw-field"><span>Posição</span><input className="tw-input" type="number" value={edit.position ?? 0} onChange={e => setEdit({ ...edit, position: Number(e.target.value) })} /></label>
          </div>
          <label className="tw-check"><input type="checkbox" checked={!!edit.hidden} onChange={e => setEdit({ ...edit, hidden: e.target.checked })} /><span>Secreta: só aparece para quem ler a credencial que a revela (configure em Credenciais NFC).</span></label>
          <div className="tw-row"><button className="tw-btn tw-btn-primary tw-btn-sm"><Save size={14} /> Salvar</button><button type="button" className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setEdit(null)}>Cancelar</button></div>
        </form>
      )}

      {groups.map(([title, list]) => list.length > 0 && (
        <section key={title} className="tw-stack" style={{ marginTop: '1rem' }}>
          <h3 className="tw-kicker">{title}</h3>
          <div className="tw-table-wrap">
            <table className="tw-table">
              <tbody>
                {list.map(m => (
                  <tr key={m.id} style={{ opacity: m.active ? 1 : 0.45 }}>
                    <td style={{ width: '50%' }}>
                      <b>{m.title}</b>
                      <div className="tw-row" style={{ gap: '0.3rem', marginTop: 4, flexWrap: 'wrap' }}>
                        {m.partner && <span className="tw-chip" style={{ color: PARTNERS[m.partner]?.color }}>{PARTNERS[m.partner]?.name}</span>}
                        {m.hidden && <span className="tw-chip tw-chip-gold">Secreta</span>}
                        {m.ends_at && <span className="tw-chip tw-chip-bad">até {new Date(m.ends_at).toLocaleString('pt-BR', { day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                    </td>
                    <td>{m.points} pts</td>
                    <td>{m.media_count}×</td>
                    <td>{m.approval === 'auto' ? 'Auto' : 'Manual'}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setEdit({ ...m })}>Editar</button>{' '}
                      <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => toggle(m)}>{m.active ? 'Desativar' : 'Ativar'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

// --- Credenciais NFC ---

function Artists() {
  const [rows, setRows] = useState([]);
  const [missions, setMissions] = useState([]);
  const [saving, setSaving] = useState(null);
  const [print, setPrint] = useState(false);
  const base = window.location.origin;

  const load = useCallback(async () => {
    const [a, m] = await Promise.all([
      supabase.from('tw_artists').select('*').order('slug'),
      supabase.from('tw_missions').select('id, title').eq('hidden', true),
    ]);
    setRows(a.data || []);
    setMissions(m.data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (id, patch) => setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (r) => {
    setSaving(r.id);
    const { id, created_at, ...patch } = r;
    void created_at;
    await supabase.from('tw_artists').update({ ...patch, reveals_mission_id: patch.reveals_mission_id || null }).eq('id', id);
    setSaving(null);
  };

  const uploadPhoto = async (r, file) => {
    const path = `artists/${r.slug}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('tattooweek').upload(path, file, { contentType: file.type });
    if (error) { alert(error.message); return; }
    const url = supabase.storage.from('tattooweek').getPublicUrl(path).data.publicUrl;
    set(r.id, { photo_url: url });
    await supabase.from('tw_artists').update({ photo_url: url }).eq('id', r.id);
  };

  if (print) {
    return (
      <div className="tw-stack">
        <div className="tw-row tw-noprint">
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setPrint(false)}><ArrowLeft size={14} /> Voltar</button>
          <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
        </div>
        <p className="tw-p tw-noprint" style={{ fontSize: '0.85rem' }}>QR Code alternativo para quem não tem NFC. Grave no adesivo NFC a URL sem o “?src=qr”.</p>
        <div className="tw-badges">
          {rows.map(r => (
            <div key={r.id} className="tw-badge">
              <img src="/fotos artistas/logo mestres.png" alt="" style={{ height: 28, filter: 'invert(1)' }} />
              <h4>{r.name}</h4>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a07800', marginBottom: 8 }}>TATTOO WEEK EXPERIENCE</div>
              <QRCodeSVG value={`${base}/tattooweek/nfc/${r.slug}?src=qr`} size={140} />
              <small>{base}/tattooweek/nfc/{r.slug}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Credenciais NFC</h1>
        <button className="tw-btn tw-btn-sm" onClick={() => setPrint(true)}><Printer size={14} /> Credenciais com QR para imprimir</button>
      </div>
      <div className="tw-notice">
        Grave em cada adesivo NFC a URL da credencial (ex.: <b>{base}/tattooweek/nfc/artista-01</b>) com um app como “NFC Tools”, tipo de registro <b>URL</b>. A leitura abre a página do artista, registra a interação e pede a foto para o carimbo — não conta pontos sozinha.
      </div>
      {rows.map(r => (
        <div key={r.id} className="tw-card tw-stack">
          <div className="tw-between" style={{ flexWrap: 'wrap' }}>
            <div className="tw-row">
              <label style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#1a1a1a', cursor: 'pointer', flex: '0 0 56px', display: 'grid', placeItems: 'center' }} title="Trocar foto">
                {r.photo_url ? <img src={r.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Plus size={18} color="#888" />}
                <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && uploadPhoto(r, e.target.files[0])} />
              </label>
              <div>
                <span className="tw-chip tw-chip-gold">{r.slug}</span>
                <div style={{ fontSize: '0.75rem', marginTop: 4 }}><a href={`/tattooweek/nfc/${r.slug}`} target="_blank" rel="noreferrer" className="tw-gold">{base}/tattooweek/nfc/{r.slug}</a></div>
              </div>
            </div>
            <div style={{ background: '#fff', padding: 6, borderRadius: 8 }}><QRCodeSVG value={`${base}/tattooweek/nfc/${r.slug}?src=qr`} size={64} /></div>
          </div>
          <div className="tw-grid tw-grid-3">
            <input className="tw-input" placeholder="Nome" value={r.name || ''} onChange={e => set(r.id, { name: e.target.value })} />
            <input className="tw-input" placeholder="@instagram" value={r.instagram || ''} onChange={e => set(r.id, { instagram: e.target.value })} />
            <input className="tw-input" placeholder="Estilos (ex.: Realismo, Old School)" value={r.styles || ''} onChange={e => set(r.id, { styles: e.target.value })} />
            <input className="tw-input" placeholder="Cidade / Estado" value={r.city || ''} onChange={e => set(r.id, { city: e.target.value })} />
            <input className="tw-input" placeholder="País" value={r.country || ''} onChange={e => set(r.id, { country: e.target.value })} />
            <select className="tw-input" value={r.reveals_mission_id || ''} onChange={e => set(r.id, { reveals_mission_id: e.target.value })}>
              <option value="">Não revela missão secreta</option>
              {missions.map(m => <option key={m.id} value={m.id}>Revela: {m.title}</option>)}
            </select>
          </div>
          <textarea className="tw-input" placeholder="Apresentação rápida" value={r.bio || ''} onChange={e => set(r.id, { bio: e.target.value })} />
          <input className="tw-input" placeholder="Missão relacionada a este artista (ex.: Peça para ele contar como começou a tatuar)" value={r.mission_text || ''} onChange={e => set(r.id, { mission_text: e.target.value })} />
          <div className="tw-row">
            <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => save(r)} disabled={saving === r.id}><Save size={14} /> {saving === r.id ? 'Salvando...' : 'Salvar'}</button>
            <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><input type="checkbox" checked={r.active} onChange={e => set(r.id, { active: e.target.checked })} /> Ativa</label>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Participantes + exportação ---

function toCsv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(';'), ...rows.map(r => cols.map(c => esc(r[c])).join(';'))].join('\n');
}

function download(name, text) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

function People() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const [p, r] = await Promise.all([
        supabase.from('tw_participants').select('*').order('created_at', { ascending: false }),
        supabase.from('tw_ranking').select('participant_id, track, points, missions_done'),
      ]);
      const pts = {};
      (r.data || []).forEach(x => { pts[`${x.participant_id}:${x.track}`] = x; });
      setRows((p.data || []).map(x => ({
        ...x,
        public_points: pts[`${x.id}:public`]?.points || 0,
        artist_points: pts[`${x.id}:artist`]?.points || 0,
      })));
    })();
  }, []);

  if (!rows) return <p className="tw-p">Carregando...</p>;

  const list = rows.filter(r => !q || `${r.name} ${r.email} ${r.instagram} ${r.phone}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => download('tattooweek-participantes.csv', toCsv(rows.map(r => ({
    nome: r.name, email: r.email, telefone: r.phone, instagram: r.instagram, cidade: r.city,
    publico: r.in_public ? 'sim' : 'não', artist_challenge: r.in_challenge ? 'sim' : 'não',
    pontos_publico: r.public_points, pontos_challenge: r.artist_points,
    ranking_publico: r.show_in_ranking ? 'sim' : 'não', autoriza_divulgacao: r.consent_marketing ? 'sim' : 'não',
    cadastro: new Date(r.created_at).toLocaleString('pt-BR'),
  }))));

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Participantes ({rows.length})</h1>
        <button className="tw-btn tw-btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <input className="tw-input" placeholder="Buscar por nome, e-mail, @, telefone" value={q} onChange={e => setQ(e.target.value)} />
      <div className="tw-table-wrap">
        <table className="tw-table">
          <thead><tr><th>Nome</th><th>Contato</th><th>Trilhas</th><th>Pts público</th><th>Pts challenge</th><th>Divulgação</th><th></th></tr></thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id}>
                <td><b>{r.name}</b><div className="tw-p" style={{ fontSize: '0.75rem' }}>{r.instagram} {r.city}</div></td>
                <td style={{ fontSize: '0.78rem' }}>{r.email}<br />{r.phone}</td>
                <td>{r.in_public && <span className="tw-chip">Público</span>} {r.in_challenge && <span className="tw-chip tw-chip-gold">Challenge</span>}</td>
                <td>{r.public_points}</td>
                <td>{r.artist_points}</td>
                <td>{r.consent_marketing ? <span className="tw-chip tw-chip-ok">Sim</span> : <span className="tw-chip">Não</span>}</td>
                <td><button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate(`/tattooweek/retrospectiva?p=${r.id}`)} title="Ver retrospectiva"><Film size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Configuração ---

function Config() {
  const [cfg, setCfg] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadConfig().then(setCfg); }, []);
  if (!cfg) return <p className="tw-p">Carregando...</p>;

  const save = async () => {
    await Promise.all([
      saveConfig('event_days', cfg.event_days),
      saveConfig('unlock_all', cfg.unlock_all),
      saveConfig('music_url', cfg.music_url || ''),
    ]);
    setMsg('Salvo!');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="tw-stack" style={{ maxWidth: 640 }}>
      <h1 className="tw-h2">Configuração</h1>
      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Datas do evento</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>As missões de cada dia são liberadas à meia-noite da data.</p>
        <div className="tw-grid tw-grid-3">
          {[0, 1, 2].map(i => (
            <label key={i} className="tw-field"><span>Dia {i + 1}</span>
              <input className="tw-input" type="date" value={cfg.event_days[i] || ''} onChange={e => { const d = [...cfg.event_days]; d[i] = e.target.value; setCfg({ ...cfg, event_days: d }); }} />
            </label>
          ))}
        </div>
        <label className="tw-check"><input type="checkbox" checked={!!cfg.unlock_all} onChange={e => setCfg({ ...cfg, unlock_all: e.target.checked })} /><span>Liberar os 3 dias agora (use para testes antes do evento — desligue depois).</span></label>
      </div>
      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Trilha do vídeo</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>URL de um MP3 com licença para uso (suba no Storage do Supabase, bucket “tattooweek”). Vazio = vídeo sem música.</p>
        <input className="tw-input" placeholder="https://...mp3" value={cfg.music_url || ''} onChange={e => setCfg({ ...cfg, music_url: e.target.value })} />
      </div>
      <div className="tw-row"><button className="tw-btn tw-btn-primary" onClick={save}><Save size={16} /> Salvar</button><span className="tw-gold">{msg}</span></div>
    </div>
  );
}
