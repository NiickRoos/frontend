// src/pages/CadastrarProcesso.tsx
import { useState } from 'react';

interface Processo {
  numero_processo: string;
  descricao: string;
  status: string;
  data_abertura: string;
  data_encerramento?: string;
  Clientes_idClientes: number;
  Advogados_idAdvogados: number;
  Areas_idareas: number;
}

export default function CadastrarProcesso() {
  const [processo, setProcesso] = useState<Processo>({
    numero_processo: '',
    descricao: '',
    status: '',
    data_abertura: '',
    data_encerramento: '',
    Clientes_idClientes: 0,
    Advogados_idAdvogados: 0,
    Areas_idareas: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProcesso(prev => ({
      ...prev,
      [name]: name.includes("id") ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3000/processos/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processo)
      });

      const dados = await resposta.json();
      if (resposta.ok) {
        alert('Processo cadastrado com sucesso!');
        console.log(dados);
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (erro) {
      alert('Erro ao cadastrar processo');
    }
  };

  return (
    <div>
      <h2>Cadastrar Processo</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>Número do Processo:</td>
              <td><input type="text" name="numero_processo" value={processo.numero_processo} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Descrição:</td>
              <td><input type="text" name="descricao" value={processo.descricao} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <select name="status" value={processo.status} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Data de Abertura:</td>
              <td><input type="date" name="data_abertura" value={processo.data_abertura} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Data de Encerramento:</td>
              <td><input type="date" name="data_encerramento" value={processo.data_encerramento || ''} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>ID do Cliente:</td>
              <td><input type="number" name="Clientes_idClientes" value={processo.Clientes_idClientes} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>ID do Advogado:</td>
              <td><input type="number" name="Advogados_idAdvogados" value={processo.Advogados_idAdvogados} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>ID da Área:</td>
              <td><input type="number" name="Areas_idareas" value={processo.Areas_idareas} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td colSpan={2}><button type="submit">Cadastrar</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
