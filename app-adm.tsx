import { Routes, Route, Link } from 'react-router-dom';
import Processos from './Admin/processos/processos-adm';
import Advogados from './Admin/advogados/advogados-adm';
import Clientes from './Admin/clientes/clientes-adm';
import RelatoriosAdm from './Admin/relatorios/relatorios-adm';
import './app-adm.css';



interface AppAdminProps {
  voltar: () => void;
}

export default function AppAdmin({ voltar }: AppAdminProps) {
  return (
    <div>
     
      <nav className="menu-fixo">
        <Link to="/" className="menu-link">Início</Link>
        <Link to="/processos" className="menu-link">Processos</Link>
        <Link to="/advogados" className="menu-link">Advogados</Link>
        <Link to="/clientes" className="menu-link">Clientes</Link>
        <Link to="/relatorios" className="menu-link">Relatórios</Link>
        <button className="voltar-button" onClick={voltar}>
          Voltar à Tela Inicial
        </button>
      </nav>

      <main className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Área dos Advogados</h1>
                <h2>Bem-vindo ao Portal dos Advogados!</h2>
                <p>
                  Nesta área, você pode gerenciar seus processos, clientes e informações profissionais e 
                  ver Relatórios.
                  Use o menu acima para navegar entre as seções.
                </p>
                <h2>Funcionalidades</h2>
                <p>
                  Realize alterações em processos, clientes ou advogados já cadastrados ou exclua informações
                  cadastradas, garantindo assim  melhor organização!
                </p>
              </>
            }
          />
          <Route path="/processos" element={<Processos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/advogados" element={<Advogados />} />
          <Route path="/relatorios" element={<RelatoriosAdm />} />
          <Route path="*" element={<h1 className="not-found">Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}
