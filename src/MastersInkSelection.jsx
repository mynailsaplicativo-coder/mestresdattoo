import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, User, Mail, Smartphone, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function MastersInkSelection() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
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

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert("Por favor, anexe pelo menos 1 foto do seu trabalho.");
      return;
    }

    setIsUploading(true);
    let uploadedUrls = [];

    try {
      // Faz o upload de cada arquivo para o Supabase
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `selecao_masters/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('mestres_imagens')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('mestres_imagens')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer o upload das imagens. O administrador precisa configurar o Banco de Dados (Supabase). Se preferir, tente enviar pelo WhatsApp diretamente.");
      setIsUploading(false);
      return;
    }

    setIsUploading(false);

    // Formata a mensagem para o WhatsApp com os links das imagens
    const photosText = uploadedUrls.map((url, i) => `Foto ${i+1}: ${url}`).join('%0A');
    
    const message = `*INSCRIÇÃO: STAND MESTRES DA TATTOO (MASTERS INK)*%0A%0A` +
      `*Nome:* ${formData.name}%0A` +
      `*WhatsApp:* ${formData.whatsapp}%0A` +
      `*CPF:* ${formData.cpf}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Instagram:* ${formData.instagram}%0A%0A` +
      `*Fotos do Trabalho (Anexadas pelo site):*%0A${photosText}`;

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
            Juiz de Fora - MG. Garanta sua vaga no nosso stand oficial. Preencha os dados abaixo, envie suas fotos e entraremos em contato.
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
              <label style={{ fontSize: '0.9rem', color: 'var(--wte-gold)', fontWeight: 'bold' }}>Anexar Fotos do Trabalho (Máx: 5)</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input type="file" multiple accept="image/*" required onChange={handleFileChange} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,204,13,0.3)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Você pode selecionar várias fotos de uma vez.</p>
            </div>

            <button disabled={isUploading} type="submit" style={{ marginTop: '1rem', background: 'var(--wte-gold)', color: 'black', padding: '1.2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 900, cursor: isUploading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: isUploading ? 0.7 : 1 }}>
              {isUploading ? (
                <><Loader2 size={20} className="spin" /> Processando Imagens...</>
              ) : (
                <><Send size={20} /> Enviar Inscrição</>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>As fotos serão salvas no sistema e você será redirecionado para o WhatsApp com os links das imagens gerados automaticamente.</p>
          </form>
        </div>
      </div>
      <style>{`
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
