import { Routes, Route, Link } from 'react-router-dom';
import Processos from './Clientes/processos/processos-clientes';
import Advogados from './Clientes/advogados/advogados-clientes';
import Clientes from './Clientes/clientes/clientes-clientes';
import Relatorios from './Clientes/relatorios/relatorios-clientes';
import './app-cliente.css';



interface AppClienteProps {
  voltar: () => void;
}

export default function AppCliente({ voltar }: AppClienteProps) {
  return (
    <div>
     
  

      <nav className="menu-fixo">
        <Link to="/" className="menu-link">Início</Link>
        <Link to="/processos" className="menu-link">Processos</Link>
        <Link to="/advogados" className="menu-link">Advogados</Link>
        <Link to="/clientes" className="menu-link">Clientes</Link>
        <Link to="/relatoriosclientes" className="menu-link">Relatórios</Link>
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
                <h1>Bem-vindo, Cliente!</h1>
                <h2>Sobre o Sistema</h2>
                <p>
                  Este sistema oferece uma gestão jurídica inteligente, facilitando o controle
                  dos processos, advogados e clientes. Utilize o menu acima para navegar entre as áreas.
                </p>
                <h2>Como Usar</h2>
                <p>
                  Navegue pelas seções para consultar ou gerenciar suas informações. Em “Processos” você acompanha os processos jurídicos,
                  em “Advogados” visualiza os profissionais disponíveis, em “Clientes” acessa dados dos clientes cadastrados e em "relatorios"
                  você pode consultar como andam cada caso cadastrado na nossa gestão juridica!
                </p>
              </>
            }
          />
          <Route path="/processos" element={<Processos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/advogados" element={<Advogados />} />
           <Route path="/relatoriosclientes" element={<Relatorios />} />
          <Route path="*" element={<h1 className="not-found">Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}
