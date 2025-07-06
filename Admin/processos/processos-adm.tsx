import { useEffect, useState } from 'react';

interface Processo {
  idprocessos: number;
  numero_processo: string;
  descricao: string;
  status: string;
  data_abertura: string;
  data_encerramento?: string | null;
  Clientes_idClientes: number;
  Advogados_idAdvogados: number;
  Areas_idareas: number;
}

export default function PrAdm() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [editarProcesso, setEditarProcesso] = useState<Processo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar lista de processos
  useEffect(() => {
    fetch('http://localhost:3000/processos')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar processos');
        return res.json();
      })
      .then((data) => setProcessos(data))
      .catch((err) => setErro(err.message));
  }, []);

  // Atualizar os campos do processo em edição
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editarProcesso) return;
    const { name, value } = e.target;
    setEditarProcesso({
      ...editarProcesso,
      [name]: name.includes('id') ? Number(value) : value
    });
  };

  // Enviar atualização para o backend
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editarProcesso) return;

    try {
      const resposta = await fetch(`http://localhost:3000/processos/${editarProcesso.idprocessos}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarProcesso),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Processo atualizado com sucesso!');
        // Atualizar lista local para refletir mudança
        setProcessos(processos.map(p => p.idprocessos === editarProcesso.idprocessos ? editarProcesso : p));
        setEditarProcesso(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar processo');
    }
  };

  // Deletar processo
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este processo?')) return;

    try {
      const resposta = await fetch(`http://localhost:3000/processos/${id}`, {
        method: 'DELETE',
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Processo deletado com sucesso!');
        setProcessos(processos.filter(p => p.idprocessos !== id));
        if (editarProcesso && editarProcesso.idprocessos === id) setEditarProcesso(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar processo');
    }
  };

  return (
    <div>
      <h2>Gerenciar Processos (Admin)</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border={1} cellPadding={5} cellSpacing={0}>
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
            <th>Ações</th>
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
              <td>
                <button onClick={() => setEditarProcesso(p)}>Editar</button>{' '}
                <button onClick={() => handleDelete(p.idprocessos)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editarProcesso && (
        <div style={{ marginTop: '20px' }}>
          <h3>Editar Processo ID: {editarProcesso.idprocessos}</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="numero_processo"
              placeholder="Número do Processo"
              value={editarProcesso.numero_processo}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={editarProcesso.descricao}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={editarProcesso.status}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="data_abertura"
              value={editarProcesso.data_abertura}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="data_encerramento"
              value={editarProcesso.data_encerramento || ''}
              onChange={handleChange}
            />
            <input
              type="number"
              name="Clientes_idClientes"
              placeholder="ID do Cliente"
              value={editarProcesso.Clientes_idClientes}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="Advogados_idAdvogados"
              placeholder="ID do Advogado"
              value={editarProcesso.Advogados_idAdvogados}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="Areas_idareas"
              placeholder="ID da Área"
              value={editarProcesso.Areas_idareas}
              onChange={handleChange}
              required
            />
            <button type="submit">Atualizar</button>{' '}
            <button type="button" onClick={() => setEditarProcesso(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
