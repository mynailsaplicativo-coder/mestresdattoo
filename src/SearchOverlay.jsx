import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registeredEvents, featuredArtists, magazineArticles, registeredVideos } from './contentData';
import { CalendarDays, UserRound, BookOpen, Video, X } from 'lucide-react';

export default function SearchOverlay({ query, onClose }) {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    const q = query.toLowerCase();
    const found = [];

    // Busca Eventos
    registeredEvents.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)) {
        found.push({ ...e, type: 'evento', icon: CalendarDays });
      }
    });

    // Busca Artistas
    featuredArtists.forEach(a => {
      if (a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
        found.push({ ...a, title: a.name, type: 'artista', icon: UserRound });
      }
    });

    // Busca Artigos
    magazineArticles.forEach(a => {
      if (a.title.toLowerCase().includes(q)) {
        found.push({ ...a, type: 'artigo', icon: BookOpen });
      }
    });

    // Busca Vídeos
    registeredVideos.forEach(v => {
      if (v.title.toLowerCase().includes(q)) {
        found.push({ ...v, type: 'vídeo', icon: Video, imageUrl: '/fotos artistas/logo mestres.png' });
      }
    });

    setResults(found);
  }, [query]);

  if (!query || query.length < 2) return null;

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', 
      border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 12px 12px', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.8)', maxHeight: '400px', overflowY: 'auto', zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Resultados para "{query}"</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={16} /></button>
      </div>

      {results.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          Nenhum resultado encontrado.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {results.map((r, i) => (
            <li key={i}>
              <button 
                onClick={() => {
                  onClose();
                  if (r.type === 'evento') navigate(`/evento/${r.id}`);
                  else if (r.type === 'artista') navigate('/artists');
                  else if (r.type === 'artigo') navigate('/magazine');
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                  background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer', textAlign: 'left', color: 'white'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
                  {(r.imageUrl || r.file) && <img src={r.imageUrl || `/assets/videos/${r.file}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{r.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <r.icon size={10} color="var(--wte-gold)" /> {r.type}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
