
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route, Routes, Link } from 'react-router-dom';

// Importa seus componentes/páginas
import AdCadastrar from './Clientes/advogados/ad-cadastrar';
import AdListar from './Clientes/advogados/ad-listar';
import ClCadastrar from './Clientes/clientes/cl-cadastrar';
import ClListar from './Clientes/clientes/cl-listar';
import PrCadastrar from './Clientes/processos/pr-cadastar';
import PrListar from './Clientes/processos/pr-listar';

function App() {
  return (
    <div>
      <nav>
        <Link to="/advogados/cadastrar">Cadastrar Advogado</Link> |{' '}
        <Link to="/advogados/listar">Listar Advogados</Link> |{' '}
        <Link to="/clientes/cadastrar">Cadastrar Cliente</Link> |{' '}
        <Link to="/clientes/listar">Listar Clientes</Link> |{' '}
        <Link to="/processos/cadastrar">Cadastrar Processo</Link> |{' '}
        <Link to="/processos/listar">Listar Processos</Link>
      </nav>

      <Routes>
        <Route path="/advogados/cadastrar" element={<AdCadastrar />} />
        <Route path="/advogados/listar" element={<AdListar />} />
        <Route path="/clientes/cadastrar" element={<ClCadastrar />} />
        <Route path="/clientes/listar" element={<ClListar />} />
        <Route path="/processos/cadastrar" element={<PrCadastrar />} />
        <Route path="/processos/listar" element={<PrListar />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

// Cria as rotas principais, aqui "/" renderiza o componente App com as rotas internas
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // se quiser, pode colocar rotas principais adicionais aqui
]);

// Renderiza a aplicação
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
