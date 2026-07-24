import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '40px', left: '2rem', background: 'transparent', border: 'none', color: 'var(--wte-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
      >
        <ArrowLeft size={20} /> Voltar ao Início
      </button>

      <SignIn routing="path" path="/auth" fallbackRedirectUrl="/" />
    </div>
  );
}
