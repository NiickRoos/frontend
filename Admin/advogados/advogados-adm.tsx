import { useEffect, useState } from 'react';
import './ad.css';
interface Advogado {
  idAdvogados: number;
  nome: string;
  oab: string;
  email: string;
  telefone: string;
  especialidade: string;
}

export default function AdvogadosAdm() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [editarAdvogado, setEditarAdvogado] = useState<Advogado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega advogados
  useEffect(() => {
    fetch('http://localhost:3000/advogados')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar advogados');
        return res.json();
      })
      .then(data => setAdvogados(data))
      .catch(err => setErro(err.message));
  }, []);

  // Atualiza os campos do advogado em edição
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editarAdvogado) return;
    const { name, value } = e.target;
    setEditarAdvogado({
      ...editarAdvogado,
      [name]: value,
    });
  };

  // Atualiza advogado via API
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editarAdvogado) return;

    try {
      const resposta = await fetch(`http://localhost:3000/advogados/${editarAdvogado.idAdvogados}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarAdvogado),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Advogado atualizado com sucesso!');
        setAdvogados(advogados.map(a => (a.idAdvogados === editarAdvogado.idAdvogados ? editarAdvogado : a)));
        setEditarAdvogado(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar advogado');
    }
  };

  // Deleta advogado via API
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este advogado?')) return;

    try {
      const resposta = await fetch(`http://localhost:3000/advogados/${id}`, {
        method: 'DELETE',
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Advogado deletado com sucesso!');
        setAdvogados(advogados.filter(a => a.idAdvogados !== id));
        if (editarAdvogado && editarAdvogado.idAdvogados === id) setEditarAdvogado(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar advogado');
    }
  };

  return (
    <div>
      <h2>Gerenciar Advogados (Admin)</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>OAB</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Especialidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {advogados.map(a => (
            <tr key={a.idAdvogados}>
              <td>{a.idAdvogados}</td>
              <td>{a.nome}</td>
              <td>{a.oab}</td>
              <td>{a.email}</td>
              <td>{a.telefone}</td>
              <td>{a.especialidade}</td>
              <td>
                <button onClick={() => setEditarAdvogado(a)}>Editar</button>{' '}
                <button onClick={() => handleDelete(a.idAdvogados)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editarAdvogado && (
        <div style={{ marginTop: '20px' }}>
          <h3>Editar Advogado ID: {editarAdvogado.idAdvogados}</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={editarAdvogado.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="oab"
              placeholder="OAB"
              value={editarAdvogado.oab}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editarAdvogado.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={editarAdvogado.telefone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="especialidade"
              placeholder="Especialidade"
              value={editarAdvogado.especialidade}
              onChange={handleChange}
              required
            />
            <button type="submit">Atualizar</button>{' '}
            <button type="button" onClick={() => setEditarAdvogado(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
