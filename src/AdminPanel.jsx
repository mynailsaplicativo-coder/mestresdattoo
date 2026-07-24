import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, RedirectToSignIn } from '@clerk/clerk-react';
import { LayoutDashboard, Users, CalendarDays, BookOpen, Video, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import { featuredArtists, magazineArticles, registeredVideos } from './contentData';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', start_date: '', venue: '', city: '', country: '', desc: '', image_url: '' });

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('events').insert([formData]);
    if (!error) {
      setShowForm(false);
      setFormData({ title: '', date: '', start_date: '', venue: '', city: '', country: '', desc: '', image_url: '' });
      fetchEvents();
    } else {
      alert("Erro ao adicionar: " + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) fetchEvents();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!isLoaded) return <div style={{ color: 'white', padding: '2rem' }}>Carregando...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  
  if (user?.primaryEmailAddress?.emailAddress !== 'yurilojavirtual@gmail.com') {
    return (
      <div style={{ padding: '3rem', color: 'white', textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas o administrador (yurilojavirtual@gmail.com) pode acessar esta página.</p>
        <button className="wte-nav-btn" onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  const renderContent = () => {
    let data = [];
    let title = "";
    
    switch(activeTab) {
      case 'events': data = events; title = "Eventos Cadastrados"; break;
      case 'artists': data = featuredArtists.slice(0, 15); title = "Artistas (Amostra)"; break;
      case 'articles': data = magazineArticles.slice(0, 10); title = "Matérias & Entrevistas"; break;
      case 'videos': data = registeredVideos; title = "Vídeos"; break;
      default: break;
    }

    return (
      <div style={{ padding: '2rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{title}</h2>
          {activeTab === 'events' && (
            <button onClick={() => setShowForm(true)} className="wte-nav-btn" style={{ background: 'var(--wte-gold)', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Adicionar Evento
            </button>
          )}
        </div>
        
        {showForm && activeTab === 'events' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--wte-gold)' }}>
            <h3>Novo Evento</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Título (ex: TATTOO WEEK)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Data Exibição (ex: 20-22 Nov 2026)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
                <input type="date" placeholder="Data Real (Start Date)" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Local" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
                <input type="text" placeholder="Cidade" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
                <input type="text" placeholder="País" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
              </div>
              <textarea placeholder="Descrição" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={3} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}></textarea>
              <input type="text" placeholder="URL da Imagem (/cartazes eventos/foto.jpg)" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: 'var(--wte-gold)', color: 'black', padding: '0.8rem 2rem', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Salvar Evento</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.8rem 2rem', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
        
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Título / Nome</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Detalhes</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Imagem</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{item.title || item.name}</td>
                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.6)' }}>{item.date || item.category || item.years || item.file}</td>
                  <td style={{ padding: '1rem' }}>
                    {(item.imageUrl || item.file) && <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem', marginLeft: '0.5rem' }} onClick={() => activeTab === 'events' ? handleDeleteEvent(item.id) : alert('Exclusão simulada')}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050608', color: 'white' }}>
      <div style={{ width: '250px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: '1.2rem', color: 'var(--wte-gold)', margin: 0, fontWeight: 900 }}>ADMIN PANEL</h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
          {[
            { id: 'events', label: 'Eventos', icon: CalendarDays },
            { id: 'artists', label: 'Artistas', icon: Users },
            { id: 'articles', label: 'Revista', icon: BookOpen },
            { id: 'videos', label: 'Vídeos', icon: Video },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: 'none', color: activeTab === tab.id ? 'var(--wte-gold)' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer', textAlign: 'left', borderLeft: activeTab === tab.id ? '3px solid var(--wte-gold)' : '3px solid transparent'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 2rem', background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}
