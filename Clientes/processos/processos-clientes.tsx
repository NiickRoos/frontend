import { useState } from 'react';
import PrCadastrar from './pr-cadastar';
import PrListar from './pr-listar';

export default function Processos() {
  const [modo, setModo] = useState<'listar' | 'cadastrar'>('listar');

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setModo('listar')} disabled={modo === 'listar'}>
          Listar Processos
        </button>{' '}
        <button onClick={() => setModo('cadastrar')} disabled={modo === 'cadastrar'}>
          Cadastrar Processo
        </button>
      </nav>

      {modo === 'listar' && <PrListar />}
      {modo === 'cadastrar' && <PrCadastrar />}
    </div>
  );
}
