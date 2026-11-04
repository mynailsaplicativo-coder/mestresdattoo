import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CalendarDays, MapPin, UserRound } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TwShell } from './TwShell';
import { campaignBase, formatDays, isAdmin } from './twData';

const STATUS = { active: ['Acontecendo', 'tw-chip-gold'], draft: ['Em breve', ''], finished: ['Encerrada', ''] };

// Lista todas as experiências criadas pelo Mestres da Tattoo
export default function TwHub() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [list, setList] = useState(null);
  const admin = isAdmin(user);

  useEffect(() => {
    let q = supabase.from('tw_campaigns').select('*').order('created_at', { ascending: false });
    if (!admin) q = q.neq('status', 'draft');
    q.then(({ data }) => setList(data || []));
  }, [admin]);

  return (
    <TwShell>
      <div className="tw-wrap">
        <span className="tw-kicker">Mestres da Tattoo</span>
        <h1 className="tw-h1" style={{ fontSize: 'clamp(2rem, 8vw, 3.6rem)' }}>Experiences</h1>
        <p className="tw-p" style={{ maxWidth: 560, marginBottom: '1.5rem' }}>Ativações interativas nas convenções de tatuagem: missões, credenciais NFC, ranking e uma retrospectiva só sua.</p>
        <div className="tw-row" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button className="tw-btn tw-btn-sm" onClick={() => navigate('/experience/perfil')}><UserRound size={14} /> Meu perfil</button>
          {admin && <button className="tw-btn tw-btn-sm tw-btn-ghost" onClick={() => navigate('/experience/admin')}>Painel admin</button>}
        </div>
        {list === null && <div className="tw-empty">Carregando...</div>}
        {list?.length === 0 && <div className="tw-empty">Nenhuma experiência publicada ainda.</div>}
        <div className="tw-grid tw-grid-2">
          {list?.map(c => {
            const [label, cls] = STATUS[c.status] || STATUS.active;
            return (
              <button key={c.id} className="tw-card tw-exp" style={{ cursor: 'pointer', color: 'inherit', font: 'inherit', textAlign: 'left', backgroundImage: c.hero_image ? `linear-gradient(180deg, rgba(5,6,8,0.3), #0d0f13 75%), url('${c.hero_image}')` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 260 }} onClick={() => navigate(campaignBase(c))}>
                <span className={`tw-chip ${cls}`} style={{ alignSelf: 'flex-start', marginBottom: 'auto' }}>{label}</span>
                <h2 className="tw-h2" style={{ marginTop: '1rem' }}>{c.name}</h2>
                <div className="tw-row" style={{ flexWrap: 'wrap', gap: '0.3rem 1rem', fontSize: '0.85rem', color: 'var(--tw-muted)' }}>
                  {formatDays(c) && <span><CalendarDays size={13} style={{ verticalAlign: -2 }} /> {formatDays(c)}</span>}
                  {(c.venue || c.city) && <span><MapPin size={13} style={{ verticalAlign: -2 }} /> {[c.venue, c.city].filter(Boolean).join(' · ')}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </TwShell>
  );
}
