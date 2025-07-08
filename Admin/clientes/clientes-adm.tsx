import { useEffect, useState } from 'react';
import '../Padrao.css';

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

interface Alteracao {
  campo: string;
  valorAnterior: string;
  novoValor: string;
}

export default function ClientesAdm() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editarCliente, setEditarCliente] = useState<Cliente | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([]);
  const [mostrarAlteracoes, setMostrarAlteracoes] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/clientes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar clientes');
        return res.json();
      })
      .then(data => setClientes(data))
      .catch(err => setErro(err.message));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editarCliente) return;

    const { name, value } = e.target;
    const valorAnterior = (editarCliente as any)[name];

    if (valorAnterior !== value) {
      setAlteracoes(prev => {
        const existe = prev.find(a => a.campo === name);
        if (existe) {
          return prev.map(a =>
            a.campo === name ? { ...a, novoValor: value } : a
          );
        } else {
          return [...prev, { campo: name, valorAnterior, novoValor: value }];
        }
      });
    }

    setEditarCliente({ ...editarCliente, [name]: value });
  };

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
        setAlteracoes([]);
        setMostrarAlteracoes(false);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cliente deletado com sucesso!');
        setClientes(clientes.filter(c => c.idClientes !== id));
        if (editarCliente?.idClientes === id) {
          setEditarCliente(null);
          setAlteracoes([]);
        }
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar cliente');
    }
  };

  return (
    <div className="container-principal">
      <h2 className="titulo-principal">Painel de Gerenciamento de Clientes</h2>
      <p className="subtitulo">Abaixo estão listados todos os clientes cadastrados no sistema.</p>

      {erro && <p className="mensagem mensagem-erro">{erro}</p>}

      <div className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Documentos</th>
              <th>Tipo</th>
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
                  <button className="botao botao-editar" onClick={() => {
                    setEditarCliente(c);
                    setAlteracoes([]);
                    setMostrarAlteracoes(false);
                  }}>Editar</button>
                  <button className="botao botao-deletar" onClick={() => handleDelete(c.idClientes)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editarCliente && (
        <div className="formulario-container">
          <h3 className="formulario-titulo">Editar Cliente #{editarCliente.idClientes}</h3>
          <form onSubmit={handleUpdate}>
            <input type="text" name="nome" placeholder="Nome completo" value={editarCliente.nome} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={editarCliente.email} onChange={handleChange} required />
            <input type="text" name="telefone" placeholder="Telefone" value={editarCliente.telefone} onChange={handleChange} required />
            <input type="text" name="documentos" placeholder="Documentos" value={editarCliente.documentos} onChange={handleChange} required />
            <select name="tipo_de_documento" value={editarCliente.tipo_de_documento} onChange={handleChange} required>
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </select>
            <input type="text" name="endereco" placeholder="Endereço" value={editarCliente.endereco} onChange={handleChange} required />
            <input type="text" name="estado" placeholder="Estado" value={editarCliente.estado} onChange={handleChange} required />

            <div className="formulario-botoes">
              <button type="button" className="botao botao-secundario" onClick={() => setMostrarAlteracoes(!mostrarAlteracoes)}>
                {mostrarAlteracoes ? 'Ocultar Alterações' : 'Ver Alterações'}
              </button>
              <button type="button" className="botao botao-secundario" onClick={() => {
                setEditarCliente(null);
                setAlteracoes([]);
                setMostrarAlteracoes(false);
              }}>
                Cancelar
              </button>
              <button type="submit" className="botao botao-primario">Salvar Alterações</button>
            </div>
          </form>

          {mostrarAlteracoes && alteracoes.length > 0 && (
            <div className="tabela-alteracoes-container">
              <h4>Resumo das Alterações</h4>
              <table className="tabela-alteracoes">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Valor Anterior</th>
                    <th>Novo Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {alteracoes.map((alt, index) => (
                    <tr key={index}>
                      <td>{alt.campo.replace(/_/g, ' ')}</td>
                      <td>{alt.valorAnterior}</td>
                      <td>{alt.novoValor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
