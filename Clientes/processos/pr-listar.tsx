import { useEffect, useState } from 'react';

interface Processo {
  idprocessos: number;
  numero_processo: string;
  descricao: string;
  status: string;
  data_abertura: string;
  data_encerramento: string | null;
  Clientes_idClientes: number;
  Advogados_idAdvogados: number;
  Areas_idareas: number;
}

export default function PrListar() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/processos')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar processos');
        return res.json();
      })
      .then((data) => setProcessos(data))
      .catch((err) => setErro(err.message));
  }, []);

  return (
    <div>
      <h2>Listar Processos</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {processos.length === 0 ? (
        <p>Nenhum processo encontrado.</p>
      ) : (
        <table border={1}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Abertura</th>
              <th>Encerramento</th>
              <th>ID Cliente</th>
              <th>ID Advogado</th>
              <th>ID Área</th>
            </tr>
          </thead>
          <tbody>
            {processos.map((p) => (
              <tr key={p.idprocessos}>
                <td>{p.idprocessos}</td>
                <td>{p.numero_processo}</td>
                <td>{p.descricao}</td>
                <td>{p.status}</td>
                <td>{p.data_abertura}</td>
                <td>{p.data_encerramento || '---'}</td>
                <td>{p.Clientes_idClientes}</td>
                <td>{p.Advogados_idAdvogados}</td>
                <td>{p.Areas_idareas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
