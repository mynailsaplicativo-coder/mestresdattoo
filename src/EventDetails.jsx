import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { registeredEvents as fallbackEvents } from './contentData';
import { CalendarDays, MapPin, Store, ArrowLeft } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      // First try to fetch from supabase by id (which might be a UUID or string)
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (data) {
        setEvent({
          ...data,
          desc: data.description || data.desc, // Normalize field names
          imageUrl: data.image_url || data.imageUrl
        });
      } else {
        // Fallback to contentData
        const fallback = fallbackEvents.find(e => e.id === id);
        if (fallback) setEvent(fallback);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '4rem' }}>Carregando...</div>;
  }

  if (!event) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '4rem' }}>
        <h2>Evento não encontrado</h2>
        <button className="wte-nav-btn" onClick={() => navigate('/')}>Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', paddingBottom: '4rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--wte-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
        >
          <ArrowLeft size={20} /> Voltar aos Eventos
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '3rem' }}>
          <div style={{ flex: 1 }}>
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }} 
            />
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '3rem', margin: 0, lineHeight: 1.1 }}>{event.title}</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CalendarDays color="var(--wte-gold)" size={24} />
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{event.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Store color="var(--wte-gold)" size={24} />
                <span style={{ fontSize: '1.2rem' }}>{event.venue}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin color="var(--wte-gold)" size={24} />
                <span style={{ fontSize: '1.2rem' }}>{event.city}, {event.country}</span>
              </div>
            </div>

            <div>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.5rem', marginBottom: '1rem' }}>Sobre o Evento</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                {event.desc}
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginTop: '1rem' }}>
                Prepare-se para viver uma experiência inesquecível! Reunindo os melhores artistas, 
                marcas e entusiastas do mundo da tatuagem. Não perca a chance de se inspirar, 
                tatuar com seus ídolos e aproveitar muita arte, cultura e entretenimento.
              </p>
            </div>
            
            <button className="wte-nav-btn" style={{ marginTop: 'auto', padding: '1rem', fontSize: '1.2rem', textAlign: 'center', background: 'var(--wte-gold)', color: '#000', fontWeight: 'bold' }}>
              Garantir Ingresso (Em Breve)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
