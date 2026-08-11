import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image, User, Mail, Smartphone, CreditCard, ArrowLeft } from 'lucide-react';

export default function MastersInkSelection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    cpf: '',
    email: '',
    instagram: '',
    portfolioLink: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Formata a mensagem para o WhatsApp
    const message = `*INSCRIÇÃO: STAND MESTRES DA TATTOO (MASTERS INK)*%0A%0A` +
      `*Nome:* ${formData.name}%0A` +
      `*WhatsApp:* ${formData.whatsapp}%0A` +
      `*CPF:* ${formData.cpf}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Instagram:* ${formData.instagram}%0A` +
      `*Link do Portfólio (Fotos):* ${formData.portfolioLink}%0A%0A` +
      `_Estou enviando as fotos do meu trabalho logo abaixo!_`;

    const wppNumber = '5521985262854';
    const wppUrl = `https://wa.me/${wppNumber}?text=${message}`;
    
    window.open(wppUrl, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050608', color: 'white', padding: '2rem 1.5rem', fontFamily: "'Roboto', sans-serif" }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: 'none', color: 'var(--wte-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={20} /> Voltar ao Início
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--wte-gold)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '2px' }}>SELEÇÃO EXCLUSIVA - 10 VAGAS</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: 900, lineHeight: 1.2 }}>
            Stand Mestres da Tattoo<br/>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>@ Masters Ink</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.5 }}>
            Juiz de Fora - MG. Garanta sua vaga no nosso stand oficial. Preencha os dados abaixo e entraremos em contato.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,204,13,0.2)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input type="text" name="name" required onChange={handleChange} value={formData.name} placeholder="Seu nome" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input type="tel" name="whatsapp" required onChange={handleChange} value={formData.whatsapp} placeholder="(DDD) 99999-9999" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>CPF</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input type="text" name="cpf" required onChange={handleChange} value={formData.cpf} placeholder="000.000.000-00" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input type="email" name="email" required onChange={handleChange} value={formData.email} placeholder="seu@email.com" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>Link do Instagram</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>@</span>
                <input type="text" name="instagram" required onChange={handleChange} value={formData.instagram} placeholder="seuperfil" style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>Link do Portfólio (Google Drive, Behance, etc) - Opcional</label>
              <div style={{ position: 'relative' }}>
                <Image size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input type="url" name="portfolioLink" onChange={handleChange} value={formData.portfolioLink} placeholder="https://..." style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Você também poderá anexar suas fotos diretamente no WhatsApp após clicar em enviar.</p>
            </div>

            <button type="submit" style={{ marginTop: '1rem', background: 'var(--wte-gold)', color: 'black', padding: '1.2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Send size={20} /> Enviar Inscrição
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Você será redirecionado para o WhatsApp com os seus dados.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
