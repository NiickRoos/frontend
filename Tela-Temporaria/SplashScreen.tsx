import { useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => onFinish(), 1000);
  };

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="overlay" />
      <div className="content">
        <h1 className="title">Roos & Mirande</h1>
        <p className="subtitle">Gestão Jurídica Inteligente</p>
        <button className="enter-button" onClick={handleEnter}>
          Entrar
        </button>
      </div>
    </div>
  );
}
