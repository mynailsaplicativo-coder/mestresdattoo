import React from 'react';
import { Phone, Star, Camera, MessageCircle, ChevronRight } from 'lucide-react';

export default function ContactMediaKit() {
  const WHATSAPP_NUMBER = '5521985262854';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const openWhatsApp = (message) => {
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="wte-app-container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto', marginTop: '76px' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '3rem 1rem', background: 'linear-gradient(180deg, rgba(238, 195, 88, 0.1) 0%, rgba(0,0,0,0) 100%)', borderRadius: '12px', border: '1px solid rgba(238, 195, 88, 0.2)' }}>
        <h1 className="wte-title" style={{ fontSize: '3rem', margin: '0 auto 1rem auto' }}>Contato & Mídia Kit</h1>
        <p className="wte-subtitle" style={{ margin: '0 auto 2rem auto', maxWidth: '800px' }}>
          Conecte-se com a maior comunidade de tatuagem do mundo. Seja para tirar dúvidas, anunciar seu estúdio ou contratar a nossa cobertura oficial para o seu evento.
        </p>
        <button 
          className="wte-nav-btn" 
          onClick={() => openWhatsApp('Olá, vim pelo site Mestres da Tattoo e gostaria de conversar.')}
          style={{ background: 'var(--wte-gold)', color: 'black', padding: '1rem 2rem', fontSize: '1.2rem', height: 'auto', display: 'inline-flex' }}
        >
          <Phone size={24} style={{ marginRight: '0.5rem' }} /> Falar no WhatsApp Direto
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Tatuadores Section */}
        <div>
          <div className="wte-section-header" style={{ fontSize: '1.8rem', color: 'white' }}>
            <Star color="var(--wte-gold)" size={28} /> Planos para Tatuadores
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Acelere sua carreira alcançando milhares de amantes da tatuagem e estúdios procurando por talentos.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Plan 1 */}
            <div className="wte-event-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Destaque no Portal</h3>
              <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Sua foto, biografia e trabalhos na página inicial dos Mestres da Tattoo.</p>
              <button onClick={() => openWhatsApp('Olá, tenho interesse no plano Destaque no Portal para Tatuadores.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
            </div>
            {/* Plan 2 */}
            <div className="wte-event-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Entrevista Exclusiva</h3>
              <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Matéria escrita detalhada sobre sua trajetória na nossa revista online, com link pro seu Instagram.</p>
              <button onClick={() => openWhatsApp('Olá, tenho interesse no plano Entrevista Exclusiva.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* Eventos Section */}
        <div>
          <div className="wte-section-header" style={{ fontSize: '1.8rem', color: 'white' }}>
            <Camera color="var(--wte-gold)" size={28} /> Cobertura de Eventos
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Organizando uma convenção? A equipe Mestres da Tattoo leva estrutura e visibilidade global para o seu evento.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Event Plan 1 */}
            <div className="wte-event-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Divulgação Oficial</h3>
              <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Seu evento no topo do nosso calendário e posts impulsionados em nossas redes sociais.</p>
              <button onClick={() => openWhatsApp('Olá, quero divulgar meu evento no Mestres da Tattoo.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
            </div>
            {/* Event Plan 2 */}
            <div className="wte-event-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Presença Vip & Cobertura Completa</h3>
              <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Stand dos Mestres da Tattoo no local, entrevistas com vencedores, fotos em alta qualidade e aftermovie do evento.</p>
              <button onClick={() => openWhatsApp('Olá, tenho interesse na Cobertura Completa Presencial para o meu evento.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
