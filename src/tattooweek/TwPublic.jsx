import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Film, Share2, HelpCircle, Nfc, Gift, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, JoinGate, MissionSheet, SurpriseCard, SealStrip, NickEditor } from './TwShell';
import { useTwParticipant, useCampaign, loadAdjustments, sealItems, isMissionLive, PUBLIC_GIFT, hasGift, giftStatus, giftCode, useLiveRefresh } from './twData';

import { PatchSash, Char } from './TwArt';

// Missões normais da lista (as outras têm seção própria)
const LIST_CATEGORIES = ['geral', 'quiz', 'parceiros', 'dia', 'networking', 'conteudo'];

export default function TwPublic() {
  const tw = useTwParticipant();
  return (
    <TwShell>
      <JoinGate tw={tw} track="public">
        <PublicPanel participant={tw.participant} setParticipantFn={tw.setParticipant} />
      </JoinGate>
    </TwShell>
  );
}

function PublicPanel({ participant, setParticipantFn }) {
  const navigate = useNavigate();
  const { campaign, partners, base } = useCampaign();
  const [missions, setMissions] = useState(null);
  const [tags, setTags] = useState([]);
  const [subs, setSubs] = useState([]);
  const [, setAdj] = useState({ public: 0, artist: 0 });
  const [open, setOpen] = useState(null);
  const [gift, setGift] = useState(null);

  const load = useCallback(async () => {
    const [m, t, s, a] = await Promise.all([
      supabase.from('tw_missions').select('*').eq('campaign_id', campaign.id).eq('track', 'public').eq('active', true).order('position'),
      supabase.from('tw_artists').select('id, slug, name, kind, seal_icon').eq('campaign_id', campaign.id).eq('active', true).order('slug'),
      supabase.from('tw_submissions').select('*, mission:tw_missions!inner(*)').eq('participant_id', participant.id).eq('mission.campaign_id', campaign.id),
      loadAdjustments(participant.id, campaign.id),
    ]);
    if (hasGift(campaign)) giftStatus(campaign.id, participant.id).then(setGift).catch(() => {});
    setMissions(m.data || []);
    setTags(t.data || []);
    setSubs(s.data || []);
    setAdj(a);
  }, [participant.id, campaign]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao vivo: envios novos, selos guardados e missões surpresa aparecem sem recarregar
  useLiveRefresh(`public-${participant.id}`, load, 60000);

  if (!missions) return <div className="tw-center-screen">Carregando missões...</div>;

  const subByMission = Object.fromEntries(subs.filter(s => !s.artist_id).map(s => [s.mission_id, s]));
  const list = missions.filter(m => !m.hidden && LIST_CATEGORIES.includes(m.category));
  const surprises = missions.filter(m => m.category === 'surpresa' && isMissionLive(m));
  const approved = subs.filter(s => s.status === 'approved' && s.mission?.track === 'public');
  const seals = tags.filter(t => t.kind === 'secret');
  const points = tags.filter(t => (t.kind || 'point') === 'point');
  const foundSeals = new Set(approved.filter(s => s.mission?.category === 'selo').map(s => s.artist_id));
  const foundPoints = new Set(approved.filter(s => s.mission?.category === 'passaporte').map(s => s.artist_id));
  const done = list.filter(m => subByMission[m.id]?.status === 'approved').length;
  const clips = approved.reduce((acc, s) => acc + (s.media?.length || 0), 0);
  const seals_ = sealItems(missions, approved);
  const finished = campaign.status === 'finished';

  return (
    <div className="tw-wrap">
      <div className="tw-between" style={{ alignItems: 'flex-end' }}>
        <div>
          <span className="tw-kicker">Meu {campaign.event_name}</span>
          <h1 className="tw-h2" style={{ margin: '0.3rem 0 0.4rem', fontSize: '2.2rem' }}>Bora, {participant.nickname || participant.name.split(' ')[0]}!</h1>
          <NickEditor participant={participant} setParticipant={setParticipantFn} />
        </div>
        <Char name="oni" style={{ width: 96, marginBottom: '-6px' }} />
      </div>

      <div className="tw-card tw-card-gold">
        <div className="tw-grid tw-stats-4">
          <div className="tw-stat"><b>{done}/{list.length}</b><span>Missões</span></div>
          <div className="tw-stat"><b>{clips}</b><span>Fotos e vídeos</span></div>
          <div className="tw-stat"><b>{foundSeals.size}/{seals.length}</b><span>Selos secretos</span></div>
          <div className="tw-stat"><b>{seals_.filter(x => x.earned).length}</b><span>Selos bordados</span></div>
        </div>
        <div className="tw-progress" style={{ marginTop: '1rem' }}><div style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} /></div>
        <p className="tw-p" style={{ fontSize: '0.78rem', marginTop: '0.6rem' }}>Aqui não tem ranking: cada missão é um momento do seu vídeo da Tattoo Week e vira um selo bordado na sua faixa. No fim, é só gerar o vídeo!</p>
      </div>

      {hasGift(campaign) && <GiftCard participant={participant} gift={gift} />}

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
                <span className="tw-mission-num">{ok ? <Check size={18} /> : m.category === 'quiz' ? <HelpCircle size={18} /> : <Camera size={18} />}</span>
                <span className="tw-mission-body">
                  <span className="tw-mission-title">{m.title}</span>
                  <span className="tw-mission-meta">
                    {m.category === 'quiz' && <span className="tw-chip tw-chip-quiz">Pergunta</span>}
                    {partner && <span className="tw-chip" style={{ color: partner.color, borderColor: partner.color }}>{partner.name}</span>}
                    {s?.status === 'rejected' && <span className="tw-chip tw-chip-bad">Recusada · envie de novo</span>}
                  </span>
                </span>
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
            {hasGift(campaign) && <span className="tw-chip tw-chip-gold">Um deles dá chaveiro Bronc</span>}
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
        <div className="tw-between" style={{ marginBottom: '0.8rem' }}>
          <span className="tw-kicker">Sua faixa de selos</span>
          <span className="tw-chip tw-chip-gold">{seals_.filter(x => x.earned).length}/{seals_.length}</span>
        </div>
        <div className="tw-sash-banner"><PatchSash items={seals_} /></div>
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

// Brinde do público: um dos selos secretos é o selo premiado do chaveiro Bronc
function GiftCard({ participant, gift }) {
  return (
    <div className="tw-card tw-card-gold" style={{ marginTop: '1rem' }}>
      <div className="tw-gift">
        <img src={PUBLIC_GIFT.image} alt={PUBLIC_GIFT.title} loading="lazy" />
        <div>
          <span className="tw-kicker"><Gift size={12} style={{ verticalAlign: -1 }} /> Selo premiado{gift ? ` · restam ${gift.left} de ${PUBLIC_GIFT.total}` : ''}</span>
          <h3 className="tw-h3" style={{ margin: '0.25rem 0' }}>{PUBLIC_GIFT.title}</h3>
          {gift?.mine ? (
            <>
              <p className="tw-p" style={{ fontSize: '0.85rem' }}>Você achou o selo premiado! Mostre esta tela no stand da Bronc para retirar.</p>
              <span className="tw-gift-code">{giftCode(participant.id)}</span>
              <p className="tw-p" style={{ fontSize: '0.75rem' }}>{participant.name}{participant.nickname ? ` · ${participant.nickname}` : ''}</p>
            </>
          ) : gift && gift.left <= 0 ? (
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>Os {PUBLIC_GIFT.total} chaveiros já acabaram. Valeu por jogar!</p>
          ) : (
            <p className="tw-p" style={{ fontSize: '0.85rem' }}>Um dos selos secretos escondidos no evento é o <b style={{ color: 'var(--tw-text)' }}>selo premiado</b>. Encoste o celular nos adesivos dourados: quem achar o certo ganha o chaveiro na hora, enquanto durar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
