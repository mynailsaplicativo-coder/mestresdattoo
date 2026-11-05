import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { useCampaign, campaignTheme, themeStyle, todaySP } from './twData';

// Tela cheia para a TV do stand: rankings, números ao vivo, QR para entrar e fotos autorizadas
export default function TwTelao() {
  const { campaign, base } = useCampaign();
  const [d, setD] = useState(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [r, en, s, e, today] = await Promise.all([
        supabase.from('tw_ranking').select('participant_id, name, track, points').eq('campaign_id', campaign.id).order('points', { ascending: false }).order('last_at'),
        supabase.from('tw_enrollments').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id),
        supabase.from('tw_submissions').select('media, created_at, participant:tw_participants!inner(name, consent_marketing), mission:tw_missions!inner(campaign_id, title)')
          .eq('mission.campaign_id', campaign.id).eq('status', 'approved').eq('participant.consent_marketing', true)
          .order('created_at', { ascending: false }).limit(30),
        supabase.from('tw_events').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id).in('type', ['nfc_scan', 'qr_scan']),
        supabase.from('tw_ranking_daily').select('participant_id, name, points').eq('campaign_id', campaign.id).eq('day', todaySP()).order('points', { ascending: false }).order('last_at').limit(10),
      ]);
      const rows = r.data || [];
      const photos = (s.data || []).flatMap(x => (x.media || []).filter(m => m.type === 'image').map(m => ({ url: m.url, name: x.participant?.name, title: x.mission?.title })));
      const total = await supabase.from('tw_submissions').select('id, mission:tw_missions!inner(campaign_id)', { count: 'exact', head: true }).eq('mission.campaign_id', campaign.id).eq('status', 'approved');
      setD({
        artist: rows.filter(x => x.track === 'artist').slice(0, 10),
        today: today.data || [],
        people: en.count || 0,
        missions: total.count || 0,
        scans: e.count || 0,
        photos,
      });
    };
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [campaign.id]);

  useEffect(() => {
    const t = setInterval(() => setPhoto(p => p + 1), 6000);
    return () => clearInterval(t);
  }, []);

  const style = themeStyle(campaignTheme(campaign));
  if (!d) return <div className="tw-tv" style={style} />;
  const current = d.photos.length ? d.photos[photo % d.photos.length] : null;
  const joinUrl = `${window.location.origin}${base}`;

  const List = ({ title, rows }) => (
    <div>
      <h2>{title}</h2>
      {rows.length === 0 && <p className="tw-tv-empty">Aguardando os primeiros pontos…</p>}
      {rows.map((r, i) => (
        <div key={r.participant_id} className={`tw-tv-row ${i < 3 ? 'top' : ''}`}>
          <b>{i + 1}</b><span>{r.name}</span><em>{r.points}</em>
        </div>
      ))}
    </div>
  );

  return (
    <div className="tw-tv" style={style}>
      <header className="tw-tv-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img className="tw-tv-logo" src="/fotos artistas/logo mestres.png" alt="" />
          <div>
            <div className="tw-tv-kicker">AO VIVO</div>
            <div className="tw-tv-title">{campaign.name}</div>
          </div>
        </div>
        <div className="tw-tv-stats">
          <div><b>{d.people}</b><span>Participantes</span></div>
          <div><b>{d.missions}</b><span>Missões</span></div>
          <div><b>{d.scans}</b><span>Leituras NFC</span></div>
        </div>
      </header>

      <div className="tw-tv-cols">
        <List title="Artist Challenge" rows={d.artist} />
        <List title="Hoje · prêmio do dia" rows={d.today} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          {current
            ? <div style={{ position: 'relative' }}>
                <img className="tw-tv-photo" src={current.url} alt="" />
                <div className="tw-tv-caption">
                  <b>{current.name}</b><br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>{current.title}</span>
                </div>
              </div>
            : <div className="tw-tv-photo tw-tv-empty" style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: '1rem', maxHeight: 240 }}>Os melhores momentos aparecem aqui</div>}
        </div>
      </div>

      <footer className="tw-tv-foot">
        <div style={{ background: '#fff', padding: 6, borderRadius: 10, flex: '0 0 auto' }}><QRCodeSVG value={joinUrl} size={110} /></div>
        <div>
          <div className="tw-tv-cta">ENTRE NO JOGO</div>
          <div className="tw-tv-cta-sub">Aponte a câmera · {joinUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </footer>
    </div>
  );
}
