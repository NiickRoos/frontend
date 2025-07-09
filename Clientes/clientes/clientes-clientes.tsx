import { useState } from 'react';
import ClCadastrar from './cl-cadastrar';
import ClListar from './cl-listar';
import '../Padrao.css';
export default function Processos() {
  const [modo, setModo] = useState<'listar' | 'cadastrar'>('listar');

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setModo('listar')} disabled={modo === 'listar'}>
          Listar clientes
        </button>{' '}
        <button onClick={() => setModo('cadastrar')} disabled={modo === 'cadastrar'}>
          Cadastrar clientes
        </button>
      </nav>

      {modo === 'listar' && <ClListar />}
      {modo === 'cadastrar' && <ClCadastrar />}
    </div>
  );
}
