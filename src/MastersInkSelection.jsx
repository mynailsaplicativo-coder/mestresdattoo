import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Mail, Smartphone, CreditCard, ArrowLeft } from 'lucide-react';

export default function MastersInkSelection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    cpf: '',
    email: '',
    instagram: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `*INSCRIÇÃO: STAND MESTRES DA TATTOO (MASTERS INK)*%0A%0A` +
      `*Nome:* ${formData.name}%0A` +
      `*WhatsApp:* ${formData.whatsapp}%0A` +
      `*CPF:* ${formData.cpf}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Instagram:* @${formData.instagram}`;

    const wppUrl = `https://wa.me/5521985262854?text=${message}`;
    window.open(wppUrl, '_blank');
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.4)'
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
          <span style={{ color: 'var(--wte-gold)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '2px' }}>SELEÇÃO EXCLUSIVA — 10 VAGAS</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: 900, lineHeight: 1.2 }}>
            Stand Mestres da Tattoo<br/>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>@ Masters Ink</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Juiz de Fora - MG. Garanta sua vaga no nosso stand oficial.<br/>
            Preencha os dados abaixo e entraremos em contato.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,204,13,0.2)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Nome */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={iconStyle} />
                <input type="text" name="name" required onChange={handleChange} value={formData.name} placeholder="Seu nome artístico ou completo" style={inputStyle} />
              </div>
            </div>

            {/* WhatsApp + CPF */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={iconStyle} />
                  <input type="tel" name="whatsapp" required onChange={handleChange} value={formData.whatsapp} placeholder="(21) 99999-9999" style={inputStyle} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>CPF</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={iconStyle} />
                  <input type="text" name="cpf" required onChange={handleChange} value={formData.cpf} placeholder="000.000.000-00" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* E-mail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={iconStyle} />
                <input type="email" name="email" required onChange={handleChange} value={formData.email} placeholder="seu@email.com" style={inputStyle} />
              </div>
            </div>

            {/* Instagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Instagram</label>
              <div style={{ position: 'relative' }}>
                <span style={{ ...iconStyle, fontWeight: 'bold', fontSize: '1rem' }}>@</span>
                <input type="text" name="instagram" required onChange={handleChange} value={formData.instagram} placeholder="seuperfil" style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
              </div>
            </div>

            {/* Botão */}
            <button type="submit" style={{ marginTop: '0.5rem', background: 'var(--wte-gold)', color: 'black', padding: '1.2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Send size={20} /> Enviar Inscrição
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              Você será redirecionado para o WhatsApp com seus dados já preenchidos.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
