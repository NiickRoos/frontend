import { useEffect, useState } from 'react';

interface Cliente {
  idClientes: number;
  nome: string;
  email: string;
  telefone: string;
  documentos: string;
  tipo_de_documento: 'CPF' | 'CNPJ';
  endereco: string;
  estado: string;
}

export default function ClientesAdm() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editarCliente, setEditarCliente] = useState<Cliente | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega a lista de clientes
  useEffect(() => {
    fetch('http://localhost:3000/clientes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar clientes');
        return res.json();
      })
      .then(data => setClientes(data))
      .catch(err => setErro(err.message));
  }, []);

  // Atualiza os campos do cliente em edição
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editarCliente) return;
    const { name, value } = e.target;
    setEditarCliente({
      ...editarCliente,
      [name]: value
    });
  };

  // Atualiza cliente via API
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editarCliente) return;

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${editarCliente.idClientes}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarCliente),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cliente atualizado com sucesso!');
        setClientes(clientes.map(c => c.idClientes === editarCliente.idClientes ? editarCliente : c));
        setEditarCliente(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar cliente');
    }
  };

  // Deleta cliente via API
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cliente deletado com sucesso!');
        setClientes(clientes.filter(c => c.idClientes !== id));
        if (editarCliente && editarCliente.idClientes === id) setEditarCliente(null);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar cliente');
    }
  };

  return (
    <div>
      <h2>Gerenciar Clientes (Admin)</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Documentos</th>
            <th>Tipo Documento</th>
            <th>Endereço</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.idClientes}>
              <td>{c.idClientes}</td>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td>{c.documentos}</td>
              <td>{c.tipo_de_documento}</td>
              <td>{c.endereco}</td>
              <td>{c.estado}</td>
              <td>
                <button onClick={() => setEditarCliente(c)}>Editar</button>{' '}
                <button onClick={() => handleDelete(c.idClientes)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editarCliente && (
        <div style={{ marginTop: '20px' }}>
          <h3>Editar Cliente ID: {editarCliente.idClientes}</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={editarCliente.nome}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editarCliente.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={editarCliente.telefone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="documentos"
              placeholder="Documentos"
              value={editarCliente.documentos}
              onChange={handleChange}
              required
            />
            <select
              name="tipo_de_documento"
              value={editarCliente.tipo_de_documento}
              onChange={handleChange}
              required
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </select>
            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={editarCliente.endereco}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={editarCliente.estado}
              onChange={handleChange}
              required
            />
            <button type="submit">Atualizar</button>{' '}
            <button type="button" onClick={() => setEditarCliente(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
