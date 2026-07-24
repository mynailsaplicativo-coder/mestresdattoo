import React, { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { supabase } from './supabaseClient';
import { MapPin, Calendar, MessageCircle, User, Briefcase, PlusCircle, Search } from 'lucide-react';

export default function GuestHub() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('spots'); // 'spots' | 'travels'
  
  // Data
  const [guestSpots, setGuestSpots] = useState([]);
  const [travelPlans, setTravelPlans] = useState([]);
  
  // Onboarding Form
  const [role, setRole] = useState('artist');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [whatsapp, setWhatsapp] = useState('');

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', desc: '', start: '', end: '', city: '', dest: '' });

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        fetchProfile(user.id);
      } else {
        setLoading(false);
        fetchPublicData();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchProfile = async (clerkId) => {
    try {
      const { data, error } = await supabase
        .from('guest_profiles')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();
      
      if (data) setProfile(data);
    } catch (e) {
      console.log('Nenhum perfil encontrado');
    } finally {
      fetchPublicData();
      setLoading(false);
    }
  };

  const fetchPublicData = async () => {
    const [resSpots, resTravels] = await Promise.all([
      supabase.from('guest_spots').select('*, studio:guest_profiles(*)'),
      supabase.from('travel_plans').select('*, artist:guest_profiles(*)')
    ]);
    if (resSpots.data) setGuestSpots(resSpots.data);
    if (resTravels.data) setTravelPlans(resTravels.data);
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.from('guest_profiles').insert([{
      clerk_id: user.id,
      role: role,
      name: name,
      city: city,
      country: country,
      whatsapp: whatsapp,
      image_url: user.imageUrl
    }]).select();
    
    if (data && data.length > 0) {
      setProfile(data[0]);
    }
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    if (profile.role === 'studio') {
      await supabase.from('guest_spots').insert([{
        studio_id: profile.id,
        title: formData.title,
        description: formData.desc,
        start_date: formData.start,
        end_date: formData.end,
        city: profile.city,
        country: profile.country
      }]);
    } else {
      await supabase.from('travel_plans').insert([{
        artist_id: profile.id,
        destination_city: formData.city,
        destination_country: formData.dest || 'Brasil',
        start_date: formData.start,
        end_date: formData.end,
        description: formData.desc
      }]);
    }
    await fetchPublicData();
    setIsModalOpen(false);
    setLoading(false);
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>Carregando...</div>;
  }

  // ONBOARDING VIEW
  if (isSignedIn && !profile) {
    return (
      <div className="wte-app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 76px)', padding: '2rem' }}>
        <div className="wte-advanced-filters" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
          <h2 className="wte-title" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Complete seu Perfil</h2>
          <p className="wte-subtitle" style={{ fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>Para usar o Guest Hub, precisamos de algumas informações.</p>
          
          <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>Eu sou um(a):</label>
              <select className="wte-select" value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%' }} required>
                <option value="artist">Tatuador(a)</option>
                <option value="studio">Estúdio de Tatuagem</option>
              </select>
            </div>
            
            <input type="text" className="wte-search-input" placeholder={role === 'artist' ? "Seu Nome Artístico" : "Nome do Estúdio"} value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" className="wte-search-input" placeholder="Cidade Base" value={city} onChange={e => setCity(e.target.value)} required />
            <input type="text" className="wte-search-input" placeholder="WhatsApp (com DDD)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
            
            <button className="wte-nav-btn" type="submit" style={{ justifyContent: 'center', padding: '1rem', marginTop: '1rem', background: 'var(--wte-gold)', color: 'black' }}>
              Salvar Perfil
            </button>
          </form>
        </div>
      </div>
    );
  }

  // GUEST HUB VIEW
  return (
    <div className="wte-app-container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto', marginTop: '76px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="wte-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Guest Hub</h1>
          <p className="wte-subtitle" style={{ margin: 0, fontSize: '1rem' }}>Conectando Tatuadores Viajantes e Estúdios do Mundo Todo.</p>
        </div>
        
        <SignedIn>
          <button className="wte-nav-btn" onClick={() => setIsModalOpen(true)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(238, 195, 88, 0.1)' }}>
            <PlusCircle size={18} />
            {profile?.role === 'studio' ? 'Anunciar Vaga Guest' : 'Anunciar Viagem'}
          </button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="wte-nav-btn" style={{ padding: '0.75rem 1.5rem', background: 'rgba(238, 195, 88, 0.1)' }}>
              Faça Login para Anunciar
            </button>
          </SignInButton>
        </SignedOut>
      </div>

      {/* Tabs */}
      <div className="wte-status-tabs" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <div className={`wte-tab ${activeTab === 'spots' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('spots')}>
          <div className="wte-tab-title"><Briefcase size={16}/> Vagas em Estúdios</div>
          <div className="wte-tab-count">{guestSpots.length}</div>
        </div>
        <div className={`wte-tab ${activeTab === 'travels' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('travels')}>
          <div className="wte-tab-title"><User size={16}/> Tatuadores Viajando</div>
          <div className="wte-tab-count">{travelPlans.length}</div>
        </div>
      </div>

      {/* Listings */}
      <div className="wte-events-grid">
        {activeTab === 'spots' && guestSpots.map(spot => (
          <div key={spot.id} className="wte-event-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--wte-gold-strong)', margin: '0 0 1rem 0' }}>{spot.title}</h3>
            
            <div className="wte-event-meta"><Briefcase size={14} /> Estúdio: {spot.studio?.name}</div>
            <div className="wte-event-meta"><MapPin size={14} /> Local: {spot.city}, {spot.country}</div>
            <div className="wte-event-meta"><Calendar size={14} /> Período: {spot.start_date || 'Aberto'} até {spot.end_date || 'Aberto'}</div>
            
            <p className="wte-event-desc">{spot.description}</p>
            
            <a href={`https://wa.me/${spot.studio?.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="wte-view-event-btn" style={{ textDecoration: 'none' }}>
              <MessageCircle size={16} /> Chamar Estúdio no WhatsApp
            </a>
          </div>
        ))}

        {activeTab === 'travels' && travelPlans.map(plan => (
          <div key={plan.id} className="wte-event-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--wte-gold-strong)', margin: '0 0 1rem 0' }}>{plan.artist?.name} em {plan.destination_city}</h3>
            
            <div className="wte-event-meta"><User size={14} /> Tatuador(a): {plan.artist?.name}</div>
            <div className="wte-event-meta"><MapPin size={14} /> Destino: {plan.destination_city}, {plan.destination_country}</div>
            <div className="wte-event-meta"><Calendar size={14} /> Datas: {plan.start_date} a {plan.end_date}</div>
            
            <p className="wte-event-desc">{plan.description}</p>
            
            <a href={`https://wa.me/${plan.artist?.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="wte-view-event-btn" style={{ textDecoration: 'none' }}>
              <MessageCircle size={16} /> Fazer Convite via WhatsApp
            </a>
          </div>
        ))}
        
        {((activeTab === 'spots' && guestSpots.length === 0) || (activeTab === 'travels' && travelPlans.length === 0)) && (
          <p style={{ color: 'rgba(255,255,255,0.5)', gridColumn: '1 / -1' }}>Nenhum anúncio encontrado no momento.</p>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="wte-advanced-filters" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 className="wte-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {profile?.role === 'studio' ? 'Anunciar Vaga Guest' : 'Anunciar Viagem'}
            </h2>
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {profile?.role === 'studio' ? (
                <>
                  <input className="wte-search-input" placeholder="Título da Vaga (ex: Cadeira livre para Setembro)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </>
              ) : (
                <>
                  <input className="wte-search-input" placeholder="Cidade de Destino" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                  <input className="wte-search-input" placeholder="País (ex: Brasil)" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} required />
                </>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="date" className="wte-search-input" style={{ padding: '0 1rem' }} value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} required />
                <input type="date" className="wte-search-input" style={{ padding: '0 1rem' }} value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} required />
              </div>
              
              <textarea className="wte-search-input" placeholder="Descreva os detalhes..." style={{ height: '100px', paddingTop: '1rem' }} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="wte-nav-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="wte-nav-btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--wte-gold)', color: 'black' }}>Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
