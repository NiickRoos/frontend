import { useEffect, useState } from 'react';
import '../Padrao.css';

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

    try {
      const resposta = await fetch(`http://localhost:3000/processos/${editarProcesso.idprocessos}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarProcesso),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Processo atualizado com sucesso!');
        setProcessos(processos.map(p => p.idprocessos === editarProcesso.idprocessos ? editarProcesso : p));
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

  const mapearDescricaoCampo = (campo: string): string => {
    const mapa: Record<string, string> = {
      numero_processo: "Número do Processo",
      descricao: "Descrição",
      status: "Status do Processo",
      data_abertura: "Data de Abertura",
      data_encerramento: "Data de Encerramento",
      Clientes_idClientes: "ID do Cliente",
      Advogados_idAdvogados: "ID do Advogado",
      Areas_idareas: "ID da Área"
    };
    return mapa[campo] || campo.replace(/_/g, ' ');
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
                <td>{p.Areas_idareas}</td>
                <td>
                  <button className="botao botao-editar" onClick={() => {
                    setEditarProcesso(p);
                    setAlteracoes([]);
                    setMostrarAlteracoes(false);
                  }}>Editar</button>
                  <button className="botao botao-deletar" onClick={() => handleDelete(p.idprocessos)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editarProcesso && (
        <div className="formulario-container">
          <h3 className="formulario-titulo">Editar Processo #{editarProcesso.idprocessos}</h3>
          <form onSubmit={handleUpdate}>
            <input type="text" name="numero_processo" placeholder="Número" value={editarProcesso.numero_processo} onChange={handleChange} required />
            <input type="text" name="descricao" placeholder="Descrição" value={editarProcesso.descricao} onChange={handleChange} required />
            <input type="text" name="status" placeholder="Status" value={editarProcesso.status} onChange={handleChange} required />
            <input type="date" name="data_abertura" value={editarProcesso.data_abertura} onChange={handleChange} required />
            <input type="date" name="data_encerramento" value={editarProcesso.data_encerramento || ''} onChange={handleChange} />
            <input type="number" name="Clientes_idClientes" placeholder="ID Cliente" value={editarProcesso.Clientes_idClientes} onChange={handleChange} required />
            <input type="number" name="Advogados_idAdvogados" placeholder="ID Advogado" value={editarProcesso.Advogados_idAdvogados} onChange={handleChange} required />
            <input type="number" name="Areas_idareas" placeholder="ID Área" value={editarProcesso.Areas_idareas} onChange={handleChange} required />

            <div className="formulario-botoes">
              <button type="button" className="botao botao-secundario" onClick={() => setMostrarAlteracoes(!mostrarAlteracoes)}>
                {mostrarAlteracoes ? 'Ocultar Alterações' : 'Ver Alterações'}
              </button>
              <button type="button" className="botao botao-secundario" onClick={() => {
                setEditarProcesso(null);
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
                    <th>Campo Alterado</th>
                    <th>Valor Anterior</th>
                    <th>Novo Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {alteracoes.map((alt, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{mapearDescricaoCampo(alt.campo)}</strong>
                        <br /><small>{alt.campo.replace(/_/g, ' ')}</small>
                      </td>
                      <td style={{ color: 'var(--erro)', fontWeight: 'bold' }}>
                        {alt.valorAnterior?.toString() || '---'}
                      </td>
                      <td style={{ color: 'var(--sucesso)', fontWeight: 'bold' }}>
                        {alt.novoValor?.toString() || '---'}
                      </td>
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
