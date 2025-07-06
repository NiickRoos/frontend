// main.tsx
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import SplashScreen from './Tela-Temporaria/SplashScreen';
import AppCliente from './app-cliente';
import AppAdmin from './app-adm';


function Main() {
  const [tela, setTela] = useState<'splash' | 'cliente' | 'admin'>('splash');

  let Conteudo;

  if (tela === 'splash') {
    Conteudo = (
      <SplashScreen 
        onFinishCliente={() => setTela('cliente')} 
        onFinishAdmin={() => setTela('admin')} 
      />
    );
  } else if (tela === 'cliente') {
    Conteudo = <AppCliente voltar={() => setTela('splash')} />;
  } else if (tela === 'admin') {
    Conteudo = <AppAdmin voltar={() => setTela('splash')} />;
  }

  return (
    <BrowserRouter>
      {Conteudo}
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);
