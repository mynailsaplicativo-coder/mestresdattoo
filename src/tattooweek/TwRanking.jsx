import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Award, Users, Video, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, KitCard } from './TwShell';
import { Char } from './TwArt';
import { useTwParticipant, useCampaign, loadArtistDaily, useLiveRefresh, eventDayNumber, kitItems, hasGift, KIT_IMAGE, PUBLIC_GIFT } from './twData';

const fmtDay = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export function TwRanking() {
  const navigate = useNavigate();
  const { campaign } = useCampaign();
  const { participant } = useTwParticipant();
  const [track, setTrack] = useState('today');
  const [rows, setRows] = useState(null);
  const [daily, setDaily] = useState(null);
  const [updated, setUpdated] = useState(null);

  // "Hoje" = ranking do dia do Artist Challenge (kit do dia). Atualiza ao vivo.
  const load = useCallback(async () => {
    if (track === 'today') {
      const d = await loadArtistDaily(campaign);
      setDaily(d);
      setRows(d.todayRows.slice(0, 100));
    } else {
      const { data } = await supabase.from('tw_ranking').select('*').eq('campaign_id', campaign.id).eq('track', track)
        .order('points', { ascending: false }).order('last_at').limit(100);
      setRows(data || []);
    }
    setUpdated(new Date());
  }, [track, campaign]);

  useEffect(() => { setRows(null); }, [track]);
  useLiveRefresh(`ranking-${track}`, load, 15000);

  const winners = daily ? Object.entries(daily.winners) : [];
  const dayNum = eventDayNumber(campaign);

  return (
    <TwShell>
      <div className="tw-wrap" style={{ maxWidth: 640 }}>
        <span className="tw-kicker">
          {campaign.status === 'finished' ? 'Resultado final' : <><span className="tw-live-dot" />Ao vivo{updated ? ` · atualizado ${updated.toLocaleTimeString('pt-BR')}` : ''}</>}
        </span>
        <div className="tw-between" style={{ alignItems: 'flex-end' }}>
          <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem', fontSize: '2.4rem' }}>Ranking</h1>
          <Char name="gato" style={{ width: 88, marginBottom: '-4px' }} />
        </div>
        <div className="tw-tabs" style={{ marginBottom: '1rem' }}>
          <button className={`tw-tab ${track === 'today' ? 'on' : ''}`} onClick={() => setTrack('today')}>Hoje<small>prêmio do dia</small></button>
          <button className={`tw-tab ${track === 'artist' ? 'on' : ''}`} onClick={() => setTrack('artist')}>Artist Challenge<small>total</small></button>
        </div>

        {track === 'today' && winners.length > 0 && (
          <div className="tw-stack" style={{ marginBottom: '1rem' }}>
            {winners.map(([day, w]) => (
              <div key={day} className="tw-card tw-card-gold tw-row" style={{ alignItems: 'center', gap: '0.75rem' }}>
                <Trophy color="var(--tw-gold)" size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="tw-kicker">Prêmio do dia {fmtDay(day)}</span>
                  <div style={{ fontWeight: 900 }}>{w.name} <span className="tw-p" style={{ fontWeight: 600 }}>{[w.instagram, `${w.points} pts`].filter(Boolean).join(' · ')}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {track === 'today' && daily && (
          <div style={{ marginBottom: '1rem' }}>
            <KitCard campaign={campaign} dayNum={dayNum} hasAllSeals={false} needSeals={daily.need} compact />
            {daily.leader && (
              <p className="tw-p" style={{ fontSize: '0.85rem', marginTop: '0.6rem' }}>
                🏆 Se o dia acabasse agora, o prêmio seria de <b style={{ color: 'var(--tw-text)' }}>{daily.leader.name}</b> ({daily.leader.points} pts).
              </p>
            )}
          </div>
        )}

        {rows === null && <div className="tw-empty">Carregando...</div>}
        {rows?.length === 0 && <div className="tw-empty">Ninguém pontuou ainda. Seja o primeiro!</div>}
        <div className="tw-stack">
          {rows?.map((r, i) => {
            const seals = track === 'today' && daily ? daily.sealsOf(r.participant_id) : null;
            const ok = seals != null && seals >= daily.need;
            const leader = track === 'today' && daily?.leader?.participant_id === r.participant_id;
            return (
              <button
                key={r.participant_id}
                className={`tw-rank ${i < 3 ? `top${i + 1}` : ''} ${participant?.id === r.participant_id ? 'me' : ''}`}
                style={{ width: '100%', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => navigate(`/desafios/perfil/${r.participant_id}`)}
              >
                <span className="tw-rank-pos">{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leader && '🏆 '}{r.name}</div>
                  <div className="tw-p" style={{ fontSize: '0.78rem' }}>{[r.instagram, r.city].filter(Boolean).join(' · ')}{r.missions_done != null ? ` · ${r.missions_done} missões` : ''}</div>
                </div>
                {seals != null && <span className={`tw-rank-seals ${ok ? 'ok' : ''}`} title="Selos secretos">{ok ? '✓ ' : ''}{seals}/{daily.need} selos</span>}
                <span className="tw-mission-pts" style={{ fontSize: '1.1rem' }}>{r.points}</span>
              </button>
            );
          })}
        </div>
        <p className="tw-p" style={{ fontSize: '0.78rem', marginTop: '1.25rem' }}>
          {track === 'today' && <><b style={{ color: 'var(--tw-text)' }}>Leva a impressora Bronc + 10 mil pontos no app E-Bronc o tatuador com mais pontos no dia que tiver todos os selos secretos.</b> O ranking de hoje zera à meia-noite e quem já ganhou não disputa de novo. </>}
          Empate: vence quem chegou primeiro na pontuação. Participantes privados não aparecem nem concorrem.
        </p>
      </div>
    </TwShell>
  );
}

export function TwPrizes() {
  const navigate = useNavigate();
  const { campaign: c, base } = useCampaign();
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!c.awards_published) return;
    supabase.from('tw_awards').select('id, title, description, status, participant:tw_participants(id, name, instagram, photo_url)')
      .eq('campaign_id', c.id).neq('status', 'open').order('position')
      .then(({ data }) => setWinners((data || []).filter(w => w.participant)));
  }, [c.id, c.awards_published]);

  return (
    <TwShell>
      <div className="tw-wrap" style={{ maxWidth: 760 }}>
        <span className="tw-kicker">Premiação</span>
        <h1 className="tw-h2" style={{ margin: '0.3rem 0 1.25rem' }}>{winners.length ? 'Vencedores' : 'Prêmios e regras'}</h1>

        {winners.length > 0 && (
          <div className="tw-stack" style={{ marginBottom: '1.5rem' }}>
            {winners.map(w => (
              <button key={w.id} className="tw-card tw-card-gold tw-history" style={{ width: '100%', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(`/desafios/perfil/${w.participant.id}`)}>
                <div className="tw-avatar" style={{ width: 64, height: 64, flex: '0 0 64px', fontSize: '1.4rem' }}>{w.participant.photo_url ? <img src={w.participant.photo_url} alt="" /> : w.participant.name.slice(0, 1)}</div>
                <div>
                  <span className="tw-kicker">🏆 {w.title}</span>
                  <h3 className="tw-h3" style={{ margin: '0.2rem 0' }}>{w.participant.name}</h3>
                  <div className="tw-p" style={{ fontSize: '0.82rem' }}>{[w.participant.instagram, w.description].filter(Boolean).join(' · ')}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {c.prize_title && (
          <div className="tw-card tw-card-gold">
            <Gift color="var(--tw-gold)" size={36} />
            <span className="tw-kicker" style={{ display: 'block', marginTop: '0.6rem' }}>Premiação</span>
            <h2 className="tw-h2" style={{ margin: '0.3rem 0 0.8rem' }}>{c.prize_title}</h2>
            <ul className="tw-p" style={{ paddingLeft: '1.1rem', lineHeight: 1.9, margin: 0 }}>
              {kitItems(c).map(item => <li key={item}>{item}</li>)}
            </ul>
            {hasGift(c) && <img className="tw-kit-photo" src={KIT_IMAGE} alt="Impressora de stencil Bronc" loading="lazy" />}
          </div>
        )}

        <div className="tw-grid tw-grid-2" style={{ marginTop: '0.75rem' }}>
          <div className="tw-card"><Users color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Tatuador do dia</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Todo dia, o tatuador com mais pontos no dia que tiver todos os selos secretos leva 1 impressora de stencil Bronc + 10 mil pontos de crédito no app E-Bronc. São 3 prêmios (1 por dia) e cada tatuador ganha no máximo 1.</p></div>
          {hasGift(c) ? (
            <div className="tw-card">
              <Gift color="var(--tw-gold)" />
              <h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>{PUBLIC_GIFT.title} · público</h3>
              <p className="tw-p" style={{ fontSize: '0.88rem' }}>{PUBLIC_GIFT.total} chaveiros. Um dos selos secretos escondidos no evento é o selo premiado: quem do público encostar o celular nele ganha o chaveiro na hora. Retire no stand da Bronc, enquanto durar.</p>
              <img className="tw-kit-photo" src={PUBLIC_GIFT.image} alt={PUBLIC_GIFT.title} loading="lazy" style={{ maxHeight: 180 }} />
            </div>
          ) : (
            <div className="tw-card"><Video color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Selos de escoteiro</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Cada missão cumprida vira um selo bordado na sua faixa. Colecione todos.</p></div>
          )}
        </div>

        <section className="tw-section tw-stack">
          <h2 className="tw-h3"><Award size={16} style={{ verticalAlign: -2 }} /> Regras</h2>
          <div className="tw-card tw-p" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Missões rápidas:</b> venha 1 dia ou os 3. No Artist Challenge as missões valem de novo a cada dia (e podem surgir missões novas no dia). Fotos, vídeos curtos, prints e perguntas. Os pontos entram na hora.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Perguntas:</b> a resposta é conferida na hora. Errou? Investigue e tente de novo.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Selos secretos:</b> adesivos NFC escondidos no evento. Encostou o celular, ganhou o selo e os pontos.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Para tatuadores:</b> siga Bronc, TCM, Mestres da Tattoo, STENCILFLOW, Ink Authority e Tattoo Week, e poste cada missão no seu perfil marcando todos eles (o link do post vai junto).</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Artist Challenge:</b> aberto a todos os tatuadores do evento. O cadastro é feito no NFC do stand da Bronc.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Prêmio do dia:</b> 1 impressora de stencil Bronc + 10 mil pontos de crédito no app E-Bronc por dia para o tatuador com mais pontos naquele dia, desde que tenha os 6 selos secretos. São 5 missões por dia (1 de parceiro) e o ranking zera todo dia. Quem ganhou não disputa os dias seguintes. Empate: vence quem chegou primeiro na pontuação.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Validação:</b> a equipe revisa os envios. Registros fora do tema, repetidos ou de terceiros são recusados e perdem os pontos.</p>
            <p style={{ margin: 0 }}><b style={{ color: 'var(--tw-text)' }}>Participação privada:</b> quem escolhe não aparecer no ranking também não concorre aos prêmios do ranking.</p>
          </div>
          <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/ranking`)}>Ver ranking</button>
        </section>
      </div>
    </TwShell>
  );
}
