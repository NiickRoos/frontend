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

export default function PrCadastrar() {
  const [processo, setProcesso] = useState<Processo>({
    numero_processo: '',
    descricao: '',
    status: '',
    data_abertura: '',
    data_encerramento: '',
    Clientes_idClientes: 0,
    Advogados_idAdvogados: 0,
    Areas_idareas: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProcesso({
      ...processo,
      [name]: name.includes('id') ? Number(value) : value
    });
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
        // Limpa o formulário
        setProcesso({
          numero_processo: '',
          descricao: '',
          status: '',
          data_abertura: '',
          data_encerramento: '',
          Clientes_idClientes: 0,
          Advogados_idAdvogados: 0,
          Areas_idareas: 0,
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
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={processo.status}
          onChange={handleChange}
          required
        />
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
        <input
          type="number"
          name="Areas_idareas"
          placeholder="ID da Área"
          value={processo.Areas_idareas}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
