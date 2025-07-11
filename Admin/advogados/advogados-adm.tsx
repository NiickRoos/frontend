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

export default function AdvogadosAdm() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [editarAdvogado, setEditarAdvogado] = useState<Advogado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

    const validarCampo = (campo: string, valor: string): boolean => {
      const apenasNumeros = /^[0-9]*$/;
      const apenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;

      switch (campo) {
        case 'telefone':
        case 'oab':
          return apenasNumeros.test(valor); // apenas números
        case 'nome':
        case 'especialidade':
          return apenasLetras.test(valor); // apenas letras
        case 'email':
          return true; // email livre
        default:
          return true;
      }
    };

    if (!validarCampo(name, value)) return;

    setEditarAdvogado({
      ...editarAdvogado,
      [name]: value,
    });
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
        setErro(null);
      } else {
        const msgErro = dados.error || 'Erro desconhecido ao atualizar advogado.';
        setErro(msgErro);
        alert(`Erro: ${msgErro}\n\nVerifique se os dados estão corretos e se o backend está acessível.`);
      }
    } catch (error) {
      console.error(error);
      setErro('Erro ao atualizar advogado. Verifique a conexão com o servidor.');
      alert('Erro ao atualizar advogado. Verifique a conexão, IP, porta e se o backend está online.');
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
        }
      } else {
        setErro(dados.error || 'Erro ao deletar advogado');
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      setErro('Erro ao deletar advogado');
    }
  };

  return (
    <div className="container-principal">
      <h2 className="titulo-principal">Painel de Gerenciamento de Advogados</h2>
      <p className="subtitulo">Abaixo estão listados todos os advogados cadastrados no sistema.</p>

      {erro && <div className="mensagem mensagem-erro">{erro}</div>}

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
            {advogados.map((a) => (
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
                      setErro(null);
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
          <form onSubmit={handleUpdate} className="formulario-vertical">
            <label className="formulario-label">
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

            <label className="formulario-label">
              Número da OAB:
              <input
                type="text"
                name="oab"
                placeholder="Número da OAB (somente números)"
                value={editarAdvogado.oab}
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
                placeholder="Email"
                value={editarAdvogado.email}
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
                placeholder="Telefone (somente números)"
                value={editarAdvogado.telefone}
                onChange={handleChange}
                required
                className="formulario-input"
              />
            </label>

            <label className="formulario-label">
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

            {erro && <div className="mensagem mensagem-erro">{erro}</div>}

            <div className="formulario-botoes">
              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => {
                  setEditarAdvogado(null);
                  setErro(null);
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
