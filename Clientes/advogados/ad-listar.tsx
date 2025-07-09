import { useEffect, useState } from 'react';

interface Advogado {
  idAdvogados: number;
  nome: string;
  oab: string;
  email: string;
  telefone: string;
  especialidade: string;
}

export default function AdListar() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/advogados')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar advogados');
        return res.json();
      })
      .then((data) => {
        setAdvogados(data);
        setErro(null);
      })
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando advogados...</p>;

  return (
    <div className="container-principal">
      <h2>Listar Advogados</h2>
      {erro && <p className="mensagem-erro">{erro}</p>}
      {advogados.length === 0 && !erro ? (
        <p>Nenhum advogado encontrado.</p>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>OAB</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody>
              {advogados.map((a) => (
                <tr key={a.idAdvogados}>
                  <td>{a.idAdvogados}</td>
                  <td>{a.nome}</td>
                  <td>{a.oab}</td>
                  <td>{a.email}</td>
                  <td>{a.telefone}</td>
                  <td>{a.especialidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
