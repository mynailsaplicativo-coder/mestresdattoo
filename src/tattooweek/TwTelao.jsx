import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { useCampaign } from './twData';

// Tela cheia para a TV do stand: rankings, números ao vivo, QR para entrar e fotos autorizadas
export default function TwTelao() {
  const { campaign, base } = useCampaign();
  const [d, setD] = useState(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [r, en, s, e] = await Promise.all([
        supabase.from('tw_ranking').select('participant_id, name, track, points').eq('campaign_id', campaign.id).order('points', { ascending: false }).order('last_at'),
        supabase.from('tw_enrollments').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id),
        supabase.from('tw_submissions').select('media, created_at, participant:tw_participants!inner(name, consent_marketing), mission:tw_missions!inner(campaign_id, title)')
          .eq('mission.campaign_id', campaign.id).eq('status', 'approved').eq('participant.consent_marketing', true)
          .order('created_at', { ascending: false }).limit(30),
        supabase.from('tw_events').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id).in('type', ['nfc_scan', 'qr_scan']),
      ]);
      const rows = r.data || [];
      const photos = (s.data || []).flatMap(x => (x.media || []).filter(m => m.type === 'image').map(m => ({ url: m.url, name: x.participant?.name, title: x.mission?.title })));
      const total = await supabase.from('tw_submissions').select('id, mission:tw_missions!inner(campaign_id)', { count: 'exact', head: true }).eq('mission.campaign_id', campaign.id).eq('status', 'approved');
      setD({
        artist: rows.filter(x => x.track === 'artist').slice(0, 10),
        public: rows.filter(x => x.track === 'public').slice(0, 10),
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

  if (!d) return <div className="tw-tv" />;
  const current = d.photos.length ? d.photos[photo % d.photos.length] : null;
  const joinUrl = `${window.location.origin}${base}`;

  const List = ({ title, rows }) => (
    <div>
      <h2>{title}</h2>
      {rows.length === 0 && <p style={{ fontSize: '1.3vw', color: 'rgba(255,255,255,0.5)' }}>Aguardando os primeiros pontos…</p>}
      {rows.map((r, i) => (
        <div key={r.participant_id} className={`tw-tv-row ${i < 3 ? 'top' : ''}`}>
          <b>{i + 1}</b><span>{r.name}</span><em>{r.points}</em>
        </div>
      ))}
    </div>
  );

  return (
    <div className="tw-tv">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
          <img src="/fotos artistas/logo mestres.png" alt="" style={{ height: '7vh' }} />
          <div>
            <div style={{ fontSize: '1vw', letterSpacing: 3, color: '#eec358', fontWeight: 900 }}>AO VIVO</div>
            <div style={{ fontSize: '2.6vw', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>{campaign.name}</div>
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
        <List title={`Meu ${campaign.event_name || 'evento'}`} rows={d.public} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          {current
            ? <div style={{ position: 'relative' }}>
                <img className="tw-tv-photo" src={current.url} alt="" />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.5vh 1vw', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', borderRadius: '0 0 1vw 1vw', fontSize: '1.1vw' }}>
                  <b>{current.name}</b><br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>{current.title}</span>
                </div>
              </div>
            : <div className="tw-tv-photo" style={{ display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '1.3vw' }}>Os melhores momentos aparecem aqui</div>}
        </div>
      </div>

      <footer style={{ display: 'flex', alignItems: 'center', gap: '1.5vw', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '0.8vh', borderRadius: '0.8vw' }}><QRCodeSVG value={joinUrl} size={110} /></div>
        <div>
          <div style={{ fontSize: '2vw', fontWeight: 900 }}>ENTRE NO JOGO</div>
          <div style={{ fontSize: '1.2vw', color: 'rgba(255,255,255,0.7)' }}>Aponte a câmera · {joinUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </footer>
    </div>
  );
}
