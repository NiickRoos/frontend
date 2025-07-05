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

  useEffect(() => {
    fetch('http://localhost:3000/advogados')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar advogados');
        return res.json();
      })
      .then((data) => setAdvogados(data))
      .catch((err) => setErro(err.message));
  }, []);

  return (
    <div>
      <h2>Listar Advogados</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {advogados.length === 0 ? (
        <p>Nenhum advogado encontrado.</p>
      ) : (
        <table border={1}>
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
      )}
    </div>
  );
}
