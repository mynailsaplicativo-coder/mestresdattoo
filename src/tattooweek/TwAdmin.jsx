import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  LayoutDashboard, ShieldCheck, ListChecks, Nfc, Users, Settings, Check, X, Zap, Download, Printer, Plus, Save, Film,
  ArrowLeft, FileText, Handshake, ExternalLink, Copy, Activity, Images, Trophy, Megaphone, UserCog, Trash2, CopyPlus,
  GripVertical, ArrowUp, ArrowDown,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useStaffRole, loadPartners, campaignBase, formatDays, dayName, uploadMedia, downloadBlob, CATEGORY_LABELS, DEFAULT_DAY_NAMES, NFC_KINDS, hashAnswers, SEAL_ICON_KEYS, SEAL_COLORS, campaignTheme, themeStyle, PRESET_THEMES, DEFAULT_THEME, loadArtistDaily, useLiveRefresh, hasGift, PUBLIC_GIFT, giftCode, loadSealSuspects } from './twData';
import { Live, Gallery, ParticipantSheet, Awards, Announcements, Staff } from './AdminExtra';
import { Patch } from './TwArt';
import './tattooweek.css';

// mod: true = moderadores também veem
const TABS = [
  { id: 'live', label: 'Ao vivo', icon: Activity, mod: true },
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'review', label: 'Moderação', icon: ShieldCheck, mod: true },
  { id: 'gallery', label: 'Galeria', icon: Images, mod: true },
  { id: 'people', label: 'Participantes', icon: Users, mod: true },
  { id: 'missions', label: 'Missões', icon: ListChecks },
  { id: 'artists', label: 'Adesivos NFC', icon: Nfc },
  { id: 'awards', label: 'Premiação', icon: Trophy },
  { id: 'notices', label: 'Avisos', icon: Megaphone, mod: true },
  { id: 'report', label: 'Relatório', icon: FileText },
  { id: 'campaign', label: 'Campanha', icon: Settings },
  { id: 'partners', label: 'Parceiros', icon: Handshake },
  { id: 'staff', label: 'Equipe', icon: UserCog },
];

export default function TwAdmin({ initialCampaignId }) {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const role = useStaffRole();
  const [tab, setTab] = useState('live');
  const [campaigns, setCampaigns] = useState(null);
  const [cid, setCid] = useState(initialCampaignId || null);
  const [partners, setPartners] = useState({});
  const [sheet, setSheet] = useState(null);

  const loadAll = useCallback(async () => {
    const [c, p] = await Promise.all([
      supabase.from('tw_campaigns').select('*').order('created_at', { ascending: false }),
      loadPartners(),
    ]);
    setCampaigns(c.data || []);
    setPartners(p);
    setCid(cur => cur || c.data?.find(x => x.status === 'active')?.id || c.data?.[0]?.id || null);
  }, []);

  useEffect(() => { if (role) loadAll(); }, [role, loadAll]);

  if (!isLoaded) return <div className="tw"><div className="tw-center-screen">Carregando...</div></div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (role === undefined) return <div className="tw"><div className="tw-center-screen">Carregando...</div></div>;
  if (!role) {
    return (
      <div className="tw"><div className="tw-center-screen"><div>
        <h2 className="tw-h2">Acesso negado</h2>
        <p className="tw-p">Apenas administradores do Mestres da Tattoo.</p>
        <button className="tw-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/desafios')}>Voltar</button>
      </div></div></div>
    );
  }
  if (!campaigns) return <div className="tw"><div className="tw-center-screen">Carregando...</div></div>;

  const campaign = campaigns.find(c => c.id === cid);
  const isAdminRole = role === 'admin';
  const tabs = TABS.filter(t => isAdminRole || t.mod);
  const current = tabs.some(t => t.id === tab) || (isAdminRole && tab === 'campaign-new') ? tab : 'live';
  const openParticipant = (id) => setSheet(id);
  const ctx = { campaign, partners, reload: loadAll, role, onOpenParticipant: openParticipant };
  const needsCampaign = !['campaign-new', 'partners', 'staff'].includes(current);

  return (
    <div className="tw" style={{ paddingBottom: 0 }}>
      <div className="tw-admin">
        <nav className="tw-admin-nav">
          <button onClick={() => navigate(campaign ? campaignBase(campaign) : '/desafios')}><ArrowLeft size={16} /> Site</button>
          {tabs.map(t => (
            <button key={t.id} className={current === t.id ? 'on' : ''} onClick={() => setTab(t.id)}><t.icon size={16} /> {t.label}</button>
          ))}
        </nav>
        <main className="tw-admin-main">
          <div className="tw-row tw-noprint" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <select className="tw-input" style={{ width: 'auto', minWidth: 240 }} value={cid || ''} onChange={e => setCid(e.target.value)}>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} {c.status === 'draft' ? '(rascunho)' : c.status === 'finished' ? '(encerrada)' : ''}</option>)}
            </select>
            {campaign && <a className="tw-btn tw-btn-sm tw-btn-ghost" href={campaignBase(campaign)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Abrir</a>}
            {isAdminRole && <button className="tw-btn tw-btn-sm" onClick={() => setTab('campaign-new')}><Plus size={14} /> Nova campanha</button>}
            <span className="tw-chip" style={{ marginLeft: 'auto' }}>{isAdminRole ? 'Admin' : 'Moderador'}</span>
          </div>
          {!campaign && needsCampaign && (
            <div className="tw-empty">Nenhuma campanha. Rode o tattooweek_fase2_3.sql no Supabase ou crie uma nova campanha.</div>
          )}
          {campaign && current === 'live' && <Live key={cid} {...ctx} />}
          {campaign && current === 'overview' && <Overview key={cid} {...ctx} />}
          {campaign && current === 'review' && <Review key={cid} {...ctx} />}
          {campaign && current === 'gallery' && <Gallery key={cid} {...ctx} />}
          {campaign && current === 'people' && <People key={cid} {...ctx} />}
          {campaign && current === 'missions' && <Missions key={cid} {...ctx} />}
          {campaign && current === 'artists' && <Artists key={cid} {...ctx} />}
          {campaign && current === 'awards' && <Awards key={cid} {...ctx} />}
          {campaign && current === 'notices' && <Announcements key={cid} {...ctx} />}
          {campaign && current === 'report' && <Report key={cid} {...ctx} />}
          {campaign && current === 'campaign' && <CampaignEditor key={cid} {...ctx} />}
          {current === 'campaign-new' && (
            <CampaignEditor
              key="new" {...ctx} isNew
              onCreated={async (id) => { await loadAll(); setCid(id); setTab('campaign'); }}
            />
          )}
          {current === 'partners' && <Partners {...ctx} />}
          {current === 'staff' && <Staff />}
        </main>
      </div>
      {sheet && campaign && (
        <ParticipantSheet participantId={sheet} campaign={campaign} role={role} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}

// --- Números da campanha (Visão geral e Relatório) ---

async function loadStats(campaign) {
  const cid = campaign.id;
  const [en, s, e, m, a, r] = await Promise.all([
    supabase.from('tw_enrollments').select('participant_id, track, created_at').eq('campaign_id', cid),
    supabase.from('tw_submissions').select('id, status, mission_id, media, participant_id, artist_id, created_at, mission:tw_missions!inner(campaign_id)').eq('mission.campaign_id', cid),
    supabase.from('tw_events').select('type, ref, participant_id, created_at').eq('campaign_id', cid),
    supabase.from('tw_missions').select('*').eq('campaign_id', cid),
    supabase.from('tw_artists').select('id, slug, name').eq('campaign_id', cid),
    supabase.from('tw_ranking').select('*').eq('campaign_id', cid).order('points', { ascending: false }).order('last_at'),
  ]);
  const enroll = en.data || [];
  const subs = s.data || [];
  const events = e.data || [];
  const missions = m.data || [];
  const artists = a.data || [];
  const ranking = r.data || [];
  const missionById = Object.fromEntries(missions.map(x => [x.id, x]));
  const approved = subs.filter(x => x.status === 'approved');
  const count = (type, ref) => events.filter(x => x.type === type && (ref === undefined || x.ref === ref)).length;
  const scans = events.filter(x => x.type === 'nfc_scan' || x.type === 'qr_scan');

  const partnerStats = (campaign.partners || []).filter(p => p !== 'mestres').map(pid => {
    const ms = missions.filter(x => x.partner === pid);
    const done = approved.filter(x => missionById[x.mission_id]?.partner === pid);
    return {
      id: pid,
      missions: ms.map(x => ({ title: x.title, done: done.filter(d => d.mission_id === x.id).length })),
      done: done.length,
      people: new Set(done.map(x => x.participant_id)).size,
      clicks: count('partner_click', pid),
    };
  });

  const days = (campaign.event_days || []).map((d, i) => ({
    label: `Dia ${i + 1}`,
    date: d,
    subs: subs.filter(x => x.created_at.slice(0, 10) === d).length,
    scans: scans.filter(x => x.created_at.slice(0, 10) === d).length,
  }));

  return {
    participants: new Set(enroll.map(x => x.participant_id)).size,
    publicCount: enroll.filter(x => x.track === 'public').length,
    artistCount: enroll.filter(x => x.track === 'artist').length,
    started: new Set(subs.map(x => `${x.participant_id}:${x.mission_id}:${x.artist_id || ''}`)).size,
    approved: approved.length,
    pending: subs.filter(x => x.status === 'pending').length,
    media: subs.reduce((acc, x) => acc + (x.media?.length || 0), 0),
    nfc: count('nfc_scan'),
    qr: count('qr_scan'),
    uniqueConnections: new Set(scans.filter(x => x.participant_id).map(x => `${x.participant_id}:${x.ref}`)).size,
    videos: count('video_generated'),
    videoShares: count('video_shared'),
    resultShares: count('result_shared'),
    partnerStats,
    scansBy: artists.map(x => ({ name: x.name, n: scans.filter(e2 => e2.ref === x.slug).length })).sort((p, q) => q.n - p.n),
    days,
    topPublic: ranking.filter(x => x.track === 'public').slice(0, 10),
    topArtist: ranking.filter(x => x.track === 'artist').slice(0, 10),
  };
}

function kpiList(d) {
  return [
    ['Participantes', d.participants, 'Alcance do desafio'],
    ['No público', d.publicCount, 'Inscrições Meu evento'],
    ['No Artist Challenge', d.artistCount, 'Tatuadores competindo'],
    ['Missões iniciadas', d.started, 'Interesse'],
    ['Missões concluídas', d.approved, 'Engajamento'],
    ['Pendentes', d.pending, 'Aguardando validação'],
    ['Fotos e vídeos', d.media, 'Conteúdo gerado'],
    ['Leituras NFC', d.nfc, 'Interações presenciais'],
    ['Leituras QR', d.qr, 'Interações presenciais'],
    ['Conexões únicas', d.uniqueConnections, 'Networking'],
    ['Vídeos gerados', d.videos, 'Retrospectivas'],
    ['Vídeos compartilhados', d.videoShares, 'Distribuição orgânica'],
    ['Cards compartilhados', d.resultShares, 'Distribuição orgânica'],
  ];
}

function Overview({ campaign, partners }) {
  const [d, setD] = useState(null);
  useEffect(() => { loadStats(campaign).then(setD); }, [campaign]);
  if (!d) return <p className="tw-p">Carregando indicadores...</p>;
  const maxScan = Math.max(1, ...d.scansBy.map(x => x.n));

  return (
    <div className="tw-stack">
      <h1 className="tw-h2">Visão geral</h1>
      <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
        {kpiList(d).map(([label, v]) => <div key={label} className="tw-card tw-kpi"><b>{v}</b><span>{label}</span></div>)}
      </div>
      <KitAndGift campaign={campaign} />
      <div className="tw-grid tw-grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="tw-card tw-stack">
          <h3 className="tw-h3">Resultado por parceiro</h3>
          {d.partnerStats.map(p => (
            <div key={p.id} className="tw-between" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: partners[p.id]?.color, fontWeight: 800 }}>{partners[p.id]?.name || p.id}</span>
              <span className="tw-p">{p.done} desafios · {p.people} pessoas · {p.clicks} cliques</span>
            </div>
          ))}
          {d.partnerStats.length === 0 && <p className="tw-p">Nenhum parceiro nesta campanha.</p>}
        </div>
        <div className="tw-card tw-stack">
          <h3 className="tw-h3">Leituras por adesivo</h3>
          {d.scansBy.slice(0, 10).map(x => (
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


// --- Prêmios ao vivo: impressora do dia (artistas) e chaveiros Bronc (público) ---
function KitAndGift({ campaign }) {
  const [daily, setDaily] = useState(null);
  const [claims, setClaims] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [giftSeal, setGiftSeal] = useState(campaign.gift_seal_slug || '');
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase.from('tw_artists').select('slug, name').eq('campaign_id', campaign.id).eq('kind', 'secret').eq('active', true).order('slug')
      .then(({ data }) => setSecrets(data || []));
  }, [campaign.id]);

  const saveGiftSeal = async (slug) => {
    setGiftSeal(slug);
    const { error } = await supabase.from('tw_campaigns').update({ gift_seal_slug: slug || null }).eq('id', campaign.id);
    if (error) alert(`Não salvou o selo premiado: ${error.message}. Rode o SQL da fase 14.`);
  };

  const load = useCallback(async () => {
    const [d, c] = await Promise.all([
      loadArtistDaily(campaign),
      hasGift(campaign)
        ? supabase.from('tw_events').select('id, created_at, participant:tw_participants(id, name, instagram)').eq('campaign_id', campaign.id).eq('type', 'gift_claim').eq('ref', PUBLIC_GIFT.id).order('created_at', { ascending: false }).limit(500)
        : Promise.resolve({ data: [] }),
    ]);
    setDaily(d);
    setClaims(c.data || []);
    loadSealSuspects(campaign.id).then(setSuspects).catch(() => {});
  }, [campaign]);
  useLiveRefresh(`admin-kit-${campaign.id}`, load, 20000);

  if (!daily) return null;
  const fmt = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const shown = claims.filter(c => !q || `${c.participant?.name} ${c.participant?.instagram} ${giftCode(c.participant?.id)}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
    {suspects.length > 0 && (
      <div className="tw-card tw-stack" style={{ marginTop: '1.25rem', borderColor: '#ef4444' }}>
        <h3 className="tw-h3">⚠ Selos suspeitos ({suspects.length})</h3>
        <p className="tw-p" style={{ fontSize: '0.8rem' }}>Pegaram 3 ou mais selos secretos em menos de 2 minutos: provável link do adesivo compartilhado. Confira e, se for o caso, desclassifique em Pessoas.</p>
        {suspects.slice(0, 20).map(x => (
          <div key={x.participant_id} className="tw-between" style={{ fontSize: '0.88rem' }}>
            <span><b>{x.name || 'Sem nome'}</b> {x.instagram && <span className="tw-p">{x.instagram}</span>}</span>
            <span className="tw-chip tw-chip-bad">{x.seals} selos · 3 em {x.seconds}s</span>
          </div>
        ))}
      </div>
    )}
    <div className="tw-grid tw-grid-2" style={{ marginTop: '1.25rem' }}>
      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Prêmio do dia: impressora + 10 mil pontos E-Bronc</h3>
        <p className="tw-p" style={{ fontSize: '0.8rem' }}>Ganha o nº 1 do dia com os {daily.need} selos secretos. Para tirar alguém, desclassifique em Pessoas.</p>
        {Object.entries(daily.winners).map(([day, w]) => (
          <div key={day} className="tw-between" style={{ fontSize: '0.9rem' }}>
            <span>🏆 <b>{fmt(day)}</b> · {w.name}</span><span className="tw-p">{w.instagram} · {w.points} pts</span>
          </div>
        ))}
        <div className="tw-between" style={{ fontSize: '0.9rem' }}>
          <span><b>Hoje</b> · {daily.leader ? daily.leader.name : 'ninguém com os selos ainda'}</span>
          <span className="tw-p">{daily.leader ? `${daily.leader.points} pts` : ''}</span>
        </div>
      </div>
      {hasGift(campaign) && (
        <div className="tw-card tw-stack">
          <h3 className="tw-h3">Chaveiros Bronc: {claims.length}/{PUBLIC_GIFT.total} garantidos</h3>
          <label className="tw-field"><span>Selo premiado (quem do público encostar ganha o chaveiro)</span>
            <select className="tw-input" value={giftSeal} onChange={e => saveGiftSeal(e.target.value)}>
              <option value="">— nenhum —</option>
              {secrets.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </label>
          <input className="tw-input" placeholder="Buscar por nome, @ ou código" value={q} onChange={e => setQ(e.target.value)} />
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {shown.map(c => (
              <div key={c.id} className="tw-between" style={{ fontSize: '0.85rem', padding: '0.25rem 0' }}>
                <span><b style={{ fontFamily: 'ui-monospace, monospace' }}>{giftCode(c.participant?.id)}</b> · {c.participant?.name}</span>
                <span className="tw-p">{new Date(c.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {shown.length === 0 && <p className="tw-p">Ninguém ainda.</p>}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

// --- Relatório para os parceiros (imprimir / salvar PDF) ---

function Report({ campaign, partners }) {
  const [d, setD] = useState(null);
  useEffect(() => { loadStats(campaign).then(setD); }, [campaign]);
  if (!d) return <p className="tw-p">Montando relatório...</p>;

  const exportCsv = () => {
    const rows = [['Indicador', 'Valor', 'O que mede'], ...kpiList(d).map(([a, b, c]) => [a, b, c])];
    d.partnerStats.forEach(p => {
      const name = partners[p.id]?.name || p.id;
      rows.push([`${name} — desafios concluídos`, p.done, 'Ativação comercial']);
      rows.push([`${name} — pessoas que completaram`, p.people, 'Alcance do parceiro']);
      rows.push([`${name} — cliques`, p.clicks, 'Interesse no produto']);
    });
    downloadBlob(new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' }), `relatorio-${campaign.slug}.csv`);
  };

  const Rank = ({ list }) => (
    <table className="tw-report-table">
      <tbody>{list.map((r, i) => <tr key={r.participant_id}><td>{i + 1}º {r.name} <span className="tw-p">{r.instagram}</span></td><td>{r.points} pts</td></tr>)}</tbody>
    </table>
  );

  return (
    <div className="tw-stack tw-report">
      <div className="tw-row tw-noprint" style={{ flexWrap: 'wrap' }}>
        <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => window.print()}><Printer size={14} /> Imprimir / Salvar PDF</button>
        <button className="tw-btn tw-btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <div>
        <span className="tw-kicker">Relatório de resultados · Mestres da Tattoo</span>
        <h1 className="tw-h2" style={{ marginTop: '0.3rem' }}>{campaign.name}</h1>
        <p className="tw-p">{[formatDays(campaign), campaign.venue, campaign.city].filter(Boolean).join(' · ')}</p>
      </div>

      <h2 className="tw-h3">Indicadores gerais</h2>
      <div className="tw-card">
        <table className="tw-report-table">
          <thead><tr><th>Indicador</th><th>O que mede</th><th>Resultado</th></tr></thead>
          <tbody>{kpiList(d).map(([a, b, c]) => <tr key={a}><td>{a}</td><td className="tw-p">{c}</td><td><b>{b}</b></td></tr>)}</tbody>
        </table>
      </div>

      <h2 className="tw-h3">Por dia</h2>
      <div className="tw-card">
        <table className="tw-report-table">
          <thead><tr><th>Dia</th><th>Envios</th><th>Leituras NFC/QR</th></tr></thead>
          <tbody>{d.days.map(x => <tr key={x.label}><td>{x.label} — {dayName(campaign, Number(x.label.slice(-1)))} ({x.date && new Date(`${x.date}T00:00:00`).toLocaleDateString('pt-BR')})</td><td>{x.subs}</td><td>{x.scans}</td></tr>)}</tbody>
        </table>
      </div>

      <h2 className="tw-h3">Entrega por parceiro</h2>
      <div className="tw-grid tw-grid-2">
        {d.partnerStats.map(p => (
          <div key={p.id} className="tw-card tw-stack">
            <h3 className="tw-h3" style={{ color: partners[p.id]?.color }}>{partners[p.id]?.name || p.id}</h3>
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>{partners[p.id]?.role}</p>
            <table className="tw-report-table">
              <tbody>
                <tr><td>Desafios concluídos</td><td><b>{p.done}</b></td></tr>
                <tr><td>Pessoas que completaram</td><td><b>{p.people}</b></td></tr>
                <tr><td>Cliques para o parceiro</td><td><b>{p.clicks}</b></td></tr>
                {p.missions.map(x => <tr key={x.title}><td className="tw-p">{x.title}</td><td>{x.done}</td></tr>)}
              </tbody>
            </table>
            <p className="tw-p" style={{ fontSize: '0.78rem' }}>Exposição: marca na página da campanha, nos desafios, na premiação e na assinatura dos vídeos compartilhados ({d.videoShares}).</p>
          </div>
        ))}
      </div>

      <h2 className="tw-h3">Credenciais mais lidas</h2>
      <div className="tw-card">
        <table className="tw-report-table"><tbody>{d.scansBy.slice(0, 10).map(x => <tr key={x.name}><td>{x.name}</td><td>{x.n}</td></tr>)}</tbody></table>
      </div>

      <div className="tw-grid tw-grid-2">
        <div><h2 className="tw-h3">Top 10 Artist Challenge</h2><div className="tw-card"><Rank list={d.topArtist} /></div></div>
        <div><h2 className="tw-h3">Top 10 público</h2><div className="tw-card"><Rank list={d.topPublic} /></div></div>
      </div>
      <p className="tw-p" style={{ fontSize: '0.75rem' }}>Gerado em {new Date().toLocaleString('pt-BR')}. Participantes com participação privada não aparecem nos rankings.</p>
    </div>
  );
}

// --- Moderação ---

function Review({ campaign, onOpenParticipant }) {
  // Com aprovação automática, a revisão é feita sobre os aprovados (recusar o que não vale)
  const [status, setStatus] = useState('approved');
  const [track, setTrack] = useState('all');
  const [mission, setMission] = useState('');
  const [missions, setMissions] = useState([]);
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [counts, setCounts] = useState({});

  const load = useCallback(async () => {
    let q = supabase.from('tw_submissions')
      .select('*, mission:tw_missions!inner(*), participant:tw_participants(name, instagram, phone), artist:tw_artists(name)')
      .eq('mission.campaign_id', campaign.id)
      .eq('status', status).order('created_at', { ascending: status === 'pending' }).limit(150);
    if (mission) q = q.eq('mission_id', mission);
    const { data } = await q;
    setRows(data || []);
    setSelected(new Set());
    const c = {};
    await Promise.all(['pending', 'approved', 'rejected'].map(async st => {
      const { count } = await supabase.from('tw_submissions').select('id, mission:tw_missions!inner(campaign_id)', { count: 'exact', head: true }).eq('mission.campaign_id', campaign.id).eq('status', st);
      c[st] = count || 0;
    }));
    setCounts(c);
  }, [status, campaign.id, mission]);

  useEffect(() => { setRows(null); load(); }, [load]);
  useEffect(() => {
    supabase.from('tw_missions').select('id, title, track').eq('campaign_id', campaign.id).order('track').order('day').order('position').then(({ data }) => setMissions(data || []));
  }, [campaign.id]);

  const apply = async (items, ok, pts) => {
    const reviewer_note = ok ? null : (prompt(`Recusar ${items.length > 1 ? `${items.length} envios` : 'este envio'}? Motivo (opcional, o participante pode reenviar):`));
    if (!ok && reviewer_note === null) return;
    await Promise.all(items.map(row => supabase.from('tw_submissions').update({
      status: ok ? 'approved' : 'rejected',
      points: ok ? Number(pts ?? row.mission?.points ?? 0) : 0,
      reviewer_note: ok ? null : reviewer_note || null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', row.id)));
    load();
  };

  const list = (rows || []).filter(r => track === 'all' || r.mission?.track === track);
  const picked = list.filter(r => selected.has(r.id));
  const toggle = (id) => setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Moderação</h1>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <select className="tw-input" style={{ width: 'auto' }} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="approved">Aprovadas ({counts.approved ?? '…'})</option>
            <option value="pending">Pendentes ({counts.pending ?? '…'})</option>
            <option value="rejected">Recusadas ({counts.rejected ?? '…'})</option>
          </select>
          <select className="tw-input" style={{ width: 'auto' }} value={track} onChange={e => setTrack(e.target.value)}>
            <option value="all">Todas as trilhas</option><option value="artist">Artist Challenge</option><option value="public">Público</option>
          </select>
          <select className="tw-input" style={{ width: 'auto', maxWidth: 240 }} value={mission} onChange={e => setMission(e.target.value)}>
            <option value="">Todas as missões</option>{missions.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
      </div>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>Os envios entram aprovados automaticamente. Revise aqui e recuse o que não cumpre a missão — os pontos saem do ranking na hora e a pessoa pode reenviar.</p>
      {list.length > 0 && (
        <div className="tw-card tw-row" style={{ flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 5 }}>
          <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={picked.length === list.length} onChange={e => setSelected(e.target.checked ? new Set(list.map(r => r.id)) : new Set())} /> Selecionar todos
          </label>
          <span className="tw-p" style={{ fontSize: '0.85rem' }}>{picked.length} selecionado(s)</span>
          {status !== 'approved' && <button className="tw-btn tw-btn-sm tw-btn-ok" disabled={!picked.length} onClick={() => apply(picked, true)}><Check size={14} /> Aprovar selecionados</button>}
          {status !== 'rejected' && <button className="tw-btn tw-btn-sm tw-btn-bad" disabled={!picked.length} onClick={() => apply(picked, false)}><X size={14} /> Recusar selecionados</button>}
        </div>
      )}
      {rows === null && <p className="tw-p">Carregando...</p>}
      {rows && list.length === 0 && <div className="tw-empty">Nada aqui. 🎉</div>}
      {list.map(r => (
        <ReviewCard key={r.id} row={r} checked={selected.has(r.id)} onToggle={() => toggle(r.id)}
          onDecide={(row, ok, pts) => apply([row], ok, pts)} onOpenParticipant={onOpenParticipant} />
      ))}
    </div>
  );
}

function ReviewCard({ row, onDecide, checked, onToggle, onOpenParticipant }) {
  const [pts, setPts] = useState(row.status === 'approved' ? row.points : row.mission?.points);
  return (
    <div className="tw-card tw-stack" style={checked ? { borderColor: 'rgba(238,195,88,0.6)' } : undefined}>
      <div>
        <div className="tw-row" style={{ gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
          <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 18, height: 18 }} />
          <span className="tw-chip tw-chip-gold">{row.mission?.track === 'artist' ? 'Challenge' : `Público · Dia ${row.mission?.day ?? '-'}`}</span>
          {row.mission?.category && row.mission.category !== 'dia' && <span className="tw-chip">{CATEGORY_LABELS[row.mission.category]}</span>}
        </div>
        <h3 className="tw-h3">{row.mission?.title}</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>
          <button style={{ background: 'none', border: 0, padding: 0, color: '#fff', font: 'inherit', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onOpenParticipant(row.participant_id)}>{row.participant?.name}</button> {row.participant?.instagram} · {new Date(row.created_at).toLocaleString('pt-BR')}
          {row.artist && <> · com <b style={{ color: 'var(--tw-text)' }}>{row.artist.name}</b></>}
        </p>
        {row.note && <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>“{row.note}”</p>}
        {row.reviewer_note && <p className="tw-p" style={{ fontSize: '0.8rem' }}>Motivo: {row.reviewer_note}</p>}
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

const EMPTY_MISSION = { track: 'artist', day: '', category: 'geral', partner: '', title: '', description: '', points: 20, media_count: 1, approval: 'auto', hidden: false, active: true, position: 0, seal_name: '', seal_icon: 'star', seal_color: '#a995ff', require_post: true, hint: '' };

function Missions({ campaign, partners }) {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [surprise, setSurprise] = useState({ track: 'artist', title: '', description: '', points: 30, minutes: 20, media_count: 1, at: '' });
  const [toast, setToast] = useState(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef(null);

  const flash = (text, bad = false) => {
    setToast({ text, bad });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), bad ? 7000 : 2600);
  };

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).order('track').order('position');
    if (error) { flash(`Não carregou as missões: ${error.message}`, true); return; }
    setRows(data || []);
  }, [campaign.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { answerText, ...rest } = edit;
    const row = { ...rest, campaign_id: campaign.id, day: edit.day ? Number(edit.day) : null, partner: edit.partner || null, points: Number(edit.points) || 0, media_count: Number(edit.media_count) || 0, position: Number(edit.position) || 0 };
    delete row.created_at;
    // A resposta certa vira hash: quem olhar o site não descobre
    if (answerText?.trim()) row.answer_hash = await hashAnswers(answerText);
    // Nova missão: entra no fim da lista da trilha
    if (!row.id && !row.position) row.position = Math.max(0, ...rows.filter(m => m.track === row.track && m.category !== 'surpresa').map(m => m.position || 0)) + 1;
    const { data, error } = row.id
      ? await supabase.from('tw_missions').update(row).eq('id', row.id).select()
      : await supabase.from('tw_missions').insert([row]).select();
    setSaving(false);
    if (error) { flash(`Não salvou: ${error.message}`, true); return; }
    if (!data?.length) { flash('Não salvou: o banco não aceitou a alteração. Atualize a página e tente de novo.', true); return; }
    setEdit(null);
    flash(`Missão “${row.title}” salva${row.active ? '' : ' (desativada)'}`);
    load();
  };

  // Arrastar e soltar (ou setas ↑ ↓ no celular): reordena e grava a posição de todas da lista
  const reorder = async (list, fromId, toIdx) => {
    const from = list.findIndex(m => m.id === fromId);
    if (from < 0 || toIdx < 0 || toIdx >= list.length || from === toIdx) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(toIdx, 0, moved);
    const changes = next.map((m, i) => ({ id: m.id, position: i + 1 })).filter((c, i) => next[i].position !== c.position);
    setRows(rs => rs.map(r => { const c = changes.find(x => x.id === r.id); return c ? { ...r, position: c.position } : r; }));
    const res = await Promise.all(changes.map(c => supabase.from('tw_missions').update({ position: c.position }).eq('id', c.id)));
    const err = res.find(r => r.error);
    flash(err ? `Não salvou a ordem: ${err.error.message}` : 'Ordem salva. O site já mostra nessa ordem.', !!err);
    load();
  };

  // Sem horário = começa agora; com horário = programada (aparece sozinha na hora)
  const launch = async (e) => {
    e.preventDefault();
    const now = surprise.at ? new Date(surprise.at) : new Date();
    const { error } = await supabase.from('tw_missions').insert([{
      campaign_id: campaign.id,
      track: surprise.track,
      category: 'surpresa',
      title: surprise.title,
      description: surprise.description || null,
      points: Number(surprise.points),
      media_count: Number(surprise.media_count),
      approval: 'auto',
      starts_at: now.toISOString(),
      ends_at: new Date(now.getTime() + Number(surprise.minutes) * 60000).toISOString(),
      position: 0,
    }]);
    if (error) { alert(error.message); return; }
    setSurprise(s => ({ ...s, title: '', description: '', at: '' }));
    load();
  };

  const toggle = async (m) => {
    const { data, error } = await supabase.from('tw_missions').update({ active: !m.active }).eq('id', m.id).select();
    if (error || !data?.length) { flash(`Não mudou “${m.title}”: ${error?.message || 'o banco não aceitou'}`, true); return; }
    flash(m.active ? `“${m.title}” saiu do ar (está em Desativadas)` : `“${m.title}” está no ar`);
    load();
  };

  const duplicate = (m) => {
    const { id, created_at, ...rest } = m;
    void id; void created_at;
    setEdit({ ...rest, title: `${m.title} (cópia)`, starts_at: null, ends_at: null });
  };

  const remove = async (m) => {
    const { count } = await supabase.from('tw_submissions').select('id', { count: 'exact', head: true }).eq('mission_id', m.id);
    const warn = count ? `\n\nATENÇÃO: ${count} envio(s) desta missão serão apagados e os pontos saem do ranking. Prefira “Desativar”.` : '';
    if (!confirm(`Excluir a missão “${m.title}”?${warn}`)) return;
    const { error } = await supabase.from('tw_missions').delete().eq('id', m.id);
    if (error) alert(error.message);
    load();
  };

  const surpriseState = (m) => {
    const now = new Date();
    if (m.starts_at && new Date(m.starts_at) > now) return ['Programada', 'tw-chip-gold'];
    if (m.ends_at && new Date(m.ends_at) < now) return ['Encerrada', ''];
    return ['No ar', 'tw-chip-bad'];
  };

  const byPos = (a, b) => (a.position || 0) - (b.position || 0);
  const groups = [
    ['Surpresas', rows.filter(m => m.category === 'surpresa'), false],
    ['Público · no ar', rows.filter(m => m.track === 'public' && m.category !== 'surpresa' && m.active).sort(byPos), true],
    // Artist Challenge separado por dia (cada dia tem as suas 5 missões)
    ...[...new Set(rows.filter(m => m.track === 'artist' && m.category !== 'surpresa' && m.active).map(m => m.day || 0))].sort().map(day => [
      day ? `Artist Challenge · dia ${day}${campaign.event_days?.[day - 1] ? ` (${new Date(`${campaign.event_days[day - 1]}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})` : ''} · no ar` : 'Artist Challenge · todos os dias · no ar',
      rows.filter(m => m.track === 'artist' && m.category !== 'surpresa' && m.active && (m.day || 0) === day).sort(byPos),
      true,
    ]),
    ['Desativadas (fora do site)', rows.filter(m => !m.active && m.category !== 'surpresa'), false],
  ];

  return (
    <div className="tw-stack">
      <div className="tw-between"><h1 className="tw-h2">Missões</h1><button className="tw-btn tw-btn-sm" onClick={() => setEdit({ ...EMPTY_MISSION })}><Plus size={14} /> Nova missão</button></div>

      <form className="tw-surprise tw-stack" style={{ animation: 'none' }} onSubmit={launch}>
        <span className="tw-kicker" style={{ color: '#fca5a5' }}><Zap size={12} /> Missão surpresa — lançar agora ou programar</span>
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
          <label className="tw-row" style={{ gap: '0.3rem', fontSize: '0.8rem' }}>Começa em <input className="tw-input" type="datetime-local" style={{ width: 'auto' }} value={surprise.at} onChange={e => setSurprise({ ...surprise, at: e.target.value })} /></label>
          <button className="tw-btn tw-btn-primary tw-btn-sm"><Zap size={14} /> {surprise.at ? 'Programar' : 'Lançar agora'}</button>
        </div>
        <p className="tw-p" style={{ fontSize: '0.78rem' }}>Deixe “Começa em” vazio para lançar agora. Programadas aparecem sozinhas no horário, com contagem regressiva (em até 1 minuto). Dica: monte toda a agenda de surpresas dos 3 dias antes do evento.</p>
      </form>

      {toast && <div className={`tw-toast ${toast.bad ? 'bad' : ''}`} role="status">{toast.text}</div>}

      {edit && (
        <div className="tw-modal" onClick={e => { if (e.target === e.currentTarget) setEdit(null); }}>
        <form className="tw-card tw-card-gold tw-stack" onSubmit={save}>
          <h3 className="tw-h3">{edit.id ? 'Editar missão' : 'Nova missão'}</h3>
          <input className="tw-input" placeholder="Título" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} required />
          <textarea className="tw-input" placeholder="Descrição / instruções" value={edit.description || ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
          <textarea className="tw-input" placeholder="💡 Dica de como resolver (ex.: vá até o stand da TCM e pergunte)" value={edit.hint || ''} onChange={e => setEdit({ ...edit, hint: e.target.value })} />
          <div className="tw-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            <label className="tw-field"><span>Trilha</span><select className="tw-input" value={edit.track} onChange={e => setEdit({ ...edit, track: e.target.value })}><option value="public">Público</option><option value="artist">Artist Challenge</option></select></label>
            <label className="tw-field"><span>Categoria</span><select className="tw-input" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })}>{Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className="tw-field"><span>Dia</span><select className="tw-input" value={edit.day ?? ''} onChange={e => setEdit({ ...edit, day: e.target.value })}><option value="">—</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>
            <label className="tw-field"><span>Parceiro</span><select className="tw-input" value={edit.partner || ''} onChange={e => setEdit({ ...edit, partner: e.target.value })}><option value="">—</option>{Object.values(partners).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
            <label className="tw-field"><span>Pontos</span><input className="tw-input" type="number" value={edit.points} onChange={e => setEdit({ ...edit, points: e.target.value })} /></label>
            <label className="tw-field"><span>Fotos/vídeos (0 = só resposta)</span><input className="tw-input" type="number" min="0" max="3" value={edit.media_count} onChange={e => setEdit({ ...edit, media_count: e.target.value })} /></label>
            <label className="tw-field"><span>Posição</span><input className="tw-input" type="number" value={edit.position ?? 0} onChange={e => setEdit({ ...edit, position: Number(e.target.value) })} /></label>
          </div>
          {edit.category === 'quiz' && (
            <div className="tw-card tw-stack">
              <b>Resposta certa</b>
              <p className="tw-p" style={{ fontSize: '0.8rem' }}>{edit.answer_hash ? '✓ Resposta cadastrada. Digite de novo só se quiser trocar.' : '⚠ Sem resposta a pergunta fica fechada no site.'} Aceita várias separadas por “;” (ex.: Fulano da Silva; Fulano). Maiúsculas, acentos e @ não importam.</p>
              <input className="tw-input" placeholder="Resposta certa" value={edit.answerText || ''} onChange={e => setEdit({ ...edit, answerText: e.target.value })} autoComplete="off" />
              <input className="tw-input" placeholder="Dica no campo (opcional, ex.: nome e sobrenome)" value={edit.answer_hint || ''} onChange={e => setEdit({ ...edit, answer_hint: e.target.value })} />
            </div>
          )}
          <div className="tw-card tw-stack">
            <b>Selo de escoteiro desta missão</b>
            <div className="tw-row" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ background: '#f4eeff', borderRadius: 14, padding: 6 }}><Patch name={edit.seal_name || 'Selo'} icon={edit.seal_icon || 'star'} color={edit.seal_color || '#a995ff'} size={86} /></div>
              <div className="tw-stack" style={{ flex: '1 1 220px', gap: 0 }}>
                <input className="tw-input" placeholder="Nome do selo (ex.: Comilão)" value={edit.seal_name || ''} onChange={e => setEdit({ ...edit, seal_name: e.target.value })} />
                <select className="tw-input" style={{ marginTop: '0.5rem' }} value={edit.seal_icon || 'star'} onChange={e => setEdit({ ...edit, seal_icon: e.target.value })}>
                  {SEAL_ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="tw-row" style={{ marginTop: '0.5rem', gap: '0.35rem' }}>
                  {SEAL_COLORS.map(c => <button type="button" key={c} onClick={() => setEdit({ ...edit, seal_color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: edit.seal_color === c ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} aria-label={c} />)}
                </div>
              </div>
            </div>
          </div>
          {edit.track === 'artist' && (
            <label className="tw-check" style={{ display: 'none' }}><input type="checkbox" checked={!!edit.require_post} onChange={e => setEdit({ ...edit, require_post: e.target.checked })} /><span>Pedir o link do post no perfil do tatuador marcando os parceiros.</span></label>
          )}
          <label className="tw-check"><input type="checkbox" checked={!!edit.hidden} onChange={e => setEdit({ ...edit, hidden: e.target.checked })} /><span>Escondida: só aparece para quem ler o Ponto NFC que a revela (configure em Pontos NFC).</span></label>
          <label className="tw-check"><input type="checkbox" checked={edit.active !== false} onChange={e => setEdit({ ...edit, active: e.target.checked })} /><span>No ar (aparece no site)</span></label>
          <div className="tw-row"><button className="tw-btn tw-btn-primary tw-btn-sm" disabled={saving}><Save size={14} /> {saving ? 'Salvando...' : 'Salvar'}</button><button type="button" className="tw-btn tw-btn-ghost tw-btn-sm" onClick={() => setEdit(null)}>Cancelar</button></div>
        </form>
        </div>
      )}

      {groups.map(([title, list, sortable]) => list.length > 0 && (
        <section key={title} className="tw-stack" style={{ marginTop: '1rem' }}>
          <h3 className="tw-kicker">{title} · {list.length}</h3>
          {sortable && <p className="tw-p" style={{ fontSize: '0.78rem', margin: 0 }}>Segure e arraste pela alça ⠿ para mudar a ordem (no celular use ↑ ↓). Grava sozinho.</p>}
          <div className="tw-table-wrap">
            <table className="tw-table tw-table-stack">
              <tbody>
                {list.map((m, idx) => (
                  <tr
                    key={m.id}
                    style={{ opacity: m.active ? 1 : 0.45 }}
                    className={`${sortable && over === m.id && drag !== m.id ? 'tw-admin-row-drop' : ''} ${drag === m.id ? 'tw-admin-row-dragging' : ''}`}
                    draggable={sortable}
                    onDragStart={sortable ? (e => { setDrag(m.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', m.id); }) : undefined}
                    onDragOver={sortable ? (e => { if (!drag || !list.some(x => x.id === drag)) return; e.preventDefault(); setOver(m.id); }) : undefined}
                    onDrop={sortable ? (e => { e.preventDefault(); const from = drag; setDrag(null); setOver(null); reorder(list, from, idx); }) : undefined}
                    onDragEnd={sortable ? (() => { setDrag(null); setOver(null); }) : undefined}
                  >
                    <td style={{ width: '50%' }}>
                      <div className="tw-row" style={{ gap: '0.4rem', alignItems: 'flex-start' }}>
                      {sortable && <span className="tw-admin-drag" title="Arraste para reordenar"><GripVertical size={16} /></span>}
                      <div>
                      <b>{sortable ? `${idx + 1}. ` : ''}{m.title}</b>
                      <div className="tw-row" style={{ gap: '0.3rem', marginTop: 4, flexWrap: 'wrap' }}>
                        {m.partner && <span className="tw-chip" style={{ color: partners[m.partner]?.color }}>{partners[m.partner]?.name || m.partner}</span>}
                        {m.hidden && <span className="tw-chip tw-chip-gold">Escondida</span>}
                        {m.category === 'quiz' && <span className={`tw-chip ${m.answer_hash ? 'tw-chip-ok' : 'tw-chip-bad'}`}>{m.answer_hash ? 'Resposta ✓' : 'Falta a resposta'}</span>}
                        {m.category === 'surpresa' && <span className={`tw-chip ${surpriseState(m)[1]}`}>{surpriseState(m)[0]}</span>}
                        {m.day && <span className="tw-chip">Só no dia {m.day}</span>}
                        {m.starts_at && <span className="tw-chip">{new Date(m.starts_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}{m.ends_at && ` → ${new Date(m.ends_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}</span>}
                      </div>
                      </div>
                      </div>
                    </td>
                    <td>{m.points} pts</td>
                    <td>{m.media_count}×</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {sortable && <>
                        <button className="tw-icon-btn" style={{ display: 'inline-grid' }} disabled={idx === 0} onClick={() => reorder(list, m.id, idx - 1)} title="Subir"><ArrowUp size={13} /></button>{' '}
                        <button className="tw-icon-btn" style={{ display: 'inline-grid' }} disabled={idx === list.length - 1} onClick={() => reorder(list, m.id, idx + 1)} title="Descer"><ArrowDown size={13} /></button>{' '}
                      </>}
                      <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setEdit({ ...m })}>Editar</button>{' '}
                      <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => toggle(m)}>{m.active ? 'Desativar' : 'Ativar'}</button>{' '}
                      <button className="tw-icon-btn" style={{ display: 'inline-grid' }} onClick={() => duplicate(m)} title="Duplicar"><CopyPlus size={13} /></button>{' '}
                      <button className="tw-icon-btn" style={{ display: 'inline-grid' }} onClick={() => remove(m)} title="Excluir"><Trash2 size={13} /></button>
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

// --- Adesivos NFC: pontos, selos secretos e ativação ---

const KIND_HELP = {
  point: 'Cole pelos stands e lugares do evento. A pessoa registra com uma foto e ganha os pontos do “Ponto NFC encontrado”.',
  secret: 'Esconda bem! Quem encostar o celular ganha o selo e os pontos na hora, sem foto.',
  activation: 'Cole no stand da Bronc. Libera o Artist Challenge para o tatuador que escanear.',
};

function Artists({ campaign }) {
  const [rows, setRows] = useState([]);
  const [missions, setMissions] = useState([]);
  const [saving, setSaving] = useState(null);
  const [print, setPrint] = useState(false);
  const [filter, setFilter] = useState('all');
  const base = `${window.location.origin}${campaignBase(campaign)}`;
  const kindOf = (r) => r.kind || 'point';

  const load = useCallback(async () => {
    const [a, m] = await Promise.all([
      supabase.from('tw_artists').select('*').eq('campaign_id', campaign.id).order('slug'),
      supabase.from('tw_missions').select('id, title').eq('campaign_id', campaign.id).eq('hidden', true),
    ]);
    setRows(a.data || []);
    setMissions(m.data || []);
  }, [campaign.id]);
  useEffect(() => { load(); }, [load]);

  const set = (id, patch) => setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (r) => {
    setSaving(r.id);
    const { id, created_at, ...patch } = r;
    void created_at;
    const { error } = await supabase.from('tw_artists').update({ ...patch, reveals_mission_id: patch.reveals_mission_id || null }).eq('id', id);
    if (error) alert(error.message);
    setSaving(null);
  };

  const add = async (kind) => {
    const prefix = kind === 'secret' ? 'selo' : kind === 'activation' ? 'ativacao' : 'ponto';
    const used = new Set(rows.map(r => r.slug));
    let n = 1;
    while (used.has(`${prefix}-${String(n).padStart(2, '0')}`)) n++;
    const num = String(n).padStart(2, '0');
    const row = { campaign_id: campaign.id, slug: `${prefix}-${num}`, kind, name: kind === 'secret' ? `Selo secreto ${num}` : kind === 'activation' ? 'Ativação Artist Challenge' : `Ponto NFC ${num}` };
    if (kind === 'secret') row.seal_icon = '⭐';
    const { error } = await supabase.from('tw_artists').insert([row]);
    if (error) alert(error.message);
    load();
  };

  const remove = async (r) => {
    if (!confirm(`Excluir ${r.slug} (${r.name})? Se o adesivo já foi gravado, ele para de funcionar. Prefira desmarcar “Ativo”.`)) return;
    await supabase.from('tw_artists').delete().eq('id', r.id);
    load();
  };

  const uploadPhoto = async (r, file) => {
    try {
      const m = await uploadMedia(file, `artists/${campaign.id}`);
      set(r.id, { photo_url: m.url });
      await supabase.from('tw_artists').update({ photo_url: m.url }).eq('id', r.id);
    } catch (e) { alert(e.message); }
  };

  const order = { activation: 0, secret: 1, point: 2 };
  const list = rows.filter(r => filter === 'all' || kindOf(r) === filter)
    .sort((x, y) => order[kindOf(x)] - order[kindOf(y)] || x.slug.localeCompare(y.slug));
  const count = (k) => rows.filter(r => kindOf(r) === k).length;

  if (print) {
    return (
      <div className="tw-stack">
        <div className="tw-row tw-noprint" style={{ flexWrap: 'wrap' }}>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setPrint(false)}><ArrowLeft size={14} /> Voltar</button>
          <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
        </div>
        <p className="tw-p tw-noprint" style={{ fontSize: '0.85rem' }}>
          Adesivos redondos de 6 cm: cole o NFC atrás e o QR fica como alternativa para quem não tem NFC. Grave no NFC a URL sem o “?src=qr”.
          Os selos secretos saem sem nome, para não entregar o segredo.
        </p>
        <div className="tw-stickers">
          {list.filter(r => r.active).map(r => {
            const k = kindOf(r);
            return (
              <div key={r.id} className={`tw-sticker tw-sticker-${k}`}>
                <div className="tw-sticker-top">{k === 'activation' ? 'ATIVE O ARTIST CHALLENGE' : k === 'secret' ? 'SELO SECRETO' : 'ENCOSTE O CELULAR'}</div>
                <div className="tw-sticker-qr"><QRCodeSVG value={`${base}/nfc/${r.slug}?src=qr`} size={92} /></div>
                <div className="tw-sticker-name">{k === 'secret' ? '???' : k === 'point' ? `PONTO ${r.slug.replace(/\D/g, '')}` : (r.location || 'STAND BRONC').toUpperCase()}</div>
                <div className="tw-sticker-brand">{campaign.name.toUpperCase()}</div>
              </div>
            );
          })}
        </div>
        <div className="tw-noprint tw-table-wrap">
          <table className="tw-table tw-table-stack">
            <thead><tr><th>Adesivo</th><th>URL para gravar no NFC</th></tr></thead>
            <tbody>{list.map(r => <tr key={r.id}><td>{r.name}</td><td style={{ fontSize: '0.78rem', wordBreak: 'break-all' }}>{base}/nfc/{r.slug}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Adesivos NFC ({rows.length})</h1>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => add('point')}><Plus size={14} /> Ponto</button>
          <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => add('secret')}><Plus size={14} /> Selo secreto</button>
          <button className="tw-btn tw-btn-sm" onClick={() => setPrint(true)}><Printer size={14} /> Imprimir adesivos</button>
        </div>
      </div>
      <div className="tw-tabs">
        {[['all', `Todos (${rows.length})`], ['point', `Pontos (${count('point')})`], ['secret', `Selos (${count('secret')})`], ['activation', `Ativação (${count('activation')})`]].map(([k, l]) => (
          <button key={k} className={`tw-tab ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="tw-notice">
        Grave em cada adesivo NFC a URL dele (ex.: <b>{base}/nfc/ponto-01</b>) com o app “NFC Tools”, registro do tipo <b>URL</b>. Depois encoste o celular para testar.
        {filter !== 'all' && <><br />{KIND_HELP[filter]}</>}
      </div>
      {list.map(r => {
        const k = kindOf(r);
        return (
          <div key={r.id} className="tw-card tw-stack">
            <div className="tw-between" style={{ flexWrap: 'wrap' }}>
              <div className="tw-row">
                {k === 'secret'
                  ? <div className="tw-seal-secret got" style={{ width: 56 }}><span style={{ fontSize: '1.5rem' }}>{r.seal_icon || '★'}</span></div>
                  : (
                    <label style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#1a1a1a', cursor: 'pointer', flex: '0 0 56px', display: 'grid', placeItems: 'center' }} title="Trocar foto">
                      {r.photo_url ? <img src={r.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Plus size={18} color="#888" />}
                      <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && uploadPhoto(r, e.target.files[0])} />
                    </label>
                  )}
                <div style={{ minWidth: 0 }}>
                  <span className={`tw-chip ${k === 'secret' ? 'tw-chip-quiz' : k === 'activation' ? 'tw-chip-bad' : 'tw-chip-gold'}`}>{NFC_KINDS[k]}</span>
                  <div style={{ fontSize: '0.75rem', marginTop: 4, wordBreak: 'break-all' }}><a href={`${base}/nfc/${r.slug}`} target="_blank" rel="noreferrer" className="tw-gold">{base}/nfc/{r.slug}</a></div>
                </div>
              </div>
              <div style={{ background: '#fff', padding: 6, borderRadius: 8 }}><QRCodeSVG value={`${base}/nfc/${r.slug}?src=qr`} size={64} /></div>
            </div>
            <div className="tw-grid tw-grid-3">
              <input className="tw-input" placeholder="Nome" value={r.name || ''} onChange={e => set(r.id, { name: e.target.value })} />
              <input className="tw-input" placeholder="Onde está colado (ex.: Stand Bronc)" value={r.location || ''} onChange={e => set(r.id, { location: e.target.value })} />
              {k === 'secret'
                ? <input className="tw-input" placeholder="Emoji do selo (ex.: 🐉)" value={r.seal_icon || ''} onChange={e => set(r.id, { seal_icon: e.target.value })} />
                : <input className="tw-input" placeholder="@instagram (opcional)" value={r.instagram || ''} onChange={e => set(r.id, { instagram: e.target.value })} />}
            </div>
            <textarea className="tw-input" placeholder={k === 'secret' ? 'Mensagem ao encontrar o selo' : 'Descrição (aparece ao encostar o celular)'} value={r.bio || ''} onChange={e => set(r.id, { bio: e.target.value })} />
            {k === 'point' && (
              <div className="tw-grid tw-grid-2">
                <input className="tw-input" placeholder="Desafio deste ponto (opcional)" value={r.mission_text || ''} onChange={e => set(r.id, { mission_text: e.target.value })} />
                <select className="tw-input" value={r.reveals_mission_id || ''} onChange={e => set(r.id, { reveals_mission_id: e.target.value })}>
                  <option value="">Não revela missão escondida</option>
                  {missions.map(m => <option key={m.id} value={m.id}>Revela: {m.title}</option>)}
                </select>
              </div>
            )}
            <div className="tw-row" style={{ flexWrap: 'wrap' }}>
              <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => save(r)} disabled={saving === r.id}><Save size={14} /> {saving === r.id ? 'Salvando...' : 'Salvar'}</button>
              <select className="tw-input" style={{ width: 'auto' }} value={k} onChange={e => set(r.id, { kind: e.target.value })}>
                {Object.entries(NFC_KINDS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <label className="tw-row" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><input type="checkbox" checked={r.active} onChange={e => set(r.id, { active: e.target.checked })} /> Ativo</label>
              <button className="tw-icon-btn" style={{ marginLeft: 'auto' }} onClick={() => remove(r)} title="Excluir"><Trash2 size={13} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Participantes + exportação ---

function toCsv(rows) {
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  if (Array.isArray(rows[0])) return rows.map(r => r.map(esc).join(';')).join('\n');
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  return [cols.join(';'), ...rows.map(r => cols.map(c => esc(r[c])).join(';'))].join('\n');
}

function People({ campaign, onOpenParticipant }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const [en, r] = await Promise.all([
        supabase.from('tw_enrollments').select('track, created_at, participant:tw_participants(*)').eq('campaign_id', campaign.id),
        supabase.from('tw_ranking').select('participant_id, track, points').eq('campaign_id', campaign.id),
      ]);
      const pts = {};
      (r.data || []).forEach(x => { pts[`${x.participant_id}:${x.track}`] = x.points; });
      const byId = {};
      (en.data || []).forEach(e => {
        if (!e.participant) return;
        byId[e.participant.id] ||= { ...e.participant, tracks: [], joined: e.created_at };
        byId[e.participant.id].tracks.push(e.track);
      });
      setRows(Object.values(byId).map(x => ({ ...x, public_points: pts[`${x.id}:public`] || 0, artist_points: pts[`${x.id}:artist`] || 0 }))
        .sort((a, b) => b.joined.localeCompare(a.joined)));
    })();
  }, [campaign.id]);

  if (!rows) return <p className="tw-p">Carregando...</p>;

  const list = rows.filter(r => !q || `${r.name} ${r.email} ${r.instagram} ${r.phone}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => downloadBlob(new Blob(['﻿' + toCsv(rows.map(r => ({
    nome: r.name, email: r.email, telefone: r.phone, instagram: r.instagram, cidade: r.city, estudio: r.studio,
    publico: r.tracks.includes('public') ? 'sim' : 'não', artist_challenge: r.tracks.includes('artist') ? 'sim' : 'não',
    pontos_publico: r.public_points, pontos_challenge: r.artist_points,
    ranking_publico: r.show_in_ranking ? 'sim' : 'não', autoriza_divulgacao: r.consent_marketing ? 'sim' : 'não',
    inscricao: new Date(r.joined).toLocaleString('pt-BR'),
  })))], { type: 'text/csv;charset=utf-8' }), `participantes-${campaign.slug}.csv`);

  return (
    <div className="tw-stack">
      <div className="tw-between" style={{ flexWrap: 'wrap' }}>
        <h1 className="tw-h2">Participantes ({rows.length})</h1>
        <button className="tw-btn tw-btn-sm" onClick={exportCsv}><Download size={14} /> Exportar CSV</button>
      </div>
      <input className="tw-input" placeholder="Buscar por nome, e-mail, @, telefone" value={q} onChange={e => setQ(e.target.value)} />
      <div className="tw-table-wrap">
        <table className="tw-table tw-table-stack">
          <thead><tr><th>Nome</th><th>Contato</th><th>Trilhas</th><th>Pts público</th><th>Pts challenge</th><th>Divulgação</th><th></th></tr></thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id}>
                <td>
                  <button style={{ background: 'none', border: 0, padding: 0, color: '#fff', font: 'inherit', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }} onClick={() => onOpenParticipant(r.id)}>{r.name}</button>
                  {r.blocked && <span className="tw-chip tw-chip-bad" style={{ marginLeft: 6 }}>Desclassificado</span>}
                  <div className="tw-p" style={{ fontSize: '0.75rem' }}>{r.instagram} {r.city}</div>
                </td>
                <td style={{ fontSize: '0.78rem' }}>{r.email}<br />{r.phone}</td>
                <td>{r.tracks.includes('public') && <span className="tw-chip">Público</span>} {r.tracks.includes('artist') && <span className="tw-chip tw-chip-gold">Challenge</span>}</td>
                <td data-label="Pts público">{r.public_points}</td>
                <td data-label="Pts challenge">{r.artist_points}</td>
                <td data-label="Divulgação">{r.consent_marketing ? <span className="tw-chip tw-chip-ok">Sim</span> : <span className="tw-chip">Não</span>}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate(`${campaignBase(campaign)}/retrospectiva?p=${r.id}`)} title="Ver retrospectiva"><Film size={14} /></button>{' '}
                  <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate(`/desafios/perfil/${r.id}`)} title="Ver perfil"><Users size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Campanha: editar, criar, duplicar ---

const EMPTY_CAMPAIGN = {
  name: '', slug: '', event_name: '', tagline: 'Missões rápidas. Selos secretos. Prêmios todo dia.', description: '', venue: '', city: '',
  hero_image: '', event_days: ['', '', ''], day_names: DEFAULT_DAY_NAMES, unlock_all: false, music_url: '', partners: [],
  prize_title: 'O Kit dos Mestres', prize_items: [], status: 'draft',
};

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function copyCampaignContent(fromId, toId, copyArtists) {
  const { data: missions } = await supabase.from('tw_missions').select('*').eq('campaign_id', fromId).neq('category', 'surpresa');
  const idMap = {};
  const newMissions = (missions || []).map(m => {
    const { id, created_at, starts_at, ends_at, ...rest } = m;
    void created_at; void starts_at; void ends_at;
    idMap[id] = `${toId}-${id}`.slice(0, 120);
    return { ...rest, id: idMap[id], campaign_id: toId };
  });
  if (newMissions.length) {
    const { error } = await supabase.from('tw_missions').insert(newMissions);
    if (error) throw error;
  }
  if (copyArtists) {
    const { data: artists } = await supabase.from('tw_artists').select('slug, reveals_mission_id').eq('campaign_id', fromId).order('slug');
    const slots = (artists || []).map((a, i) => ({
      campaign_id: toId,
      slug: a.slug,
      name: `Artista ${String(i + 1).padStart(2, '0')}`,
      reveals_mission_id: a.reveals_mission_id ? idMap[a.reveals_mission_id] || null : null,
    }));
    if (slots.length) {
      const { error } = await supabase.from('tw_artists').insert(slots);
      if (error) throw error;
    }
  }
}

// Mapa do jogo: sobe a imagem e toca nela para marcar os pinos
const PIN_KINDS = { bronc: 'Bronc', stage: 'Palco', info: 'Info', star: 'Destaque' };

function MapEditor({ f, setF, setMsg }) {
  const pins = Array.isArray(f.map_pins) ? f.map_pins : [];
  const setPins = (list) => setF(x => ({ ...x, map_pins: list }));

  const upload = async (file) => {
    try {
      const m = await uploadMedia(file, 'maps');
      setF(x => ({ ...x, map_image: m.url }));
    } catch (e) { setMsg(e.message); }
  };

  const addAt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    setPins([...pins, { label: 'Novo ponto', x, y, kind: 'star' }]);
  };

  return (
    <div className="tw-card tw-stack">
      <h3 className="tw-h3">Mapa do jogo</h3>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>Suba o mapa oficial do evento e toque nele para colocar um pino. Os selos secretos nunca aparecem no mapa.</p>
      <div className="tw-row" style={{ flexWrap: 'wrap' }}>
        <label className="tw-btn tw-btn-sm">Subir mapa<input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && upload(e.target.files[0])} /></label>
        <input className="tw-input" style={{ flex: 1, minWidth: 200 }} placeholder="ou URL da imagem" value={f.map_image || ''} onChange={e => setF({ ...f, map_image: e.target.value })} />
      </div>
      {f.map_image && (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'crosshair' }} onClick={addAt}>
          <img src={f.map_image} alt="Mapa" style={{ width: '100%', display: 'block' }} />
          {pins.map((p, i) => (
            <span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', width: 22, height: 22, borderRadius: '50%', background: p.kind === 'bronc' ? '#f07c2a' : '#ff4fa3', border: '3px solid #1d1646', color: '#fff', fontSize: 11, fontWeight: 900, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
          ))}
        </div>
      )}
      {pins.map((p, i) => (
        <div key={i} className="tw-row" style={{ flexWrap: 'wrap' }}>
          <b style={{ width: 22 }}>{i + 1}</b>
          <input className="tw-input" style={{ flex: '1 1 200px' }} value={p.label} onChange={e => setPins(pins.map((q, j) => (j === i ? { ...q, label: e.target.value } : q)))} />
          <select className="tw-input" style={{ width: 'auto' }} value={p.kind || 'star'} onChange={e => setPins(pins.map((q, j) => (j === i ? { ...q, kind: e.target.value } : q)))}>
            {Object.entries(PIN_KINDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <button type="button" className="tw-icon-btn" onClick={() => setPins(pins.filter((_, j) => j !== i))} title="Remover"><Trash2 size={13} /></button>
        </div>
      ))}
    </div>
  );
}

function CampaignEditor({ campaign, partners, reload, isNew, onCreated }) {
  const [f, setF] = useState(() => {
    const src = isNew ? EMPTY_CAMPAIGN : campaign;
    const days = [...(src.event_days || [])];
    while (days.length < 3) days.push('');
    return { ...src, event_days: days, day_names: { ...DEFAULT_DAY_NAMES, ...(src.day_names || {}) }, prizeText: (src.prize_items || []).join('\n') };
  });
  const [copy, setCopy] = useState({ from: campaign?.id || '', artists: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const upload = async (file) => {
    try {
      const m = await uploadMedia(file, 'campaigns');
      setF(x => ({ ...x, hero_image: m.url }));
    } catch (e) { setMsg(e.message); }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const { prizeText, id, created_at, ...rest } = f;
    void created_at;
    const row = {
      ...rest,
      slug: slugify(f.slug || f.name),
      event_days: f.event_days.filter(Boolean),
      prize_items: prizeText.split('\n').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (isNew) {
        const newId = row.slug;
        const { error } = await supabase.from('tw_campaigns').insert([{ ...row, id: newId }]);
        if (error) throw error;
        if (copy.from) await copyCampaignContent(copy.from, newId, copy.artists);
        onCreated(newId);
      } else {
        const { error } = await supabase.from('tw_campaigns').update(row).eq('id', id);
        if (error) throw error;
        await reload();
        setMsg('Salvo!');
      }
    } catch (err) {
      setMsg(err.message);
    }
    setSaving(false);
  };

  const th = campaignTheme({ slug: f.slug, theme: f.theme });
  const setTheme = (patch) => setF(x => ({ ...x, theme: { ...th, ...patch } }));
  const setAccent = (i, color) => { const a = [...(th.accents.length ? th.accents : [th.primary, th.primary, th.primary])]; a[i] = color; setTheme({ accents: a }); };

  const togglePartner = (pid) => setF(x => ({ ...x, partners: x.partners.includes(pid) ? x.partners.filter(p => p !== pid) : [...x.partners, pid] }));

  return (
    <form className="tw-stack" style={{ maxWidth: 760 }} onSubmit={save}>
      <h1 className="tw-h2">{isNew ? 'Nova campanha' : 'Campanha'}</h1>
      {isNew && (
        <div className="tw-card tw-card-gold tw-stack">
          <h3 className="tw-h3"><Copy size={16} style={{ verticalAlign: -2 }} /> Reaproveitar uma campanha</h3>
          <p className="tw-p" style={{ fontSize: '0.85rem' }}>Copia as missões (público e Artist Challenge) e as vagas de credenciais. Depois é só trocar identidade, parceiros e prêmios.</p>
          <select className="tw-input" value={copy.from} onChange={e => setCopy({ ...copy, from: e.target.value })}>
            <option value="">Começar do zero</option>
            {campaign && <option value={campaign.id}>Copiar de: {campaign.name}</option>}
          </select>
          {copy.from && <label className="tw-check"><input type="checkbox" checked={copy.artists} onChange={e => setCopy({ ...copy, artists: e.target.checked })} /><span>Copiar também as vagas de credenciais NFC (com nomes zerados)</span></label>}
        </div>
      )}

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Identidade</h3>
        <div className="tw-grid tw-grid-2">
          <label className="tw-field"><span>Nome do desafio</span><input className="tw-input" placeholder="Desafio Masters Ink" value={f.name} onChange={e => setF({ ...f, name: e.target.value, slug: isNew ? slugify(e.target.value) : f.slug })} required /></label>
          <label className="tw-field"><span>Endereço (/desafios/…)</span><input className="tw-input" value={f.slug} onChange={e => setF({ ...f, slug: slugify(e.target.value) })} required disabled={!isNew && f.slug === 'tattooweek'} /></label>
          <label className="tw-field"><span>Nome do evento (“Meu …”)</span><input className="tw-input" placeholder="Masters Ink" value={f.event_name || ''} onChange={e => setF({ ...f, event_name: e.target.value })} required /></label>
          <label className="tw-field"><span>Status</span><select className="tw-input" value={f.status} onChange={e => setF({ ...f, status: e.target.value })}><option value="draft">Rascunho (só admin vê na lista)</option><option value="active">Ativa</option><option value="finished">Encerrada (só leitura)</option></select></label>
        </div>
        <label className="tw-field"><span>Frase de efeito</span><input className="tw-input" value={f.tagline || ''} onChange={e => setF({ ...f, tagline: e.target.value })} /></label>
        <label className="tw-field"><span>Descrição</span><textarea className="tw-input" value={f.description || ''} onChange={e => setF({ ...f, description: e.target.value })} /></label>
        <div className="tw-grid tw-grid-2">
          <label className="tw-field"><span>Local</span><input className="tw-input" value={f.venue || ''} onChange={e => setF({ ...f, venue: e.target.value })} /></label>
          <label className="tw-field"><span>Cidade</span><input className="tw-input" value={f.city || ''} onChange={e => setF({ ...f, city: e.target.value })} /></label>
        </div>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          {f.hero_image && <img src={f.hero_image} alt="" style={{ height: 80, borderRadius: 8 }} />}
          <label className="tw-btn tw-btn-sm">Imagem de capa<input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && upload(e.target.files[0])} /></label>
          <input className="tw-input" style={{ flex: 1, minWidth: 200 }} placeholder="ou URL da imagem" value={f.hero_image || ''} onChange={e => setF({ ...f, hero_image: e.target.value })} />
        </div>
      </div>

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Datas e dias</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>As missões de cada dia são liberadas à meia-noite da data.</p>
        <div className="tw-grid tw-grid-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="tw-stack" style={{ gap: 0 }}>
              <label className="tw-field"><span>Dia {i + 1}</span>
                <input className="tw-input" type="date" value={f.event_days[i] || ''} onChange={e => { const d = [...f.event_days]; d[i] = e.target.value; setF({ ...f, event_days: d }); }} />
              </label>
              <input className="tw-input" placeholder="Nome do dia" value={f.day_names[i + 1] || ''} onChange={e => setF({ ...f, day_names: { ...f.day_names, [i + 1]: e.target.value } })} />
            </div>
          ))}
        </div>
        <label className="tw-check"><input type="checkbox" checked={!!f.unlock_all} onChange={e => setF({ ...f, unlock_all: e.target.checked })} /><span>Liberar os 3 dias agora (para testes antes do evento — desligue depois).</span></label>
      </div>

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Parceiros desta campanha</h3>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          {Object.values(partners).map(p => (
            <label key={p.id} className="tw-check" style={{ padding: '0.5rem 0.75rem' }}>
              <input type="checkbox" checked={f.partners.includes(p.id)} onChange={() => togglePartner(p.id)} />
              <span style={{ color: p.color, fontWeight: 800 }}>{p.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Premiação</h3>
        <label className="tw-field"><span>Nome do grande prêmio</span><input className="tw-input" value={f.prize_title || ''} onChange={e => setF({ ...f, prize_title: e.target.value })} /></label>
        <label className="tw-field"><span>Itens (um por linha)</span><textarea className="tw-input" style={{ minHeight: 110 }} value={f.prizeText} onChange={e => setF({ ...f, prizeText: e.target.value })} /></label>
      </div>

      <MapEditor f={f} setF={setF} setMsg={setMsg} />

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Perfis que os tatuadores precisam seguir</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>Aparecem no passo 1 do Artist Challenge e como marcações obrigatórias nos posts. Confira o @ de cada um na aba Parceiros.</p>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          {Object.values(partners).map(p => {
            const on = (f.follow_partners || []).includes(p.id);
            return (
              <label key={p.id} className="tw-check" style={{ padding: '0.5rem 0.75rem' }}>
                <input type="checkbox" checked={on} onChange={() => setF(x => ({ ...x, follow_partners: on ? (x.follow_partners || []).filter(i => i !== p.id) : [...(x.follow_partners || []), p.id] }))} />
                <span><b style={{ color: p.color }}>{p.name}</b> {p.instagram ? <small>{p.instagram}</small> : <small style={{ color: '#fca5a5' }}>sem @</small>}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Cores da campanha</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>Usadas nas páginas da campanha, no telão, no vídeo e no card de resultado. O painel admin continua dourado.</p>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          {[['primary', 'Destaque / botões'], ['bg', 'Fundo'], ['card', 'Cartões'], ['card2', 'Cartões 2']].map(([k, label]) => (
            <label key={k} className="tw-row" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
              <input type="color" value={th[k]} onChange={e => setTheme(k === 'primary' ? { primary: e.target.value, primaryStrong: e.target.value, primaryDeep: e.target.value } : { [k]: e.target.value })} style={{ width: 40, height: 40, border: 0, background: 'none' }} /> {label}
            </label>
          ))}
          {[0, 1, 2].map(i => (
            <label key={i} className="tw-row" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
              <input type="color" value={th.accents[i] || th.primary} onChange={e => setAccent(i, e.target.value)} style={{ width: 40, height: 40, border: 0, background: 'none' }} /> Degradê {i + 1}
            </label>
          ))}
        </div>
        <div className="tw-row" style={{ flexWrap: 'wrap' }}>
          <button type="button" className="tw-btn tw-btn-sm" onClick={() => setF(x => ({ ...x, theme: PRESET_THEMES.tattooweek }))}>Paleta Tattoo Week</button>
          <button type="button" className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => setF(x => ({ ...x, theme: { ...DEFAULT_THEME } }))}>Dourado Mestres</button>
        </div>
        <div className="tw" style={{ ...themeStyle(th), minHeight: 0, padding: '1rem', paddingBottom: '1rem', borderRadius: 12 }}>
          <span className="tw-kicker">Prévia</span>
          <div style={{ height: 8, borderRadius: 99, margin: '0.6rem 0', background: `linear-gradient(90deg, ${(th.accents.length ? th.accents : [th.primary]).join(', ')}, ${th.primary})` }} />
          <div className="tw-card"><b className="tw-gold">Missão do dia</b><p className="tw-p" style={{ fontSize: '0.85rem' }}>Mostre você chegando ao evento</p><button type="button" className="tw-btn tw-btn-primary tw-btn-sm" style={{ marginTop: '0.5rem' }}>Enviar missão</button></div>
        </div>
      </div>

      <div className="tw-card tw-stack">
        <h3 className="tw-h3">Trilha do vídeo</h3>
        <p className="tw-p" style={{ fontSize: '0.85rem' }}>URL de um MP3 com licença para uso. Vazio = vídeo sem música.</p>
        <input className="tw-input" placeholder="https://...mp3" value={f.music_url || ''} onChange={e => setF({ ...f, music_url: e.target.value })} />
      </div>

      <div className="tw-row">
        <button className="tw-btn tw-btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Salvando...' : isNew ? 'Criar campanha' : 'Salvar'}</button>
        <span className="tw-gold">{msg}</span>
      </div>
    </form>
  );
}

// --- Parceiros ---

function Partners({ partners, reload }) {
  const [rows, setRows] = useState(() => Object.values(partners).map(p => ({ ...p })));
  const [msg, setMsg] = useState('');

  useEffect(() => { setRows(Object.values(partners).map(p => ({ ...p }))); }, [partners]);

  const set = (i, patch) => setRows(rs => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const save = async (r) => {
    const { created_at, ...row } = r;
    void created_at;
    const id = r.id || slugify(r.name);
    const { error } = await supabase.from('tw_partners').upsert({ ...row, id });
    setMsg(error ? error.message : `${r.name} salvo!`);
    if (!error) reload();
  };

  const uploadLogo = async (i, file) => {
    try {
      const m = await uploadMedia(file, 'partners');
      set(i, { logo_url: m.url });
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div className="tw-stack" style={{ maxWidth: 820 }}>
      <div className="tw-between">
        <h1 className="tw-h2">Parceiros</h1>
        <button className="tw-btn tw-btn-sm" onClick={() => setRows(rs => [...rs, { id: '', name: '', color: '#eec358', url: '', role: '', logo_url: '', active: true }])}><Plus size={14} /> Novo parceiro</button>
      </div>
      <p className="tw-p" style={{ fontSize: '0.85rem' }}>Os parceiros ficam disponíveis para todas as campanhas. Escolha quais participam de cada uma na aba Campanha.</p>
      {msg && <div className="tw-notice">{msg}</div>}
      {rows.map((r, i) => (
        <div key={r.id || `new-${i}`} className="tw-card tw-stack">
          <div className="tw-grid tw-grid-3">
            <input className="tw-input" placeholder="Nome" value={r.name} onChange={e => set(i, { name: e.target.value })} />
            <input className="tw-input" placeholder="Site (https://...)" value={r.url || ''} onChange={e => set(i, { url: e.target.value })} />
            <input className="tw-input" placeholder="@instagram" value={r.instagram || ''} onChange={e => set(i, { instagram: e.target.value })} />
            <div className="tw-row"><input type="color" value={r.color || '#eec358'} onChange={e => set(i, { color: e.target.value })} style={{ width: 46, height: 46, border: 0, background: 'none' }} /><span className="tw-p" style={{ fontSize: '0.8rem' }}>Cor</span></div>
          </div>
          <input className="tw-input" placeholder="Papel no desafio (ex.: Desafios técnicos e produtos para premiação)" value={r.role || ''} onChange={e => set(i, { role: e.target.value })} />
          <div className="tw-row" style={{ flexWrap: 'wrap' }}>
            {r.logo_url && <img src={r.logo_url} alt="" style={{ height: 36 }} />}
            <label className="tw-btn tw-btn-sm tw-btn-ghost">Logo<input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && uploadLogo(i, e.target.files[0])} /></label>
            <button className="tw-btn tw-btn-sm tw-btn-primary" onClick={() => save(r)} disabled={!r.name}><Save size={14} /> Salvar</button>
            {r.id && <span className="tw-chip">{r.id}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
