import { useState } from 'react';
import { Map as MapIcon, Flame, Music, Info, Star } from 'lucide-react';
import { TwShell } from './TwShell';
import { useCampaign } from './twData';

const PIN_ICONS = { bronc: Flame, stage: Music, info: Info, star: Star };

// Mapa oficial do evento com os pontos do jogo (pinos posicionados no admin)
export default function TwMap() {
  const { campaign: c } = useCampaign();
  const pins = Array.isArray(c.map_pins) ? c.map_pins : [];
  const [active, setActive] = useState(null);

  return (
    <TwShell>
      <div className="tw-wrap" style={{ maxWidth: 960 }}>
        <span className="tw-kicker">Onde rola</span>
        <h1 className="tw-h2" style={{ fontSize: '2.4rem', margin: '0.3rem 0 1rem' }}>Mapa do jogo</h1>

        <div className="tw-map">
          {c.map_image ? (
            <>
              <img src={c.map_image} alt={`Mapa da ${c.event_name}`} />
              {pins.map((p, i) => {
                const Icon = PIN_ICONS[p.kind] || Star;
                return (
                  <button key={i} className={`tw-pin tw-pin-${p.kind || 'star'}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={() => setActive(i)} aria-label={p.label}>
                    {(active === i || pins.length <= 4) && <span className="tw-pin-label">{p.label}</span>}
                    <span className="tw-pin-dot"><Icon size={15} /></span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="tw-map-empty"><div><MapIcon size={44} /><p className="tw-p" style={{ marginTop: '0.6rem' }}>O mapa oficial chega aqui antes do evento.</p></div></div>
          )}
        </div>

        {pins.length > 0 && (
          <div className="tw-stack" style={{ marginTop: '1.25rem' }}>
            {pins.map((p, i) => {
              const Icon = PIN_ICONS[p.kind] || Star;
              return (
                <button key={i} className="tw-mission" onClick={() => setActive(i)} style={active === i ? { outline: '3px solid var(--pop)', outlineOffset: 2 } : undefined}>
                  <span className="tw-mission-num" style={p.kind === 'bronc' ? { background: '#f07c2a' } : undefined}><Icon size={18} /></span>
                  <span className="tw-mission-body"><span className="tw-mission-title">{p.label}</span></span>
                </button>
              );
            })}
          </div>
        )}

        <p className="tw-p" style={{ fontSize: '0.82rem', marginTop: '1.25rem' }}>
          Os 5 selos secretos não aparecem no mapa. Esses você tem que achar sozinho.
        </p>
      </div>
    </TwShell>
  );
}
