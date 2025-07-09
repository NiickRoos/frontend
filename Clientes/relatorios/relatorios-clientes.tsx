import { useEffect, useState } from 'react';
import '../relatorios/relatorios-clientes.css'; // Certifique-se de que esse arquivo existe ou atualize o caminho

interface Relatorio {
  numero_processo: string;
  status: string;
  cliente: string;
  advogado: string;
  area: string;
  data_abertura: string;
  data_encerramento: string;
}

function RelatoriosClientes() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/relatorios-clientes/') // Atualize a rota se necessário
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar relatórios');
        }
        return response.json();
      })
      .then(data => setRelatorios(data))
      .catch(error => {
        console.error(error);
        setErro('Não foi possível carregar os relatórios.');
      });
  }, []);

  return (
    <div className="relatorios-clientes-container">
      <h2 className="relatorios-title">Relatórios de Processos - Cliente</h2>
      {erro && <p className="error-message">{erro}</p>}
      <div className="table-container">
        <table className="relatorios-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Status</th>
              <th>Cliente</th>
              <th>Advogado</th>
              <th>Área</th>
              <th>Data Abertura</th>
              <th>Data Encerramento</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((rel, index) => (
              <tr key={index}>
                <td>{rel.numero_processo}</td>
                <td>
                  <span className={`status-badge ${rel.status.toLowerCase()}`}>
                    {rel.status}
                  </span>
                </td>
                <td>{rel.cliente}</td>
                <td>{rel.advogado}</td>
                <td>{rel.area}</td>
                <td>{new Date(rel.data_abertura).toLocaleDateString()}</td>
                <td>{rel.data_encerramento ? new Date(rel.data_encerramento).toLocaleDateString() : '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default relatoriosclientes;
