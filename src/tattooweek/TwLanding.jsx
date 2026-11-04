import { useNavigate } from 'react-router-dom';
import { Camera, Swords, Nfc, Film, Trophy, Gift, MapPin, CalendarDays } from 'lucide-react';
import { TwShell, PartnerStrip } from './TwShell';
import { useCampaign, campaignPartners, trackEvent, formatDays } from './twData';

export default function TwLanding() {
  const navigate = useNavigate();
  const { campaign: c, partners, base } = useCampaign();
  const list = campaignPartners(c, partners).filter(p => p.id !== 'mestres');
  const words = c.name.split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const taglineParts = (c.tagline || '').split(/(?<=\.)\s+/).filter(Boolean);
  const eventLabel = c.event_name || 'evento';

  return (
    <TwShell>
      <section className="tw-hero">
        {c.hero_image && <div className="tw-hero-bg" style={{ backgroundImage: `url('${c.hero_image}')` }} />}
        <div className="tw-hero-inner">
          <span className="tw-kicker">Uma realização Mestres da Tattoo</span>
          <h1 className="tw-h1">{words.join(' ')}{lastWord && <><br /><span className="tw-gold">{lastWord}</span></>}</h1>
          {taglineParts.length > 0 && <div className="tw-tagline">{taglineParts.map(t => <span key={t}>{t}</span>)}</div>}
          <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.5rem 1.25rem', color: 'var(--tw-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {formatDays(c) && <span><CalendarDays size={14} style={{ verticalAlign: -2 }} /> {formatDays(c)}</span>}
            {(c.venue || c.city) && <span><MapPin size={14} style={{ verticalAlign: -2 }} /> {[c.venue, c.city].filter(Boolean).join(' · ')}</span>}
            {c.status === 'finished' && <span className="tw-chip tw-chip-gold">Encerrada</span>}
            {c.status === 'draft' && <span className="tw-chip">Em breve</span>}
          </div>
          {c.description && <p className="tw-p" style={{ maxWidth: 560, marginBottom: '1.75rem', fontSize: '1.05rem' }}>{c.description}</p>}
          <div className="tw-cta-row" style={{ maxWidth: 620 }}>
            <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/meu`)}><Camera size={18} /> Sou visitante</button>
            <button className="tw-btn" onClick={() => navigate(`${base}/artist`)}><Swords size={18} /> Sou tatuador</button>
          </div>
          {list.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <span className="tw-kicker" style={{ color: 'var(--tw-muted)', fontSize: '0.62rem' }}>Parceiros</span>
              <div style={{ marginTop: '0.5rem' }}><PartnerStrip list={list} /></div>
            </div>
          )}
        </div>
      </section>

      <div className="tw-wrap">
        <div className="tw-grid tw-grid-2">
          <article className="tw-card tw-card-gold tw-exp">
            <span className="tw-exp-letter">A</span>
            <span className="tw-kicker">Experiência A · Público</span>
            <h2 className="tw-h2" style={{ marginTop: '0.4rem' }}>Meu {eventLabel}</h2>
            <p className="tw-p">10 missões por dia, 30 no total. Registre seus momentos com fotos e vídeos, ganhe selos e receba no final uma retrospectiva em vídeo só sua.</p>
            <button className="tw-btn tw-btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick={() => navigate(`${base}/meu`)}>Participar</button>
          </article>
          <article className="tw-card tw-exp">
            <span className="tw-exp-letter">B</span>
            <span className="tw-kicker">Experiência B · Tatuadores</span>
            <h2 className="tw-h2" style={{ marginTop: '0.4rem' }}>Artist Challenge</h2>
            <p className="tw-p">Competição de networking, conteúdo e desafios dos parceiros. Artistas carregam credenciais NFC secretas — encontre todos e complete seu passaporte.</p>
            <button className="tw-btn" style={{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick={() => navigate(`${base}/artist`)}>Entrar na competição</button>
          </article>
        </div>

        <section className="tw-section">
          <span className="tw-kicker">Como funciona</span>
          <h2 className="tw-h2" style={{ margin: '0.4rem 0 1rem' }}>Simples assim</h2>
          <div className="tw-steps">
            <div className="tw-step">Entre com seu e-mail e faça um cadastro rápido.</div>
            <div className="tw-step">Todo dia, 10 novas missões são liberadas.</div>
            <div className="tw-step">Envie fotos ou vídeos para cumprir cada missão.</div>
            <div className="tw-step">No final, assista e compartilhe o seu vídeo.</div>
          </div>
        </section>

        <section className="tw-section tw-grid tw-grid-3">
          <div className="tw-card">
            <Nfc color="var(--tw-gold)" />
            <h3 className="tw-h3" style={{ margin: '0.6rem 0 0.3rem' }}>Credenciais NFC</h3>
            <p className="tw-p" style={{ fontSize: '0.9rem' }}>Aproxime o celular da credencial de um artista participante (ou leia o QR Code) para abrir o perfil e a missão dele.</p>
          </div>
          <div className="tw-card">
            <Film color="var(--tw-gold)" />
            <h3 className="tw-h3" style={{ margin: '0.6rem 0 0.3rem' }}>Seu vídeo e seus selos</h3>
            <p className="tw-p" style={{ fontSize: '0.9rem' }}>Os registros viram uma retrospectiva vertical e um card de resultado para o Stories. Uma lembrança, não uma propaganda.</p>
          </div>
          <div className="tw-card">
            <Trophy color="var(--tw-gold)" />
            <h3 className="tw-h3" style={{ margin: '0.6rem 0 0.3rem' }}>Ranking e missões surpresa</h3>
            <p className="tw-p" style={{ fontSize: '0.9rem' }}>Ao longo dos dias, missões relâmpago aparecem com tempo contado. Fique de olho.</p>
          </div>
        </section>

        {c.prize_title && (
          <section className="tw-section">
            <div className="tw-card tw-card-gold" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Gift size={40} color="var(--tw-gold)" />
              <div style={{ flex: '1 1 260px' }}>
                <span className="tw-kicker">Grande prêmio do Artist Challenge</span>
                <h2 className="tw-h2" style={{ margin: '0.3rem 0' }}>{c.prize_title}</h2>
                <p className="tw-p">{(c.prize_items || []).join(' + ')}</p>
              </div>
              <button className="tw-btn" onClick={() => navigate(`${base}/premiacao`)}>Regras e prêmios</button>
            </div>
          </section>
        )}

        {list.length > 0 && (
          <section className="tw-section">
            <span className="tw-kicker">Quem faz acontecer</span>
            <div className="tw-grid tw-grid-3" style={{ marginTop: '0.8rem' }}>
              {list.map(p => (
                <div key={p.id} className="tw-card">
                  {p.logo_url && <img src={p.logo_url} alt={p.name} style={{ height: 36, marginBottom: '0.5rem' }} />}
                  <h3 className="tw-h3" style={{ color: p.color }}>{p.name}</h3>
                  <p className="tw-p" style={{ fontSize: '0.88rem', margin: '0.3rem 0 0.8rem' }}>{p.role}</p>
                  {p.url && (
                    <a className="tw-btn tw-btn-sm tw-btn-ghost" href={p.url} target="_blank" rel="noreferrer" onClick={() => trackEvent('partner_click', p.id, null, c.id)}>Conhecer</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '1.5rem' }}>
          Idealização e realização: Mestres da Tattoo. Sua participação pode ser privada — nada é publicado sem sua autorização.{' '}
          <a href="/experience" onClick={e => { e.preventDefault(); navigate('/experience'); }} className="tw-gold">Outras experiências</a>
        </p>
      </div>
    </TwShell>
  );
}
