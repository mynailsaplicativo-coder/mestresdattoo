import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Award, Users, Video } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell } from './TwShell';
import { Char } from './TwArt';
import { useTwParticipant, useCampaign, todaySP } from './twData';

export function TwRanking() {
  const navigate = useNavigate();
  const { campaign } = useCampaign();
  const { participant } = useTwParticipant();
  const [track, setTrack] = useState('today');
  const [rows, setRows] = useState(null);

  useEffect(() => {
    // "Hoje" = ranking do dia (premiação diária), soma público + challenge
    const load = () => (track === 'today'
      ? supabase.from('tw_ranking_daily').select('*').eq('campaign_id', campaign.id).eq('track', 'artist').eq('day', todaySP())
      : supabase.from('tw_ranking').select('*').eq('campaign_id', campaign.id).eq('track', track))
      .order('points', { ascending: false }).order('last_at').limit(100)
      .then(({ data }) => setRows(data || []));
    setRows(null);
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [track, campaign.id]);

  return (
    <TwShell>
      <div className="tw-wrap" style={{ maxWidth: 640 }}>
        <span className="tw-kicker">{campaign.status === 'finished' ? 'Resultado final' : 'Ao vivo'}</span>
        <div className="tw-between" style={{ alignItems: 'flex-end' }}>
          <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem', fontSize: '2.4rem' }}>Ranking</h1>
          <Char name="gato" style={{ width: 88, marginBottom: '-4px' }} />
        </div>
        <div className="tw-tabs" style={{ marginBottom: '1rem' }}>
          <button className={`tw-tab ${track === 'today' ? 'on' : ''}`} onClick={() => setTrack('today')}>Hoje<small>tatuador do dia</small></button>
          <button className={`tw-tab ${track === 'artist' ? 'on' : ''}`} onClick={() => setTrack('artist')}>Artist Challenge</button>
          <button className={`tw-tab ${track === 'public' ? 'on' : ''}`} onClick={() => setTrack('public')}>Meu {campaign.event_name}</button>
        </div>
        {rows === null && <div className="tw-empty">Carregando...</div>}
        {rows?.length === 0 && <div className="tw-empty">Ninguém pontuou ainda. Seja o primeiro!</div>}
        <div className="tw-stack">
          {rows?.map((r, i) => (
            <button
              key={r.participant_id}
              className={`tw-rank ${i < 3 ? `top${i + 1}` : ''} ${participant?.id === r.participant_id ? 'me' : ''}`}
              style={{ width: '100%', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
              onClick={() => navigate(`/desafios/perfil/${r.participant_id}`)}
            >
              <span className="tw-rank-pos">{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div className="tw-p" style={{ fontSize: '0.78rem' }}>{[r.instagram, r.city].filter(Boolean).join(' · ')}{r.missions_done != null ? ` · ${r.missions_done} missões` : ''}</div>
              </div>
              <span className="tw-mission-pts" style={{ fontSize: '1.1rem' }}>{r.points}</span>
            </button>
          ))}
        </div>
        <p className="tw-p" style={{ fontSize: '0.78rem', marginTop: '1.25rem' }}>
          {track === 'today' && <><b style={{ color: 'var(--tw-text)' }}>O 1º tatuador de hoje leva o kit.</b> O ranking de hoje zera à meia-noite. </>}
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
              {(c.prize_items || []).map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        <div className="tw-grid tw-grid-2" style={{ marginTop: '0.75rem' }}>
          <div className="tw-card"><Users color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Tatuador do dia</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Todo dia, o tatuador com mais pontos no dia leva um kit. São 3 kits no evento.</p></div>
          <div className="tw-card"><Video color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Selos de escoteiro</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Cada missão cumprida vira um selo bordado na sua faixa. Colecione todos.</p></div>
        </div>

        <section className="tw-section tw-stack">
          <h2 className="tw-h3"><Award size={16} style={{ verticalAlign: -2 }} /> Regras</h2>
          <div className="tw-card tw-p" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Missões rápidas:</b> todas abertas durante o evento inteiro — venha 1 dia ou os 3. Fotos, vídeos curtos, prints e perguntas. Os pontos entram na hora.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Perguntas:</b> a resposta é conferida na hora. Errou? Investigue e tente de novo.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Selos secretos:</b> adesivos NFC escondidos no evento. Encostou o celular, ganhou o selo e os pontos.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Para tatuadores:</b> siga Bronc, TCM, Mestres da Tattoo, STENCILFLOW, Ink Authority e Tattoo Week, e poste cada missão no seu perfil marcando todos eles (o link do post vai junto).</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Artist Challenge:</b> aberto a todos os tatuadores do evento. O cadastro é feito no NFC do stand da Bronc.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Kit do dia:</b> 1 kit por dia para o tatuador com mais pontos naquele dia. Empate: vence quem chegou primeiro na pontuação.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: 'var(--tw-text)' }}>Validação:</b> a equipe revisa os envios. Registros fora do tema, repetidos ou de terceiros são recusados e perdem os pontos.</p>
            <p style={{ margin: 0 }}><b style={{ color: 'var(--tw-text)' }}>Participação privada:</b> quem escolhe não aparecer no ranking também não concorre aos prêmios do ranking.</p>
          </div>
          <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/ranking`)}>Ver ranking</button>
        </section>
      </div>
    </TwShell>
  );
}
