import { useEffect, useState } from 'react';
import '../Padrao.css';

interface Processo {
  idprocessos: number;
  numero_processo: string;
  descricao: string;
  status: 'Em andamento' | 'Finalizado' | 'Arquivado';
  data_abertura: string;
  data_encerramento?: string | null;
  Clientes_idClientes: number;
  Advogados_idAdvogados: number;
  area: 'Direito Civil' | 'Direito Penal' | 'Direito Trabalhista' | 'Direito Empresarial';
}

interface Alteracao {
  campo: string;
  valorAnterior: any;
  novoValor: any;
}

export default function PrAdm() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [editarProcesso, setEditarProcesso] = useState<Processo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([]);
  const [mostrarAlteracoes, setMostrarAlteracoes] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/processos')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar processos');
        return res.json();
      })
      .then(data => setProcessos(data))
      .catch(err => setErro(err.message));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editarProcesso) return;
    const { name, value } = e.target;
    const novoValor = name.includes('id') ? Number(value) : value;
    const valorAnterior = (editarProcesso as any)[name];

    if (valorAnterior !== novoValor) {
      setAlteracoes(prev => {
        const existente = prev.find(a => a.campo === name);
        if (existente) {
          return prev.map(a =>
            a.campo === name ? { ...a, novoValor } : a
          );
        } else {
          return [...prev, { campo: name, valorAnterior, novoValor }];
        }
      });
    }

    setEditarProcesso({
      ...editarProcesso,
      [name]: novoValor,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editarProcesso) return;

    const processoParaEnvio = { ...editarProcesso };

    if (processoParaEnvio.data_encerramento === '') {
      processoParaEnvio.data_encerramento = null;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/processos/${processoParaEnvio.idprocessos}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processoParaEnvio),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Processo atualizado com sucesso!');
        setProcessos(processos.map(p => p.idprocessos === processoParaEnvio.idprocessos ? processoParaEnvio : p));
        setEditarProcesso(null);
        setAlteracoes([]);
        setMostrarAlteracoes(false);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar processo');
    }
  };

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
        if (editarProcesso?.idprocessos === id) {
          setEditarProcesso(null);
          setAlteracoes([]);
        }
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar processo');
    }
  };

  return (
    <div className="container-principal">
      <h2 className="titulo-principal">Painel de Gerenciamento de Processos</h2>
      <p className="subtitulo">Abaixo estão listados todos os processos cadastrados no sistema.</p>

      {erro && <div className="mensagem mensagem-erro">{erro}</div>}

      <div className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Abertura</th>
              <th>Encerramento</th>
              <th>Cliente</th>
              <th>Advogado</th>
              <th>Área</th>
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
                <td>{p.area}</td>
                <td>
                  <button
                    className="botao botao-editar"
                    onClick={() => {
                      setEditarProcesso({
                        ...p,
                        data_abertura: p.data_abertura?.slice(0, 10),
                        data_encerramento: p.data_encerramento?.slice(0, 10) || ''
                      });
                      setAlteracoes([]);
                      setMostrarAlteracoes(false);
                    }}
                  >
                    Editar
                  </button>
                  <button className="botao botao-deletar" onClick={() => handleDelete(p.idprocessos)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editarProcesso && (
        <div className="formulario-container">
          <h3 className="formulario-titulo">Editar Processo #{editarProcesso.idprocessos}</h3>
          <form onSubmit={handleUpdate} className="formulario">

            <div className="formulario-linha">
              <label>
                Número do Processo:
                <input
                  type="text"
                  name="numero_processo"
                  placeholder="Número do Processo"
                  value={editarProcesso.numero_processo}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                Descrição:
                <input
                  type="text"
                  name="descricao"
                  placeholder="Descrição"
                  value={editarProcesso.descricao}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>
            </div>

            <div className="formulario-linha">
              <label>
                Status:
                <select
                  name="status"
                  value={editarProcesso.status}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                >
                  <option value="">Selecione o status</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </label>

              <label>
                Data de Abertura:
                <input
                  type="date"
                  name="data_abertura"
                  value={editarProcesso.data_abertura}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                Data de Encerramento:
                <input
                  type="date"
                  name="data_encerramento"
                  value={editarProcesso.data_encerramento || ''}
                  onChange={handleChange}
                  className="formulario-input"
                />
              </label>
            </div>

            <div className="formulario-linha">
              <label>
                ID do Cliente:
                <input
                  type="number"
                  name="Clientes_idClientes"
                  placeholder="ID do Cliente"
                  value={editarProcesso.Clientes_idClientes}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                ID do Advogado:
                <input
                  type="number"
                  name="Advogados_idAdvogados"
                  placeholder="ID do Advogado"
                  value={editarProcesso.Advogados_idAdvogados}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                Área:
                <select
                  name="area"
                  value={editarProcesso.area}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                >
                  <option value="">Selecione a área</option>
                  <option value="Direito Civil">Direito Civil</option>
                  <option value="Direito Penal">Direito Penal</option>
                  <option value="Direito Trabalhista">Direito Trabalhista</option>
                  <option value="Direito Empresarial">Direito Empresarial</option>
                </select>
              </label>
            </div>

            <div className="formulario-botoes">
              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => {
                  setEditarProcesso(null);
                  setAlteracoes([]);
                  setMostrarAlteracoes(false);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="botao botao-primario">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
