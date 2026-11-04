import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Award, Users, Video } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell } from './TwShell';
import { useTwParticipant, useCampaign, DAY_BONUS } from './twData';

export function TwRanking() {
  const navigate = useNavigate();
  const { campaign } = useCampaign();
  const { participant } = useTwParticipant();
  const [track, setTrack] = useState('artist');
  const [rows, setRows] = useState(null);

  useEffect(() => {
    const load = () => supabase.from('tw_ranking').select('*').eq('campaign_id', campaign.id).eq('track', track)
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
        <h1 className="tw-h2" style={{ margin: '0.3rem 0 1rem' }}>Ranking</h1>
        <div className="tw-tabs" style={{ marginBottom: '1rem' }}>
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
              onClick={() => navigate(`/experience/perfil/${r.participant_id}`)}
            >
              <span className="tw-rank-pos">{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div className="tw-p" style={{ fontSize: '0.78rem' }}>{[r.instagram, r.city].filter(Boolean).join(' · ')} · {r.missions_done} missões</div>
              </div>
              <span className="tw-mission-pts" style={{ fontSize: '1.1rem' }}>{r.points}</span>
            </button>
          ))}
        </div>
        <p className="tw-p" style={{ fontSize: '0.78rem', marginTop: '1.25rem' }}>
          Contam só missões aprovadas. Empate: vence quem atingiu a pontuação primeiro. Participantes privados não aparecem aqui.
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
              <button key={w.id} className="tw-card tw-card-gold tw-history" style={{ width: '100%', color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(`/experience/perfil/${w.participant.id}`)}>
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
            <span className="tw-kicker" style={{ display: 'block', marginTop: '0.6rem' }}>Grande prêmio · 1º lugar Artist Challenge</span>
            <h2 className="tw-h2" style={{ margin: '0.3rem 0 0.8rem' }}>{c.prize_title}</h2>
            <ul className="tw-p" style={{ paddingLeft: '1.1rem', lineHeight: 1.9, margin: 0 }}>
              {(c.prize_items || []).map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        <div className="tw-grid tw-grid-2" style={{ marginTop: '0.75rem' }}>
          <div className="tw-card"><Users color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Artista mais conectado</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Mais carimbos aprovados no Passaporte NFC.</p></div>
          <div className="tw-card"><Video color="var(--tw-gold)" /><h3 className="tw-h3" style={{ margin: '0.5rem 0 0.3rem' }}>Melhor conteúdo</h3><p className="tw-p" style={{ fontSize: '0.88rem' }}>Escolhido pela curadoria do Mestres entre as missões de conteúdo.</p></div>
        </div>

        <section className="tw-section tw-stack">
          <h2 className="tw-h3"><Award size={16} style={{ verticalAlign: -2 }} /> Regras</h2>
          <div className="tw-card tw-p" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>Meu {c.event_name} (público):</b> 10 missões por dia. Missão de 1 registro = 10 pts, de 3 registros = 20 pts. Completar as 10 do dia = +{DAY_BONUS} pts. A recompensa principal é o seu vídeo.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>Artist Challenge (tatuadores):</b> missões de networking, conteúdo, parceiros, passaporte NFC, surpresas e secretas. Os pontos entram na hora e a equipe revisa os envios — o que não cumprir a missão é recusado e perde os pontos.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>Validação:</b> só contam registros feitos durante o evento, com a pessoa participante e o que a missão pede. Envios repetidos, de terceiros ou fora do tema são recusados.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>NFC:</b> ler uma credencial não conta pontos sozinho. O carimbo exige uma foto com o artista.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>Selos:</b> conquistas automáticas por dias completos, carimbos, missões surpresa, secretas e pódio. Ficam no seu perfil para sempre.</p>
            <p style={{ margin: '0 0 0.8rem' }}><b style={{ color: '#fff' }}>Desempate:</b> vence quem atingiu a pontuação primeiro.</p>
            <p style={{ margin: 0 }}><b style={{ color: '#fff' }}>Resultado:</b> fechamento dos pontos e premiação no último dia. Vencedores anunciados no evento e nas redes do Mestres da Tattoo.</p>
          </div>
          <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/ranking`)}>Ver ranking</button>
        </section>
      </div>
    </TwShell>
  );
}
