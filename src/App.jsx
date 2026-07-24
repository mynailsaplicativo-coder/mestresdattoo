import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  CalendarDays, BookOpen, UserRound, Mail, Send, Search, Archive, Earth, ListFilter, 
  ChevronDown, RotateCcw, Sparkles, MapPin, Store, BadgeCheck, UserCircle, Globe, PlayCircle, Clock,
  Calendar, User, Star
} from 'lucide-react';
import { magazineArticles, featuredArtists, registeredEvents as fallbackEvents, registeredVideos } from './contentData';
import { supabase } from './supabaseClient';
import EventDetails from './EventDetails';
import AuthPage from './AuthPage';
import AdminPanel from './AdminPanel';
import GuestHub from './GuestHub';
import ContactMediaKit from './ContactMediaKit';
import SearchOverlay from './SearchOverlay';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import './App.css';

// --- COMPONENTES AUXILIARES ---

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`wte-header ${scrolled ? 'scrolled' : ''}`} style={{ background: scrolled ? 'rgba(5, 6, 8, 0.95)' : 'rgba(5, 6, 8, 0.8)', borderBottom: scrolled ? '1px solid var(--wte-gold)' : 'none' }}>
      <div className="wte-header-inner">
        <a href="/" className="wte-brand" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/fotos artistas/logo mestres.png" 
            alt="Mestres da Tattoo" 
            style={{ 
              width: '180px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))'
            }}
          />
        </a>
        <nav className="wte-nav">
          <button className="wte-nav-btn" onClick={() => navigate('/')}><Calendar size={14} /> Eventos</button>
          <button className="wte-nav-btn" onClick={() => navigate('/magazine')}><BookOpen size={14} /> Magazine</button>
          <button className="wte-nav-btn" onClick={() => navigate('/artists')}><User size={14} /> Artistas</button>
          <button className="wte-nav-btn" onClick={() => navigate('/hub')}><Store size={14} /> Guest Hub</button>
          <button className="wte-nav-btn" onClick={() => navigate('/contato')}><Star size={14} /> Mídia Kit</button>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="wte-nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCircle size={16} /> Entrar
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button className="wte-nav-btn" onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wte-gold)' }}>
              Painel Admin
            </button>
            <UserButton />
          </SignedIn>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }}></div>
          
          <div className="wte-lang-select" style={{ display: 'flex', alignItems: 'center', minWidth: '130px', overflow: 'hidden' }}>
             <div id="google_translate_element"></div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }}></div>
          
          <button className="wte-nav-btn" onClick={() => navigate('/hub')}><Store size={14} /> Marketplace & Guest</button>
        </nav>
      </div>
    </header>
  );
}

function EventCard({ id, title, date, venue, city, country, desc, imageUrl, isUpcoming }) {
  const navigate = useNavigate();
  return (
    <article className="wte-event-card" style={{ position: 'relative' }}>
      {isUpcoming && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--wte-gold)', color: '#000', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900, zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> EM BREVE
        </div>
      )}
      <div className="wte-event-poster">
        <img src={imageUrl} alt={title} className="wte-event-poster-img" />
      </div>
      
      <div className="wte-event-details">
        <a href="#" className="wte-event-title">{title}</a>
        <div className="wte-event-meta"><CalendarDays size={14} color="var(--wte-gold)" /><span className="wte-event-meta-strong">{date}</span></div>
        <div className="wte-event-meta"><Store size={14} color="var(--wte-gold)" /><a href="#" className="wte-event-meta-link">{venue}</a></div>
        <div className="wte-event-meta">
          <MapPin size={14} style={{ color: 'rgba(255,255,255,0.36)' }} />
          <span>
            <a href="#" className="wte-event-meta-link">{city}</a>
            <span style={{ color: 'rgba(255,255,255,0.42)' }}>, </span>
            <span style={{ fontSize: '0.85em' }}>{country.toLowerCase() === 'brasil' || country.toLowerCase() === 'brazil' ? '🇧🇷' : '🇺🇸'}</span>
            <a href="#" className="wte-event-meta-link" style={{ marginLeft: '4px' }}>{country}</a>
          </span>
        </div>
        <div className="wte-event-desc">{desc}</div>
        <button className="wte-view-event-btn" onClick={() => navigate(`/evento/${id}`)}><span>&rarr;</span> Ver Evento</button>
      </div>
    </article>
  );
}

function ArtistCard({ artist, isGold }) {
  const borderColor = isGold ? 'rgba(255,204,13,0.4)' : 'rgba(255,255,255,0.2)';
  const textColor = isGold ? 'var(--wte-gold)' : 'rgba(255,255,255,0.6)';

  return (
    <article className="wte-event-card" style={{ textAlign: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
       {/* Logo da Mestres da Tattoo no fundo, centralizada atrás do artista */}
       <div style={{ 
         position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', 
         width: '130px', height: '130px', opacity: 0.25, 
         backgroundImage: 'url(/logo.png)', backgroundSize: 'contain', 
         backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 1 
       }}></div>
       
       <span style={{ display: 'block', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.5rem', position: 'relative', zIndex: 2 }}>
         MESTRES DA TATTOO
       </span>

       <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#050608', margin: '0 auto 1rem', overflow: 'hidden', border: `2px solid ${borderColor}`, position: 'relative', zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
       </div>
       
       <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.2rem', fontWeight: 900, position: 'relative', zIndex: 2 }}>{artist.name}</h3>
       <p style={{ color: textColor, fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', position: 'relative', zIndex: 2 }}>{artist.years}</p>
    </article>
  );
}

// --- PÁGINA 1: EVENTS (HOME) ---

function EventsHub() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(fallbackEvents); // Fallback to contentData if Supabase is empty or fails
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="wte-app-container">
      <Header />
      <section className="wte-hero">
        <div className="wte-hero-overlay"></div>
        <div className="wte-hero-content">
          <div className="wte-nav-actions" style={{ position: 'relative' }}>
            <div className="wte-search-container" style={{ margin: 0 }}>
              <Search size={18} className="wte-search-icon" />
              <input 
                type="text" 
                className="wte-search-input" 
                placeholder="Pesquisar eventos, países..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchOverlay query={searchQuery} onClose={() => setSearchQuery('')} />
            </div>
            <button className="wte-icon-btn"><UserCircle size={20} /></button>
          </div>
          <h1 className="wte-title fade-in delay-1">Mestres da Tattoo:<br/> O Maior Portal da Tatuagem no Brasil</h1>
          <p className="wte-subtitle fade-in delay-2">Encontre estúdios, tatuadores, cultura e muito mais.</p>
          <div className="wte-stats-grid fade-in delay-3">
            <a href="#" className="wte-stat-card"><div className="wte-stat-icon-wrapper"><CalendarDays size={16} /></div><div><span className="wte-stat-number">{events.length}</span><span className="wte-stat-label">Eventos</span></div></a>
            <a href="#" className="wte-stat-card"><div className="wte-stat-icon-wrapper"><CalendarDays size={16} /></div><div><span className="wte-stat-number">{events.filter(e => new Date(e.start_date || e.startDate) > new Date()).length}</span><span className="wte-stat-label">Próximos</span></div></a>
            <a href="#" className="wte-stat-card"><div className="wte-stat-icon-wrapper"><Earth size={16} /></div><div><span className="wte-stat-number">1</span><span className="wte-stat-label">País (Brasil)</span></div></a>
            <a href="#" className="wte-stat-card"><div className="wte-stat-icon-wrapper"><MapPin size={16} /></div><div><span className="wte-stat-number">2</span><span className="wte-stat-label">Estados (SP/RS)</span></div></a>
          </div>
        </div>
      </section>
      
      <main style={{ position: 'relative', zIndex: 10, backgroundColor: '#050608' }}>
        <section className="wte-filters-section fade-in">
          <div className="wte-status-tabs">
            <div className={`wte-tab ${activeTab === 'all' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('all')}><div className="wte-tab-title"><ListFilter size={15} /> Todos Eventos</div><span className="wte-tab-count">{events.length}</span></div>
            <div className={`wte-tab ${activeTab === 'upcoming' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('upcoming')}><div className="wte-tab-title"><CalendarDays size={15} /> Próximos</div><span className="wte-tab-count">{events.filter(e => new Date(e.start_date || e.startDate) > new Date()).length}</span></div>
            <div className={`wte-tab ${activeTab === 'past' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('past')}><div className="wte-tab-title"><Archive size={15} /> Passados</div><span className="wte-tab-count">{events.filter(e => new Date(e.start_date || e.startDate) <= new Date()).length}</span></div>
          </div>
          <div className="wte-advanced-filters">
            <div className="wte-filter-grid">
              <div className="wte-search-container in-filter" style={{ marginBottom: 0 }}><Search size={15} className="wte-search-icon" style={{ left: '0.75rem' }}/><input type="text" className="wte-search-input" placeholder="Pesquisar evento, cidade..." style={{ height: '40px', paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)' }}/></div>
              <div className="wte-select"><span>Todas Regiões</span> <ChevronDown size={15}/></div>
              <div className="wte-select"><span>Todos Países</span> <ChevronDown size={15}/></div>
              <div className="wte-select"><span>Qualquer Ano</span> <ChevronDown size={15}/></div>
              <div className="wte-select"><span>Mais próximos</span> <ChevronDown size={15}/></div>
              <button className="wte-nav-btn" style={{ height: '40px', background: 'rgba(255,255,255,0.05)', borderColor: 'transparent', color: 'rgba(255,255,255,0.64)' }}><RotateCcw size={14} /> Limpar</button>
            </div>
          </div>
        </section>
        
        <section id="events-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', paddingBottom: '4rem' }}>
          <h2 className="wte-section-header"><Sparkles size={24} color="var(--wte-gold)" /> EVENTOS EM DESTAQUE</h2>
          <div className="wte-events-grid">
            {[...events].sort((a, b) => new Date(a.start_date || a.startDate) - new Date(b.start_date || b.startDate)).map(event => {
              const isUpcoming = new Date(event.start_date || event.startDate) > new Date();
              return (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  venue={event.venue}
                  city={event.city}
                  country={event.country}
                  desc={event.desc || event.description}
                  imageUrl={event.image_url || event.imageUrl}
                  isUpcoming={isUpcoming}
                />
              );
            })}
          </div>
        </section>

        <section id="videos-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', paddingBottom: '4rem' }}>
          <h2 className="wte-section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <Globe size={24} color="var(--wte-gold)" /> VÍDEOS & DOCUMENTÁRIOS
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.5rem' }} className="hide-scrollbar">
            {['inkdoc-netflix.mp4', 'la-roche-posay.mp4', 'mondial-video.mp4', 'planet-tattoo.mp4', 'tattoo-week.mp4'].map(vid => (
              <div key={vid} style={{ flexShrink: 0, width: '380px', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                <video controls preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={`/assets/videos/${vid}`} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </section>

        {/* Stencil Flow Banner */}
        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', paddingBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, #0f2015 0%, #050a07 100%)',
            border: '1px solid rgba(0, 255, 128, 0.2)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', flex: '1 1 300px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: 'black', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img src="/assets/stencil-flow-icon.jpg" alt="Stencil Flow Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  Stencil Flow 
                  <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '10px', color: 'rgba(255,255,255,0.8)' }}>App</span>
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Artes gráficas e design para iPad.</p>
                <p style={{ color: 'rgba(0,255,128,0.7)', fontSize: '0.9rem', margin: 0 }}>Desenvolvido para criar artes de tatuagem perfeitas.</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: 'max-content' }}>
              <a href="https://apps.apple.com/br/app/stencil-flow/id6764149272" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button className="wte-nav-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Baixar na App Store
                </button>
              </a>
              <a href="https://stencilflowapp.com.br" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button className="wte-nav-btn" style={{ background: 'white', color: 'black', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                  Acessar Site Oficial
                </button>
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// --- PÁGINA 2: MAGAZINE ---

function MagazineHub() {
  const highlights = magazineArticles.filter(a => a.isHighlight);
  const articles = magazineArticles; // Remove !a.isHighlight filter so they appear in both places
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrameId;
    let scrollAmount = 0;
    const speed = 0.5; // Pixels per frame

    const step = () => {
      scrollAmount += speed;
      slider.scrollLeft = scrollAmount;
      
      // Se chegou no final (ou perto), reseta pro começo
      if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth - 1)) {
        scrollAmount = 0;
      }
      
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    // Pausa a animação quando o mouse entra no container
    const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(step);
    };

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="wte-app-container">
      <Header />
      <section className="wte-hero" style={{ minHeight: '60vh', backgroundImage: 'url(https://images.unsplash.com/photo-1568369324707-c21d89856db8?q=80&w=1600&auto=format&fit=crop)', backgroundPosition: 'center', backgroundAttachment: 'fixed', padding: '100px 0 0 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="wte-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, #050608 100%)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', textAlign: 'left', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--wte-gold)', fontSize: '0.9rem', fontWeight: 900 }}>MESTRES DA TATTOO</span>
          <h1 className="wte-title fade-in delay-1" style={{ fontSize: '3.5rem', marginTop: '0.5rem' }}>TATTOO MAGAZINE</h1>
          <p className="wte-subtitle fade-in delay-2" style={{ maxWidth: '600px', marginLeft: 0 }}>Entrevistas, histórias, artistas e a cultura da tatuagem de todo o mundo.</p>
        </div>
        
        {/* Slider Horizontal Auto Scrolling (Ponta a Ponta) */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', paddingLeft: '2rem' }}>
          <div 
             ref={sliderRef}
             className="fade-in delay-3 wte-slider-container hide-scrollbar" 
             style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem', width: '100%' }}
          >
             {highlights.map((hlt, i) => (
                <div key={i} style={{ flexShrink: 0, width: '320px', height: '400px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                  <img src={hlt.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Highlight" />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}>
                     <span style={{ color: 'var(--wte-gold)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>{hlt.category}</span>
                     <h4 style={{ color: 'white', fontSize: '1.3rem', margin: '0.5rem 0 0 0', fontWeight: 900, lineHeight: 1.2 }}>{hlt.title}</h4>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <main style={{ backgroundColor: '#050608', padding: '2rem 1.5rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          
          <div className="wte-search-container in-filter" style={{ marginBottom: '3rem', maxWidth: '600px' }}>
            <Search size={15} className="wte-search-icon" style={{ left: '1rem' }}/>
            <input type="text" className="wte-search-input" placeholder="Pesquisar entrevistas por artista, país, título..." style={{ height: '45px', paddingLeft: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}/>
          </div>

          <h2 className="wte-section-header" style={{ marginBottom: '1rem', fontSize: '2rem' }}>ENTREVISTAS & ARTIGOS</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Conversas com tatuadores e vozes da cultura da tatuagem no arquivo Mestres da Tattoo.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
             {articles.map((article, idx) => (
                <article key={idx} className="wte-event-card" style={{ display: 'flex', flexDirection: 'column' }}>
                   <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                      <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <span style={{ color: 'var(--wte-gold)', fontSize: '0.75rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{article.category}</span>
                     <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', fontWeight: 900 }}>{article.title}</h3>
                     <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>{article.desc}</p>
                     <button onClick={() => alert("O conteúdo completo deste artigo estará disponível em breve!")} style={{ marginTop: 'auto', background: 'transparent', border: '1px solid var(--wte-gold)', color: 'var(--wte-gold)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Ler Artigo</button>
                   </div>
                </article>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- PÁGINA 3: ARTISTS ---

function ArtistsHub() {
  const [selectedArtist, setSelectedArtist] = useState(null);

  const eraDeOuro = featuredArtists.filter(a => a.category === 'Era de Ouro');
  const lendas = featuredArtists.filter(a => a.category === 'Lendas');
  const mestres = featuredArtists.filter(a => a.category === 'Mestres');
  const ranking = featuredArtists.filter(a => a.category === 'Ranking');

  const getArtistMeta = (name) => {
    const meta = {
      'Carolina Caosvalle': { country: 'ITALY', handle: '@carolina_caosvalle' },
      'Chico Morbene': { country: 'BRASIL', handle: '@chicomorbene' },
      'Coimbra': { country: 'BRASIL', handle: '@coimbratattoo' },
      'Diego Nunes': { country: 'BRASIL', handle: '@diegonunestattoo' },
      'Dung Tran': { country: 'VIETNAM', handle: '@dungtattoo' },
      'Fabricio Galdino': { country: 'BRASIL', handle: '@fabriciogaldino' },
      'Ganso Galvão': { country: 'BRASIL', handle: '@gansogalvao' },
      'Hernan Yepes': { country: 'COLOMBIA', handle: '@hernanyepes' },
      'Ibrahim Barboza': { country: 'BRASIL', handle: '@ibrahimbarboza' },
      'Javi Tattooedtheory': { country: 'SPAIN', handle: '@tattooedtheory' },
      'Yomico Moreno': { country: 'VENEZUELA', handle: '@yomicomoreno' },
      'Zakarov': { country: 'RUSSIA', handle: '@zakarov_tattoo' },
      'Kasas Ink': { country: 'SPAIN', handle: '@kasasink' },
      'Julian Siebert': { country: 'GERMANY', handle: '@juliansiebert' },
      'Steve Butcher': { country: 'NEW ZEALAND', handle: '@stevebutchertattoos' },
      'Nikko Hurtado': { country: 'UNITED STATES', handle: '@nikkohurtado' },
      'Luiza Bello': { country: 'BRASIL', handle: '@luizabello' },
      'Klebyz Tattoo': { country: 'BRASIL', handle: '@klebyz_tattoo' },
      'Machado Artes': { country: 'BRASIL', handle: '@machadoartes' },
      'Paulinho De Deus': { country: 'BRASIL', handle: '@paulinhodedeus' },
      'Joybacks Morales': { country: 'UNITED STATES', handle: '@joybacksmorales' },
      'Ítalo Santos': { country: 'BRASIL', handle: '@italosantostattoo' },
      'Tampa': { country: 'BRASIL', handle: '@tampatattoo' },
      'Ubiratam': { country: 'BRASIL', handle: '@ubiratam' },
      'Neto Coutinho': { country: 'BRASIL', handle: '@netocoutinho' },
      'sylvio freitas': { country: 'BRASIL', handle: '@sylviofreitas' },
      'Cris Niero': { country: 'BRASIL', handle: '@crisniero' },
      'Vitoria Lee': { country: 'CHINA', handle: '@vitorialee' },
      'Tery Do': { country: 'VIETNAM', handle: '@TERY_DO' },
      'Ralf Nonnweiler': { country: 'GERMANY', handle: '@RALFNONNWEILERTATTOO' },
      'Matt Gone': { country: 'UNITED STATES', handle: '@MATTGONE' },
      'Ann Savage': { country: 'PHILIPPINES', handle: '@ANNSAVAGETATTOO' },
      'Debora Novati': { country: 'ITALY', handle: '@DEBORANOVATI_TATTOOIST' }
    };
    return meta[name] || { country: 'INTERNATIONAL', handle: '@' + name.replace(/\s+/g, '').toLowerCase() };
  };

  return (
    <div className="wte-app-container">
      <Header />
      <section className="wte-hero" style={{ minHeight: '40vh', backgroundImage: 'url(https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop)', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="wte-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #050608 100%)' }}></div>
        <div className="wte-hero-content" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1440px', textAlign: 'left' }}>
          <div>
            <span style={{ color: 'var(--wte-gold)', fontSize: '0.9rem', fontWeight: 900 }}>MESTRES DA TATTOO</span>
            <h1 className="wte-title fade-in delay-1" style={{ fontSize: '4rem', marginTop: '0.5rem' }}>ARTISTAS</h1>
            <p className="wte-subtitle fade-in delay-2" style={{ maxWidth: '600px', marginLeft: 0 }}>Perfis oficiais dos maiores expoentes da tatuagem mundial.</p>
          </div>
          
          <div className="fade-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '320px' }}>
            <div className="wte-event-card" style={{ padding: '1.2rem', background: 'linear-gradient(90deg, rgba(255,204,13,0.1), rgba(0,0,0,0.5))', border: '1px solid rgba(255,204,13,0.3)', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>MELHORES DO MUNDO</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.2rem', margin: 0 }}>RANKING GLOBAL</p>
            </div>
            <div className="wte-event-card" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--wte-gold)', fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>LENDAS</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.2rem', margin: 0 }}>HISTÓRICOS E PIONEIROS</p>
            </div>
          </div>
        </div>
      </section>

      <main style={{ backgroundColor: '#050608', padding: '2rem 1.5rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          
          {/* TOP RANKING (MELHORES DO MUNDO) */}
          <div style={{ borderBottom: '1px solid rgba(255,204,13,0.3)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <h2 className="wte-section-header" style={{ margin: 0, fontSize: '2.5rem', color: 'var(--wte-gold)', fontWeight: 900, textTransform: 'uppercase' }}>OS MELHORES DO MUNDO</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Top Artistas no Ranking 2025</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
             {ranking.map((artist, idx) => {
               const meta = getArtistMeta(artist.name);
               return (
                <div key={idx} style={{ background: '#0a0a0c', border: '1px solid var(--wte-gold)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Photo area */}
                  <div style={{ position: 'relative', height: '350px', background: '#000' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', textAlign: 'center', zIndex: 2 }}>
                       <img src="/fotos artistas/logo mestres.png" alt="Logo" style={{ height: '40px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                    </div>
                    <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', zIndex: 2 }}>
                       <h3 style={{ color: 'white', margin: 0, fontSize: '2.2rem', fontFamily: 'Cinzel', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{artist.name}</h3>
                       <span style={{ color: 'var(--wte-gold)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '2px', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>{meta.country}</span>
                    </div>
                  </div>
                  
                  {/* Info area */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--wte-gold)', fontWeight: 800 }}>RANKING 2025 • {meta.country}</div>
                      <h4 style={{ color: 'white', margin: '0.3rem 0 0 0', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>{artist.name}</h4>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{meta.handle}</div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedArtist({...artist, ...meta})}
                      style={{ marginTop: 'auto', background: 'transparent', border: 'none', color: 'var(--wte-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, padding: 0, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      View Profile
                      <span style={{ fontSize: '1.2rem' }}>↗</span>
                    </button>
                  </div>
                </div>
               );
             })}
          </div>

          {/* LENDAS DA ERA DE OURO */}
          <h2 className="wte-section-header" style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--wte-gold)' }}>LENDAS DA ERA DE OURO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
             {eraDeOuro.map((artist, idx) => (
                <ArtistCard key={idx} artist={artist} isGold={true} onClick={() => setSelectedArtist(artist)} />
             ))}
          </div>

            {/* LENDAS */}
            <h2 className="wte-section-header" style={{ marginBottom: '2rem', fontSize: '2rem', color: 'white' }}>LENDAS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
               {lendas.map((artist, idx) => (
                  <ArtistCard key={idx} artist={artist} isGold={false} onClick={() => setSelectedArtist(artist)} />
               ))}
            </div>

            {/* MESTRES */}
            <h2 className="wte-section-header" style={{ marginBottom: '2rem', fontSize: '2rem', color: 'white' }}>MESTRES</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
               {mestres.map((artist, idx) => (
                  <ArtistCard key={idx} artist={artist} isGold={false} onClick={() => setSelectedArtist(artist)} />
               ))}
            </div>
          </div>
        </main>

        {/* Artist Profile Modal */}
        {selectedArtist && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}
            onClick={() => setSelectedArtist(null)}
          >
            <div 
              style={{ background: '#111', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--wte-gold)', position: 'relative', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedArtist(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
              
              <div style={{ height: '400px', position: 'relative' }}>
                <img src={selectedArtist.imageUrl} alt={selectedArtist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(0deg, #111 0%, transparent 100%)' }}>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '3rem', fontFamily: 'Cinzel', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{selectedArtist.name}</h2>
                  <span style={{ color: 'var(--wte-gold)', fontWeight: 900, fontSize: '1.2rem', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>{selectedArtist.country || selectedArtist.category}</span>
                </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <h4 style={{ color: 'var(--wte-gold)', marginBottom: '1rem', fontSize: '1.2rem' }}>Sobre o Artista</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                  {selectedArtist.desc || `Conheça mais sobre o trabalho, a técnica e a carreira de ${selectedArtist.name}, um dos grandes nomes da tatuagem mundial em sua categoria.`}
                </p>
                
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--wte-gold)' }}>
                  <p style={{ margin: 0, color: 'white', fontStyle: 'italic' }}>* Em breve: galeria completa de trabalhos, estúdios e prêmios do artista.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

// --- PÁGINA 4: SUBMIT EVENT ---

function SubmitEventHub() {
  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', borderRadius: '6px', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', color: 'white', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' };
  const sectionBoxStyle = { marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' };

  return (
    <div className="wte-app-container">
      <Header />
      <main style={{ backgroundColor: '#050608', padding: '4rem 1.5rem', minHeight: '90vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid var(--wte-gold)', color: 'var(--wte-gold)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>SUBMISSÃO DE ORGANIZADORES</span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>REVISADO ANTES DA PUBLICAÇÃO</span>
          </div>
          
          <h1 className="wte-title fade-in delay-1" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>ENVIE SEU EVENTO DE TATUAGEM</h1>
          
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Liste sua convenção, expo ou festival de tatuagem no Mestres da Tattoo e alcance artistas, colecionadores, fornecedores e fãs de tatuagem em todo o mundo.
              </p>
              <p style={{ color: 'var(--wte-gold)', fontWeight: 800, marginBottom: '2rem' }}>
                Mestres da Tattoo conectando a comunidade global de tatuagem.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="wte-nav-btn" style={{ background: 'linear-gradient(180deg, #ffcc0d, #d4a000)', color: 'black', border: 'none', padding: '1rem 2rem', fontWeight: 900, fontSize: '1rem' }}>Enviar Evento</button>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Revisão obrigatória.</span>
              </div>
            </div>
            
            <div style={{ flex: '1', minWidth: '300px' }} className="wte-event-card">
              <div className="wte-event-details">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--wte-gold)' }}><BadgeCheck size={20} /></div>
                  <div>
                    <strong style={{ display: 'block', color: 'white', marginBottom: '0.3rem' }}>Enviar</strong>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Envie detalhes e o pôster oficial.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--wte-gold)' }}><Mail size={20} /></div>
                  <div>
                    <strong style={{ display: 'block', color: 'white', marginBottom: '0.3rem' }}>E-mail</strong>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Recebemos os detalhes via e-mail.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--wte-gold)' }}><CalendarDays size={20} /></div>
                  <div>
                    <strong style={{ display: 'block', color: 'white', marginBottom: '0.3rem' }}>Revisão</strong>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Respondemos em particular se faltar algo.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FORMULÁRIO COMPLETO */}
          <div style={sectionBoxStyle}>
            <span style={{ color: 'var(--wte-gold)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>SUBMISSÃO RÁPIDA</span>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 900 }}>Dados Básicos do Evento</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Preencha com o que tiver agora. Completamos os detalhes que faltam na revisão.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div><label style={labelStyle}>Pessoa de Contato</label><input type="text" placeholder="Nome completo" style={inputStyle} /></div>
              <div><label style={labelStyle}>E-mail de Contato</label><input type="email" placeholder="nome@exemplo.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Nome do Evento</label><input type="text" placeholder="São Paulo Tattoo Convention" style={inputStyle} /></div>
              <div><label style={labelStyle}>Nome do Local (Venue)</label><input type="text" placeholder="Centro de Convenções" style={inputStyle} /></div>
              <div><label style={labelStyle}>Data de Início</label><input type="date" style={inputStyle} /></div>
              <div><label style={labelStyle}>Data de Fim</label><input type="date" style={inputStyle} /></div>
              <div><label style={labelStyle}>País</label><input type="text" placeholder="Brasil" style={inputStyle} /></div>
              <div><label style={labelStyle}>Cidade</label><input type="text" placeholder="São Paulo" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Website Oficial do Evento</label>
                <input type="url" placeholder="https://..." style={inputStyle} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', display: 'block' }}>Adicione o site ou Instagram.</span>
              </div>
              <div>
                <label style={labelStyle}>Instagram Oficial</label>
                <input type="text" placeholder="@evento" style={inputStyle} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', display: 'block' }}>Adicione um Instagram ou site.</span>
              </div>
            </div>
            
            <div>
              <label style={labelStyle}>Pôster Principal / Imagem de Destaque</label>
              <input type="file" style={inputStyle} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', display: 'block' }}>Opcional, mas recomendado: pôster claro do evento. Arquivos pequenos.</span>
            </div>
          </div>

          <div style={sectionBoxStyle}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 900 }}>Adicionar Detalhes do Organizador</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Telefone, empresa, site do organizador e redes sociais. Útil, mas não obrigatório.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div><label style={labelStyle}>Telefone / WhatsApp</label><input type="tel" placeholder="+55 11 99999-9999" style={inputStyle} /></div>
              <div><label style={labelStyle}>Nome do Organizador / Empresa</label><input type="text" placeholder="Nome da empresa" style={inputStyle} /></div>
              <div><label style={labelStyle}>Website do Organizador</label><input type="url" placeholder="https://..." style={inputStyle} /></div>
              <div><label style={labelStyle}>Instagram do Organizador</label><input type="text" placeholder="@organizador" style={inputStyle} /></div>
            </div>
          </div>

          <div style={sectionBoxStyle}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 900 }}>Detalhes Adicionais e Lineup</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div><label style={labelStyle}>Edição do Evento</label><input type="text" placeholder="12ª Edição" style={inputStyle} /></div>
              <div><label style={labelStyle}>Estado / Província</label><input type="text" placeholder="São Paulo" style={inputStyle} /></div>
              <div><label style={labelStyle}>Facebook Oficial</label><input type="url" placeholder="https://facebook.com/..." style={inputStyle} /></div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Sobre o Evento</label>
              <textarea placeholder="Conte aos visitantes o que faz o evento valer a pena..." style={{ ...inputStyle, minHeight: '100px' }}></textarea>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Lineup de Artistas (Tatuadores)</label>
              <textarea placeholder="Nomes de artistas, estúdios ou um link para o lineup..." style={{ ...inputStyle, minHeight: '100px' }}></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div><label style={labelStyle}>Número de Tatuadores</label><input type="number" placeholder="150" style={inputStyle} /></div>
              <div><label style={labelStyle}>Número de Vendedores / Suppliers</label><input type="number" placeholder="40" style={inputStyle} /></div>
              <div><label style={labelStyle}>Link para Inscrição de Estandes (Booths)</label><input type="url" placeholder="https://..." style={inputStyle} /></div>
              <div><label style={labelStyle}>Link de Ingressos</label><input type="url" placeholder="https://..." style={inputStyle} /></div>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <label style={labelStyle}>Imagens Adicionais (Até 6 arquivos)</label>
              <input type="file" multiple style={inputStyle} />
            </div>
          </div>

          <div style={{ ...sectionBoxStyle, border: '1px solid var(--wte-gold)' }}>
            <span style={{ color: 'var(--wte-gold)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>REVISAR E ENVIAR</span>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 900 }}>Consentimento / Confirmação</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>Eu confirmo que sou o organizador ou estou oficialmente autorizado a enviar este evento, e que as informações são precisas.</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>Entendo que o Mestres da Tattoo analisará o envio antes da publicação, poderá editá-lo para clareza/SEO, e poderá contatar-me.</label>
            </div>

            <button className="wte-nav-btn" style={{ background: 'linear-gradient(180deg, #ffcc0d, #d4a000)', color: 'black', border: 'none', padding: '1rem 3rem', fontWeight: 900, fontSize: '1.2rem', width: '100%' }}>Finalizar e Enviar Evento</button>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- ROTAS DO APP ---

export default function App() {
  useEffect(() => {
    document.body.style.backgroundColor = '#050608';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventsHub />} />
        <Route path="/evento/:id" element={<EventDetails />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/magazine" element={<MagazineHub />} />
        <Route path="/artists" element={<ArtistsHub />} />
        <Route path="/submit" element={<SubmitEventHub />} />
        <Route path="/contato" element={<ContactMediaKit />} />
        
        {/* Guest Hub */}
        <Route path="/hub" element={<GuestHub />} />
      </Routes>
    </Router>
  );
}
