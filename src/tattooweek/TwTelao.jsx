import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { useCampaign, campaignTheme, themeStyle, loadArtistDaily, useLiveRefresh, hasGift, giftStatus, PUBLIC_GIFT, KIT_IMAGE, eventDayNumber } from './twData';
import { Char, Cloud, Sparkle } from './TwArt';
import './tattooweek.css';
import './poster.css';

// Tela cheia para a TV do stand: rankings ao vivo, prêmios, QR para entrar e fotos autorizadas
export default function TwTelao() {
  const { campaign, base } = useCampaign();
  const [d, setD] = useState(null);
  const [photo, setPhoto] = useState(0);

  const load = useCallback(async () => {
    const [r, en, s, e, today, gift] = await Promise.all([
      supabase.from('tw_ranking').select('participant_id, name, track, points').eq('campaign_id', campaign.id).order('points', { ascending: false }).order('last_at'),
      supabase.from('tw_enrollments').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id),
      supabase.from('tw_submissions').select('media, created_at, participant:tw_participants!inner(name, consent_marketing), mission:tw_missions!inner(campaign_id, title)')
        .eq('mission.campaign_id', campaign.id).eq('status', 'approved').eq('participant.consent_marketing', true)
        .order('created_at', { ascending: false }).limit(30),
      supabase.from('tw_events').select('id', { count: 'exact', head: true }).eq('campaign_id', campaign.id).in('type', ['nfc_scan', 'qr_scan']),
      loadArtistDaily(campaign),
      hasGift(campaign) ? giftStatus(campaign.id) : Promise.resolve(null),
    ]);
    const rows = r.data || [];
    const photos = (s.data || []).flatMap(x => (x.media || []).filter(m => m.type === 'image').map(m => ({ url: m.url, name: x.participant?.name, title: x.mission?.title })));
    const total = await supabase.from('tw_submissions').select('id, mission:tw_missions!inner(campaign_id)', { count: 'exact', head: true }).eq('mission.campaign_id', campaign.id).eq('status', 'approved');
    setD({
      artist: rows.filter(x => x.track === 'artist').slice(0, 8),
      today: today.todayRows.slice(0, 8).map(x => ({ ...x, seals: today.sealsOf(x.participant_id), need: today.need, leader: today.leader?.participant_id === x.participant_id })),
      people: en.count || 0,
      missions: total.count || 0,
      scans: e.count || 0,
      gift,
      photos,
    });
  }, [campaign]);
  useLiveRefresh('telao', load, 20000);

  useEffect(() => {
    const t = setInterval(() => setPhoto(p => p + 1), 6000);
    return () => clearInterval(t);
  }, []);

  const theme = campaignTheme(campaign);
  const poster = theme?.style === 'poster';
  const rootClass = `tw-tv ${poster ? 'tw tw-poster tw-tv-poster' : ''}`;
  const style = poster ? undefined : themeStyle(theme);
  if (!d) return <div className={rootClass} style={style} />;
  const current = d.photos.length ? d.photos[photo % d.photos.length] : null;
  const joinUrl = `${window.location.origin}${base}`;
  const dayNum = eventDayNumber(campaign);

  const List = ({ title, sub, rows, seals }) => (
    <div className="tw-tv-panel">
      <h2>{title}</h2>
      {sub && <p className="tw-tv-sub">{sub}</p>}
      {rows.length === 0 && <p className="tw-tv-empty">Aguardando os primeiros pontos…</p>}
      {rows.map((r, i) => (
        <div key={r.participant_id} className={`tw-tv-row ${i < 3 ? `top top${i + 1}` : ''}`}>
          <b>{i + 1}</b>
          <span>{r.leader && '🏆 '}{r.name}</span>
          {seals && <small className={`tw-tv-seals ${r.seals >= r.need ? 'ok' : ''}`}>{r.seals}/{r.need} selos</small>}
          <em>{r.points}</em>
        </div>
      ))}
    </div>
  );

  return (
    <div className={rootClass} style={style}>
      {poster && (
        <div className="tw-tv-deco" aria-hidden="true">
          <Cloud className="tw-tv-cloud c1" />
          <Cloud className="tw-tv-cloud c2" />
          <Sparkle className="tw-tv-spark s1" />
          <Sparkle className="tw-tv-spark s2" />
          <Char name="oni" className="tw-tv-char oni" />
          <Char name="dragao" className="tw-tv-char dragao" />
        </div>
      )}

      <header className="tw-tv-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          <img className="tw-tv-logo" src="/fotos artistas/logo mestres.png" alt="" />
          <div>
            <div className="tw-tv-kicker"><span className="tw-live-dot" />AO VIVO · {campaign.event_name}{dayNum ? ` · DIA ${dayNum}` : ''}</div>
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
        <List title="Prêmio do dia" sub="Tatuador nº 1 de hoje com os 5 selos secretos" rows={d.today} seals />
        <List title="Artist Challenge" sub="Ranking geral do evento" rows={d.artist} />
        <div className="tw-tv-side">
          {current
            ? (
              <div className="tw-tv-polaroid">
                <img className="tw-tv-photo" src={current.url} alt="" />
                <div className="tw-tv-caption"><b>{current.name}</b><br /><span>{current.title}</span></div>
              </div>
            )
            : <div className="tw-tv-photo tw-tv-empty tw-tv-photo-empty">Os melhores momentos aparecem aqui</div>}
          {hasGift(campaign) && (
            <div className="tw-tv-prizes">
              <div className="tw-tv-prize">
                <img src={KIT_IMAGE} alt="" />
                <div><small>Tatuadores · 1 por dia</small><b>Impressora Bronc</b><em>+ 10 mil pts E-Bronc</em></div>
              </div>
              <div className="tw-tv-prize">
                <img src={PUBLIC_GIFT.image} alt="" />
                <div><small>Público · selo premiado</small><b>Chaveiro Bronc</b><em>{d.gift ? `restam ${d.gift.left}/${PUBLIC_GIFT.total}` : ''}</em></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="tw-tv-foot">
        <div className="tw-tv-qr"><QRCodeSVG value={joinUrl} size={120} /></div>
        <div>
          <div className="tw-tv-cta">ENTRE NO JOGO</div>
          <div className="tw-tv-cta-sub">Aponte a câmera · {joinUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </footer>
    </div>
  );
}
