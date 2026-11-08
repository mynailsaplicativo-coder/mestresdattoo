import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Swords, MapPin, CalendarDays, Gift, Map as MapIcon, KeyRound, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell, PartnerLogo } from './TwShell';
import { Cloud, Sparkle, Patch, Char, GoldCoin } from './TwArt';
import { useCampaign, campaignPartners, trackEvent, formatDays, campaignMap, KIT_IMAGE, PUBLIC_GIFT, hasGift } from './twData';

export default function TwLanding() {
  const navigate = useNavigate();
  const { campaign: c, partners, base } = useCampaign();
  const [seals, setSeals] = useState([]);
  const [secretCount, setSecretCount] = useState(0);
  const list = campaignPartners(c, partners).filter(p => p.id !== 'mestres');
  const words = c.name.split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const taglineParts = (c.tagline || '').split(/(?<=\.)\s+/).filter(Boolean);

  useEffect(() => {
    supabase.from('tw_missions').select('id, seal_name, seal_icon, seal_color').eq('campaign_id', c.id).eq('active', true).not('seal_name', 'is', null)
      .then(({ data, error }) => {
        if (error || !data) return;
        const seen = new Set();
        setSeals(data.filter(m => !seen.has(m.seal_name) && seen.add(m.seal_name)));
      });
    supabase.from('tw_artists').select('id', { count: 'exact', head: true }).eq('campaign_id', c.id).eq('kind', 'secret').eq('active', true)
      .then(({ count }) => setSecretCount(count || 0));
  }, [c.id]);

  return (
    <TwShell>
      {/* HERO */}
      <section className="tw-hero">
        <div className="tw-hero-art">
          <Cloud className="tw-cloud c1" />
          <Cloud className="tw-cloud c2" fill="#fff4fb" />
          <Cloud className="tw-cloud c3" fill="#f7fdff" />
          <Cloud className="tw-cloud c4" />
          <Sparkle className="tw-spark s1" />
          <Sparkle className="tw-spark s2" fill="#ff8fd8" />
          <Sparkle className="tw-spark s3" fill="#7fe7f2" />
        </div>
        <div className="tw-hero-chars">
          <Char name="dragao" className="tw-hero-dragon" />
          <Char name="gato" className="tw-hero-cat" />
          <Char name="oni" className="tw-hero-oni" alt="Mascote oni tatuador" />
        </div>
        <div className="tw-hero-inner">
          <span className="tw-hero-tag">Mestres da Tattoo na <b>Tattoo Week</b></span>
          <h1 className="tw-h1" style={{ marginTop: '1rem' }}>{words.join(' ')}{lastWord && <><br /><span className="tw-gold">{lastWord}</span></>}</h1>
          {taglineParts.length > 0 && <div className="tw-tagline">{taglineParts.map(t => <span key={t}>{t}</span>)}</div>}
          <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.4rem 1rem', fontWeight: 800, fontSize: '0.92rem', margin: '1.1rem 0 1.4rem' }}>
            {formatDays(c) && <span><CalendarDays size={15} style={{ verticalAlign: -2 }} /> {formatDays(c)}</span>}
            {(c.venue || c.city) && <span><MapPin size={15} style={{ verticalAlign: -2 }} /> {[c.venue, c.city].filter(Boolean).join(' · ')}</span>}
          </div>
          <div className="tw-cta-row" style={{ maxWidth: 560 }}>
            <button className="tw-btn tw-btn-primary" onClick={() => navigate(`${base}/meu`)}><Camera size={18} /> Bora jogar</button>
            <button className="tw-btn" onClick={() => navigate(`${base}/artist`)}><Swords size={18} /> Sou tatuador</button>
          </div>
        </div>
      </section>

      <div className="tw-wrap">
        {c.description && <p className="tw-p" style={{ fontSize: '1.08rem', maxWidth: 640, color: 'var(--tw-text)', fontWeight: 600 }}>{c.description}</p>}

        {/* DOIS JEITOS DE JOGAR */}
        <section className="tw-section tw-grid tw-grid-2">
          <article className="tw-card tw-card-gold tw-exp tw-has-peek">
            <Char name="gato" className="tw-peek" style={{ width: 92, right: -10, top: -46 }} />
            <span className="tw-exp-letter">1</span>
            <span className="tw-kicker">Pra todo mundo</span>
            <h2 className="tw-h2" style={{ margin: '0.3rem 0 0.5rem', fontSize: '2rem' }}>Meu {c.event_name}</h2>
            <p className="tw-p" style={{ color: 'var(--tw-text)' }}>Missões rápidas abertas o evento todo. Cada missão vale um selo bordado pra sua coleção e no fim você ganha um vídeo só seu.</p>
            <button className="tw-btn tw-btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick={() => navigate(`${base}/meu`)}>Começar agora</button>
          </article>
          <article className="tw-card tw-exp tw-has-peek">
            <Char name="tigre" className="tw-peek" style={{ width: 96, right: -8, top: -50 }} />
            <span className="tw-exp-letter">2</span>
            <span className="tw-kicker">Pra tatuadores</span>
            <h2 className="tw-h2" style={{ margin: '0.3rem 0 0.5rem', fontSize: '2rem' }}>Artist Challenge</h2>
            <p className="tw-p" style={{ color: 'var(--tw-text)' }}>Aberto a todos os tatuadores do evento. Cadastre-se aqui no site, ative seu desafio no stand da Bronc, poste as missões no seu perfil e dispute, <b>todo dia, 1 impressora Bronc + 10 mil pontos de crédito no app E-Bronc</b>: leva o tatuador nº 1 do dia que tiver os 5 selos secretos. São 5 missões novas por dia.</p>
            <button className="tw-btn" style={{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick={() => navigate(`${base}/artist`)}>Entrar no Challenge</button>
          </article>
        </section>

        {/* SELOS DE ESCOTEIRO */}
        {seals.length > 0 && (
          <section className="tw-section">
            <Char name="caveira" className="tw-section-char" style={{ margin: '0 0 0.4rem', width: 90 }} />
            <span className="tw-kicker">Colecione</span>
            <h2 className="tw-h2" style={{ margin: '0.3rem 0 0.4rem', fontSize: '2.2rem' }}>Cada missão, um selo</h2>
            <p className="tw-p" style={{ marginBottom: '1rem' }}>Igual escoteiro: comeu na convenção? Selo Comilão. Achou o patrocinador? Selo Detetive. Complete a sua faixa.</p>
            <div className="tw-sash-banner">
              <div className="tw-sash">
                {seals.slice(0, 12).map(s => (
                  <div key={s.id} className="tw-sash-item">
                    <Patch name={s.seal_name} icon={s.seal_icon} color={s.seal_color || '#a995ff'} size={92} />
                    <small>{s.seal_name}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SELOS SECRETOS */}
        {secretCount > 0 && (
          <section className="tw-section">
            <div className="tw-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: 'linear-gradient(135deg, #fff 0%, #f1ebff 100%)' }}>
              <div style={{ display: 'flex' }}>
                {Array.from({ length: Math.min(secretCount, 5) }).map((_, i) => (
                  <div key={i} style={{ marginLeft: i ? -26 : 0, transform: `rotate(${(i - 2) * 8}deg)` }}><GoldCoin found={false} size={70} /></div>
                ))}
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <span className="tw-kicker"><KeyRound size={12} style={{ verticalAlign: -1 }} /> Caça aos selos</span>
                <h3 className="tw-h2" style={{ fontSize: '1.6rem', margin: '0.2rem 0' }}>{secretCount} selos secretos</h3>
                <p className="tw-p">Adesivos NFC escondidos pela Tattoo Week. Encostou o celular, o selo é seu na hora: pontos para os tatuadores e, para o público, um deles é o selo premiado do chaveiro Bronc.</p>
              </div>
            </div>
          </section>
        )}

        {/* MAPA */}
        <section className="tw-section">
          <div className="tw-between" style={{ alignItems: 'flex-end', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            <div>
              <span className="tw-kicker">Onde rola</span>
              <h2 className="tw-h2" style={{ fontSize: '2.2rem', margin: '0.3rem 0 0' }}>Mapa do jogo</h2>
            </div>
            <button className="tw-btn tw-btn-sm" onClick={() => navigate(`${base}/mapa`)}><MapIcon size={14} /> Abrir mapa</button>
          </div>
          <button className="tw-map" style={{ width: '100%', padding: 0, cursor: 'pointer' }} onClick={() => navigate(`${base}/mapa`)}>
            {campaignMap(c)
              ? <img src={campaignMap(c)} alt={`Mapa da ${c.event_name}`} style={{ height: 380, objectFit: 'cover', objectPosition: 'center 52%' }} />
              : <div className="tw-map-empty"><div><MapIcon size={40} /><p className="tw-p" style={{ marginTop: '0.5rem' }}>O mapa oficial chega aqui antes do evento.</p></div></div>}
          </button>
        </section>

        {/* ZONA BRONC */}
        {list.some(p => p.id === 'bronc') && (
          <section className="tw-section">
            <div className="tw-bronc">
              <img className="tw-bronc-img" src="/tattooweek/bronc/welcome.jpg" alt="Welcome to the Bronc & Bigwasp" />
              <div className="tw-bronc-body tw-grid tw-grid-2" style={{ alignItems: 'center' }}>
                <div>
                  <span className="tw-kicker">Zona Bronc</span>
                  <h2>O dragão te espera</h2>
                  <p>No stand da Bronc fica o cadastro dos tatuadores para o Artist Challenge e o backdrop do dragão: tire sua foto, poste e compartilhe com 5 amigos. Missão que vale selo (e pontos no Artist Challenge).</p>
                  <button className="tw-btn" style={{ marginTop: '1rem' }} onClick={() => navigate(`${base}/mapa`)}><MapPin size={16} /> Ver no mapa</button>
                </div>
                <img src="/tattooweek/bronc/dragao.jpg" alt="Arte do dragão do backdrop da Bronc" style={{ width: '100%', borderRadius: 14, border: '2px solid #f07c2a', maxHeight: 320, objectFit: 'cover' }} />
              </div>
            </div>
          </section>
        )}

        {/* PRÊMIOS */}
        {c.prize_title && (
          <section className="tw-section">
            <div className="tw-card tw-card-gold" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--sun)', border: '3px solid var(--ink)', display: 'grid', placeItems: 'center', boxShadow: '4px 4px 0 var(--ink)' }}><Gift size={36} /></div>
              <div style={{ flex: '1 1 240px' }}>
                <span className="tw-kicker"><Trophy size={12} style={{ verticalAlign: -1 }} /> Premiação</span>
                <h2 className="tw-h2" style={{ margin: '0.3rem 0', fontSize: '2rem' }}>{c.prize_title}</h2>
                <p className="tw-p" style={{ color: 'var(--tw-text)' }}>{(c.prize_items || []).join(' · ')}</p>
              </div>
              <button className="tw-btn" onClick={() => navigate(`${base}/premiacao`)}>Regras e prêmios</button>
            </div>
            {hasGift(c) && <div className="tw-grid tw-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="tw-card">
                <span className="tw-kicker">Artist Challenge · 1 por dia</span>
                <h3 className="tw-h3" style={{ margin: '0.3rem 0' }}>Impressora Bronc + 10 mil pontos E-Bronc</h3>
                <img className="tw-kit-photo" src={KIT_IMAGE} alt="Impressora de stencil Bronc" loading="lazy" />
              </div>
              <div className="tw-card">
                <span className="tw-kicker">Público · {PUBLIC_GIFT.total} unidades</span>
                <h3 className="tw-h3" style={{ margin: '0.3rem 0' }}>{PUBLIC_GIFT.title}</h3>
                <p className="tw-p" style={{ fontSize: '0.85rem' }}>Um dos selos secretos é o selo premiado: encostou o celular nele, ganhou o chaveiro. Retire no stand da Bronc, enquanto durar.</p>
                <img className="tw-kit-photo" src={PUBLIC_GIFT.image} alt={PUBLIC_GIFT.title} loading="lazy" />
              </div>
            </div>}
          </section>
        )}

        {/* PARCEIROS */}
        {list.length > 0 && (
          <section className="tw-section">
            <span className="tw-kicker">Quem faz acontecer</span>
            <div className="tw-grid tw-grid-3">
              {list.map(p => (
                <div key={p.id} className="tw-card">
                  {p.logo_url && <div style={{ marginBottom: '0.6rem' }}><PartnerLogo partner={p} height={56} /></div>}
                  <h3 className="tw-h3">{p.name}</h3>
                  <p className="tw-p" style={{ fontSize: '0.88rem', margin: '0.3rem 0 0.8rem' }}>{p.role}</p>
                  {p.url && <a className="tw-btn tw-btn-sm" href={p.url} target="_blank" rel="noreferrer" onClick={() => trackEvent('partner_click', p.id, null, c.id)}>Conhecer</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="tw-parade" aria-hidden="true">
          <Char name="tigre" /><Char name="gato" /><Char name="oni" /><Char name="dragao" /><Char name="caveira" />
        </div>
        <p className="tw-p" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
          Idealização e realização: Mestres da Tattoo. Sua participação pode ser privada: nada é publicado sem sua autorização.
        </p>
      </div>
    </TwShell>
  );
}
