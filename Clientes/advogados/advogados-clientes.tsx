import { useState } from 'react';
import AdCadastrar from './ad-cadastrar';
import Adlistar from './ad-listar';
import '../Padrao.css';
export default function Processos() {
  const [modo, setModo] = useState<'listar' | 'cadastrar'>('listar');

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setModo('listar')} disabled={modo === 'listar'}>
          Listar Advogados
        </button>{' '}
        <button onClick={() => setModo('cadastrar')} disabled={modo === 'cadastrar'}>
          Cadastrar Advogados
        </button>
      </nav>

      {modo === 'listar' && <Adlistar />}
      {modo === 'cadastrar' && <AdCadastrar />}
    </div>
  );
}
