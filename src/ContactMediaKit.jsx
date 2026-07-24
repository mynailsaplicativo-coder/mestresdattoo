import React from 'react';
import { Phone, Star, Camera, MessageCircle, ChevronRight, TrendingUp, Users, Target, BarChart, CheckCircle2, Play, BookOpen } from 'lucide-react';

export default function ContactMediaKit() {
  const WHATSAPP_NUMBER = '5521985262854';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const openWhatsApp = (message) => {
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="wte-app-container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto', marginTop: '76px' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 2rem', background: 'linear-gradient(180deg, rgba(238, 195, 88, 0.1) 0%, rgba(0,0,0,0) 100%)', borderRadius: '12px', border: '1px solid rgba(238, 195, 88, 0.2)' }}>
        <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Relatório de Performance</h3>
        <h1 className="wte-title" style={{ fontSize: '4rem', margin: '0 auto 1.5rem auto' }}>Mídia Kit</h1>
        <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '2rem' }}>Período analisado: Últimos 90 dias</p>
        
        <p className="wte-subtitle" style={{ margin: '0 auto 2rem auto', maxWidth: '800px', lineHeight: '1.8' }}>
          O <strong>Mestres da Tattoo</strong> é uma das maiores plataformas brasileiras dedicadas exclusivamente à cultura da tatuagem. Reunimos diariamente artistas, estúdios, colecionadores e apaixonados pela tattoo.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
          Nosso objetivo é valorizar a tatuagem como forma de expressão artística, conectar profissionais e aproximar marcas de um público altamente qualificado.
        </p>

        <button 
          className="wte-nav-btn" 
          onClick={() => openWhatsApp('Olá, vim pelo Mídia Kit e gostaria de falar sobre anúncios/parcerias.')}
          style={{ background: 'var(--wte-gold)', color: 'black', padding: '1rem 2rem', fontSize: '1.2rem', height: 'auto', display: 'inline-flex' }}
        >
          <Phone size={24} style={{ marginRight: '0.5rem' }} /> Falar no WhatsApp
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="wte-section-header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <TrendingUp color="var(--wte-gold)" size={32} /> Desempenho Geral
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="wte-event-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--wte-gold-strong)', margin: '0 0 0.5rem 0' }}>9.279.128</h2>
          <h4 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Visualizações</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Mais de 9,2 milhões de visualizações em apenas 90 dias.</p>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--wte-gold-strong)', margin: '0 0 0.5rem 0' }}>2.570.536</h2>
          <h4 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Contas Alcançadas</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Mais de 2,5 milhões de pessoas únicas impactadas.</p>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--wte-gold-strong)', margin: '0 0 0.5rem 0' }}>83,4%</h2>
          <h4 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Público Novo</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Vieram de pessoas que ainda não seguem o perfil (forte alcance orgânico).</p>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--wte-gold-strong)', margin: '0 0 0.5rem 0' }}>16,6%</h2>
          <h4 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Seguidores Atuais</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Nossa comunidade mantém-se extremamente ativa e engajada.</p>
        </div>
      </div>

      {/* Two column layout for Audiencia & Formatos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Audiencia */}
        <div className="wte-event-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Users color="var(--wte-gold)" size={28} />
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Audiência Qualificada</h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: '1.6' }}>Público altamente segmentado, composto por pessoas diretamente ligadas ao universo da tatuagem:</p>
          <ul style={{ color: 'white', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[
              'Tatuadores profissionais e Aprendizes',
              'Proprietários de estúdios',
              'Clientes e colecionadores',
              'Fabricantes de equipamentos e Tintas',
              'Organizadores de convenções',
              'Apaixonados pela cultura tattoo'
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--wte-gold)" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Alcance por formato */}
        <div className="wte-event-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <BarChart color="var(--wte-gold)" size={28} />
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Alcance por Formato</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: 'var(--wte-gold)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Play size={16}/> Reels</h4>
              <p style={{ margin: 0, color: 'white' }}><strong>5,3 milhões</strong> de visualizações. Principal canal de descoberta e exposição.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--wte-gold)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Camera size={16}/> Posts</h4>
              <p style={{ margin: 0, color: 'white' }}>Milhões de visualizações complementares com engajamento focado.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--wte-gold)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={16}/> Stories & Lives</h4>
              <p style={{ margin: 0, color: 'white' }}>Alcance recorrente, relacionamento, interação e cobertura especial.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Oportunidades para Marcas */}
      <div className="wte-section-header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <Target color="var(--wte-gold)" size={32} /> Oportunidades & Planos
      </div>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
        Oferecemos formatos personalizados para fortalecer a presença da sua marca ou alavancar a sua carreira dentro do mercado da tatuagem.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        
        <div className="wte-event-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 1rem 0' }}>Publicidade em Feed & Reels</h3>
          <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Conteúdo integrado à nossa identidade visual. Maior potencial de alcance orgânico e descoberta de novos públicos para a sua marca ou estúdio.</p>
          <button onClick={() => openWhatsApp('Olá, tenho interesse em Publicidade no Feed/Reels.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 1rem 0' }}>Campanhas em Stories</h3>
          <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Campanhas rápidas, promoções, lançamentos de produtos e direcionamento direto de tráfego (com links).</p>
          <button onClick={() => openWhatsApp('Olá, tenho interesse em Campanhas via Stories.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 1rem 0' }}>Cobertura de Eventos</h3>
          <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Produção de conteúdo durante convenções, feiras e campeonatos de tatuagem (nacionais e internacionais).</p>
          <button onClick={() => openWhatsApp('Olá, quero orçar a Cobertura para o meu Evento.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
        </div>

        <div className="wte-event-card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.3rem', margin: '0 0 1rem 0' }}>Entrevistas & Lançamentos</h3>
          <p style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>Espaço para artistas, patrocinadores e marcas apresentarem novidades, equipamentos, cursos ou aplicativos.</p>
          <button onClick={() => openWhatsApp('Olá, quero falar sobre Entrevistas e Lançamentos.')} className="wte-view-event-btn">Consultar Valor <ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Por que anunciar */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(238, 195, 88, 0.05)', borderRadius: '12px', border: '1px solid rgba(238, 195, 88, 0.2)' }}>
        <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem' }}>Por que anunciar no Mestres da Tattoo?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '900px', margin: '0 auto 2rem auto', lineHeight: '1.8', fontSize: '1.1rem' }}>
          Anunciar conosco significa conectar sua marca a uma das maiores comunidades especializadas em tatuagem do Brasil. Com milhões de visualizações orgânicas e um público altamente qualificado, cada campanha ganha relevância, credibilidade e ampla exposição dentro de um mercado em constante crescimento.
          <br/><br/>
          Mais do que um perfil nas redes sociais, o <strong>Mestres da Tattoo</strong> é um veículo de comunicação especializado que informa, inspira e influencia profissionais e admiradores todos os dias.
        </p>
        <button 
          className="wte-nav-btn" 
          onClick={() => openWhatsApp('Olá! Gostaria de fazer uma parceria com o Mestres da Tattoo.')}
          style={{ background: 'var(--wte-gold)', color: 'black', padding: '1rem 2rem', fontSize: '1.1rem', height: 'auto', display: 'inline-flex', fontWeight: 'bold' }}
        >
          Anuncie Conosco
        </button>
      </div>

    </div>
  );
}
