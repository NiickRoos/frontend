import { useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onFinishCliente: () => void;
  onFinishAdmin: () => void;
}

export default function SplashScreen({ onFinishCliente, onFinishAdmin }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = (action: () => void) => {
    setFadeOut(true);
    setTimeout(() => action(), 1000);
  };

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="overlay" />
      <div className="content">
        <h1 className="title">Roos & Mirande</h1>
        <p className="subtitle">Gestão Jurídica Inteligente</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="enter-button" onClick={() => handleEnter(onFinishCliente)}>
            Entrar como Cliente
          </button>
          <button className="enter-button" onClick={() => handleEnter(onFinishAdmin)}>
            Entrar como Administrador
          </button>
        </div>
      </div>
    </div>
  );
}
