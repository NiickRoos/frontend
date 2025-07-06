import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './main.css';
import SplashScreen from './Tela-Temporaria/SplashScreen';

//Área de clientes
import Processos from './Clientes/processos/processos-clientes';
import Advogados from './Clientes/advogados/advogados-clientes';
import Clientes from './Clientes/clientes/clientes-clientes';

//Área do adm
import AdvogadoAdm from './Admin/advogados/advogados-adm';
import ClienteAdm from './Admin/clientes/clientes-adm';
import ProcessoAdm from './Admin/processos/processos-adm';

function Main() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <App />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/processos">Processos</Link>
          <Link to="/advogados">Advogados</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/admin/processos">[ADM] Processos</Link>
          <Link to="/admin/advogados">[ADM] Advogados</Link>
          <Link to="/admin/clientes">[ADM] Clientes</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Bem-vindo à aplicação!</h1>} />
          <Route path="/processos" element={<Processos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/advogados" element={<Advogados />} />
          <Route path="/admin/processos" element={<ProcessoAdm />} />
          <Route path="/admin/advogados" element={<AdvogadoAdm />} />
          <Route path="/admin/clientes" element={<ClienteAdm />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);
