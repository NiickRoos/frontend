import { useState } from 'react';

interface Processo {
  numero_processo: string;
  descricao: string;
  status: 'Em andamento' | 'Finalizado' | 'Arquivado';
  data_abertura: string;
  data_encerramento?: string;
  Clientes_idClientes: number;
  Advogados_idAdvogados: number;
  area: 'Direito Civil' | 'Direito Penal' | 'Direito Trabalhista' | 'Direito Empresarial';
}

export default function PrCadastrar() {
  const [processo, setProcesso] = useState<Processo>({
    numero_processo: '',
    descricao: '',
    status: 'Em andamento',
    data_abertura: '',
    data_encerramento: '',
    Clientes_idClientes: 0,
    Advogados_idAdvogados: 0,
    area: 'Direito Civil',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProcesso({
      ...processo,
      [name]: name.includes('id') ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3000/processos/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processo),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Processo cadastrado com sucesso!');
        setProcesso({
          numero_processo: '',
          descricao: '',
          status: 'Em andamento',
          data_abertura: '',
          data_encerramento: '',
          Clientes_idClientes: 0,
          Advogados_idAdvogados: 0,
          area: 'Direito Civil',
        });
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar processo');
    }
  };

  return (
    <div>
      <h2>Cadastrar Processo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="numero_processo"
          placeholder="Número do Processo"
          value={processo.numero_processo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={processo.descricao}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={processo.status}
          onChange={handleChange}
          required
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Arquivado">Arquivado</option>
        </select>

        <input
          type="date"
          name="data_abertura"
          value={processo.data_abertura}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="data_encerramento"
          value={processo.data_encerramento}
          onChange={handleChange}
        />

        <input
          type="number"
          name="Clientes_idClientes"
          placeholder="ID do Cliente"
          value={processo.Clientes_idClientes}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="Advogados_idAdvogados"
          placeholder="ID do Advogado"
          value={processo.Advogados_idAdvogados}
          onChange={handleChange}
          required
        />

        <select name="area" value={processo.area} onChange={handleChange} required>
          <option value="Direito Civil">Direito Civil</option>
          <option value="Direito Penal">Direito Penal</option>
          <option value="Direito Trabalhista">Direito Trabalhista</option>
          <option value="Direito Empresarial">Direito Empresarial</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
