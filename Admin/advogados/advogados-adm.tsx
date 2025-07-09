import { useEffect, useState } from 'react';
import '../Padrao.css';

interface Advogado {
  idAdvogados: number;
  nome: string;
  oab: string;
  email: string;
  telefone: string;
  especialidade: string;
}

interface Alteracao {
  campo: string;
  valorAnterior: any;
  novoValor: any;
}

export default function AdvogadosAdm() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [editarAdvogado, setEditarAdvogado] = useState<Advogado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([]);
  const [mostrarAlteracoes, setMostrarAlteracoes] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/advogados')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar advogados');
        return res.json();
      })
      .then(data => setAdvogados(data))
      .catch(err => setErro(err.message));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editarAdvogado) return;
    const { name, value } = e.target;
    const valorAnterior = (editarAdvogado as any)[name];

    if (valorAnterior !== value) {
      setAlteracoes(prev => {
        const existente = prev.find(a => a.campo === name);
        if (existente) {
          return prev.map(a =>
            a.campo === name ? { ...a, novoValor: value } : a
          );
        } else {
          return [...prev, { campo: name, valorAnterior, novoValor: value }];
        }
      });
    }

    setEditarAdvogado({ ...editarAdvogado, [name]: value });
  };

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
        setAdvogados(advogados.map(a =>
          a.idAdvogados === editarAdvogado.idAdvogados ? editarAdvogado : a
        ));
        setEditarAdvogado(null);
        setAlteracoes([]);
        setMostrarAlteracoes(false);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar advogado');
    }
  };

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
        if (editarAdvogado?.idAdvogados === id) {
          setEditarAdvogado(null);
          setAlteracoes([]);
          setMostrarAlteracoes(false);
        }
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar advogado');
    }
  };

  const mapearDescricaoCampo = (campo: string): string => {
    const mapa: Record<string, string> = {
      nome: 'Nome',
      oab: 'Número da OAB',
      email: 'Email',
      telefone: 'Telefone',
      especialidade: 'Especialidade',
    };
    return mapa[campo] || campo.replace(/_/g, ' ');
  };

  return (
    <div className="container-principal">
      <h2 className="titulo-principal">Painel de Gerenciamento de Advogados</h2>
      <p className="subtitulo">Abaixo estão listados todos os advogados cadastrados no sistema.</p>

      {erro && <p className="mensagem mensagem-erro">{erro}</p>}

      <div className="tabela-container">
        <table className="tabela">
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
                  <button
                    className="botao botao-editar"
                    onClick={() => {
                      setEditarAdvogado(a);
                      setAlteracoes([]);
                      setMostrarAlteracoes(false);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="botao botao-deletar"
                    onClick={() => handleDelete(a.idAdvogados)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editarAdvogado && (
        <div className="formulario-container">
          <h3 className="formulario-titulo">Editar Advogado #{editarAdvogado.idAdvogados}</h3>
          <form onSubmit={handleUpdate} className="formulario">

            <div className="formulario-linha">
              <label>
                Nome:
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={editarAdvogado.nome}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                Número da OAB:
                <input
                  type="text"
                  name="oab"
                  placeholder="Número da OAB"
                  value={editarAdvogado.oab}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>
            </div>

            <div className="formulario-linha">
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editarAdvogado.email}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>

              <label>
                Telefone:
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={editarAdvogado.telefone}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>
            </div>

            <div className="formulario-linha">
              <label>
                Especialidade:
                <input
                  type="text"
                  name="especialidade"
                  placeholder="Especialidade"
                  value={editarAdvogado.especialidade}
                  onChange={handleChange}
                  required
                  className="formulario-input"
                />
              </label>
            </div>

            <div className="formulario-botoes">
              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => {
                  setEditarAdvogado(null);
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

          {alteracoes.length > 0 && (
            <div className="alteracoes-container">
              <h4>Alterações realizadas:</h4>
              <table className="tabela-alteracoes">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Valor Anterior</th>
                    <th>Novo Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {alteracoes.map(({ campo, valorAnterior, novoValor }) => (
                    <tr key={campo}>
                      <td>{mapearDescricaoCampo(campo)}</td>
                      <td>{valorAnterior}</td>
                      <td>{novoValor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="botao botao-secundario"
                onClick={() => setMostrarAlteracoes(!mostrarAlteracoes)}
              >
                {mostrarAlteracoes ? 'Esconder' : 'Mostrar'} Alterações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
