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

export default function ClientesAdm() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editarCliente, setEditarCliente] = useState<Cliente | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);

  useEffect(() => {
    setCarregando(true);
    fetch('http://localhost:3000/clientes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar clientes');
        return res.json();
      })
      .then(data => setClientes(data))
      .catch(err => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editarCliente) return;

    const { name, value } = e.target;

    const validarCampo = (campo: string, valor: string): boolean => {
      const apenasNumeros = /^[0-9]*$/;
      const apenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;

      switch (campo) {
        case 'telefone':
        case 'documentos':
          return apenasNumeros.test(valor);
        case 'nome':
        case 'estado':
          return apenasLetras.test(valor);
        default:
          return true;
      }
    };

    if (!validarCampo(name, value)) return;

    setEditarCliente({ ...editarCliente, [name]: value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editarCliente) return;

    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${editarCliente.idClientes}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarCliente),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setClientes(clientes.map(c => c.idClientes === editarCliente.idClientes ? editarCliente : c));
        setEditarCliente(null);
        setSucesso('Cliente atualizado com sucesso!');
      } else {
        setErro(dados.error || 'Erro desconhecido ao atualizar cliente.');
      }
    } catch (error) {
      console.error(error);
      setErro('Erro ao atualizar cliente. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) return;

    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      const resposta = await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
      const dados = await resposta.json();

      if (resposta.ok) {
        setClientes(clientes.filter(c => c.idClientes !== id));
        if (editarCliente?.idClientes === id) {
          setEditarCliente(null);
        }
        setSucesso('Cliente deletado com sucesso!');
      } else {
        setErro(dados.error || 'Erro desconhecido ao deletar cliente.');
      }
    } catch (error) {
      console.error(error);
      setErro('Erro ao deletar cliente. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container-principal">
      <h2 className="titulo-principal">Painel de Gerenciamento de Clientes</h2>
      <p className="subtitulo">Abaixo estão listados todos os clientes cadastrados no sistema.</p>

      {erro && <div className="mensagem mensagem-erro">{erro}</div>}
      {sucesso && <div className="mensagem mensagem-sucesso">{sucesso}</div>}
      {carregando && <div className="mensagem mensagem-info">Carregando...</div>}

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
                  <button
                    className="botao botao-editar"
                    onClick={() => {
                      setEditarCliente(c);
                      setErro(null);
                      setSucesso(null);
                    }}
                    disabled={carregando}
                  >
                    Editar
                  </button>
                  <button
                    className="botao botao-deletar"
                    onClick={() => handleDelete(c.idClientes)}
                    disabled={carregando}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editarCliente && (
        <div className="formulario-container">
          <form onSubmit={handleUpdate} className="formulario-vertical">

            <label className="formulario-label">
              Nome:
              <input
                type="text"
                name="nome"
                placeholder="Ex: Maria Silva"
                value={editarCliente.nome}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
              Email:
              <input
                type="email"
                name="email"
                placeholder="Ex: maria.silva@email.com"
                value={editarCliente.email}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
              Telefone:
              <input
                type="text"
                name="telefone"
                placeholder="Ex: 11987654321 (somente números)"
                value={editarCliente.telefone}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
              Documentos:
              <input
                type="text"
                name="documentos"
                placeholder="Ex: 12345678901 (CPF) ou 12345678000199 (CNPJ)"
                value={editarCliente.documentos}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
              Tipo de Documento:
              <select
                name="tipo_de_documento"
                value={editarCliente.tipo_de_documento}
                onChange={handleChange}
                required
                className="formulario-input"
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </label>

            <label className="formulario-label">
              Endereço:
              <input
                type="text"
                name="endereco"
                placeholder="Ex: Rua das Flores, 123, Centro"
                value={editarCliente.endereco}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
              Estado:
              <input
                type="text"
                name="estado"
                placeholder="Ex: São Paulo"
                value={editarCliente.estado}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <div className="formulario-botoes">
              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => setEditarCliente(null)}
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="botao botao-primario"
                disabled={carregando}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
