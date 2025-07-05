import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';


import Processos from './Clientes/processos/processos';
import Advogados from './Clientes/advogados/advogados';
import Clientes from './Clientes/clientes/clientes';



function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/processos">Processos</Link>
          <Link to="/advogados">advogados</Link>
          <Link to="/clientes">clientes</Link>
          
        </nav>

        <Routes>
          {/* Rota raiz mostrando mensagem */}
          <Route path="/" element={<h1>Bem-vindo à aplicação!</h1>} />

          {/* Se preferir redirecionar o / para listar processos, descomente a linha abaixo e comente a anterior */}
          {/* <Route path="/" element={<Navigate to="/processos/listar" replace />} /> */}

          {/*<Route path="/advogados/cadastrar" element={<AdCadastrar />} />
          <Route path="/advogados/listar" element={<AdListar />} />
          <Route path="/clientes/cadastrar" element={<ClCadastrar />} />
          <Route path="/clientes/listar" element={<ClListar />} />
          */}
          <Route path="/processos" element={<Processos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/advogados" element={<Advogados />} />

          {//Route path="/processos/listar" element={<PrListar />} />
          }

          {/* Rota para página não encontrada */}
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
