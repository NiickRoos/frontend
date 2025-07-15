import { useState } from 'react';

interface Processo {
  numero_processo: string;
  descricao: string;
  status: 'Em andamento' | 'Finalizado' | 'Arquivado';
  data_abertura: string;
  data_encerramento?: string;
  Clientes_idClientes: number | '';
  Advogados_idAdvogados: number | '';
  area: 'Direito Civil' | 'Direito Penal' | 'Direito Trabalhista' | 'Direito Empresarial';
}

export default function PrCadastrar() {
  const [processo, setProcesso] = useState<Processo>({
    numero_processo: '',
    descricao: '',
    status: 'Em andamento',
    data_abertura: '',
    data_encerramento: '',
    Clientes_idClientes: '',
    Advogados_idAdvogados: '',
    area: 'Direito Civil',
  });

  const [erros, setErros] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setErros([]);

    if (name.includes('id')) {
      setProcesso({
        ...processo,
        [name]: value === '' ? '' : Number(value),
      });
    } else {
      setProcesso({
        ...processo,
        [name]: value,
      });
    }
  };

  const validarCampos = () => {
    const errosTemp: string[] = [];

    if (!processo.numero_processo.trim()) errosTemp.push('Número do processo é obrigatório.');
    if (!processo.descricao.trim()) errosTemp.push('Descrição é obrigatória.');
    if (!processo.data_abertura) errosTemp.push('Data de abertura é obrigatória.');

    if (
      processo.Clientes_idClientes === '' ||
      processo.Clientes_idClientes === 0 ||
      (typeof processo.Clientes_idClientes === 'number' && processo.Clientes_idClientes < 0) ||
      isNaN(Number(processo.Clientes_idClientes))
    ) {
      errosTemp.push('ID do Cliente inválido. Verifique se o ID está correto, não é vazio, zero ou negativo.');
    }

    if (
      processo.Advogados_idAdvogados === '' ||
      processo.Advogados_idAdvogados === 0 ||
      (typeof processo.Advogados_idAdvogados === 'number' && processo.Advogados_idAdvogados < 0) ||
      isNaN(Number(processo.Advogados_idAdvogados))
    ) {
      errosTemp.push('ID do Advogado inválido. Verifique se o ID está correto, não é vazio, zero ou negativo.');
    }

    if (!processo.area) errosTemp.push('Área é obrigatória.');
    if (!processo.status) errosTemp.push('Status é obrigatório.');

    return errosTemp;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errosValidacao = validarCampos();

    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }

    const dadosParaEnvio: any = {
      numero_processo: processo.numero_processo,
      descricao: processo.descricao,
      status: processo.status,
      data_abertura: processo.data_abertura,
      Clientes_idClientes: processo.Clientes_idClientes,
      Advogados_idAdvogados: processo.Advogados_idAdvogados,
      area: processo.area,
    };

    if (processo.data_encerramento?.trim()) {
      dadosParaEnvio.data_encerramento = processo.data_encerramento;
    }

    try {
      const resposta = await fetch('http://localhost:3000/processos/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnvio),
      });

      let dados;
      try {
        dados = await resposta.json();
      } catch {
        dados = { error: 'Resposta inválida do servidor.' };
      }

      if (resposta.ok) {
        alert('Processo cadastrado com sucesso!');
        setProcesso({
          numero_processo: '',
          descricao: '',
          status: 'Em andamento',
          data_abertura: '',
          data_encerramento: '',
          Clientes_idClientes: '',
          Advogados_idAdvogados: '',
          area: 'Direito Civil',
        });
        setErros([]);
      } else {
        alert(`Erro: ${dados.error || `Código ${resposta.status} - Erro desconhecido.`}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar processo. Verifique o backend ou a conexão.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Processo</h2>

      {erros.length > 0 && (
        <div style={{ color: 'red', marginBottom: 10 }}>
          <ul>
            {erros.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="numero_processo"
          placeholder="Ex: 2023-CIV-001"
          value={processo.numero_processo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="descricao"
          placeholder="Ex: Ação de cobrança por inadimplência"
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

        <label>
          ID do Cliente:
          <input
            type="number"
            name="Clientes_idClientes"
            value={processo.Clientes_idClientes}
            onChange={handleChange}
            required
          />
        </label>
        <small>Informe o ID do cliente cadastrado (ex: 1, 2, 3...)</small>

        <label>
          ID do Advogado:
          <input
            type="number"
            name="Advogados_idAdvogados"
            value={processo.Advogados_idAdvogados}
            onChange={handleChange}
            required
          />
        </label>
        <small>Informe o ID do advogado cadastrado (ex: 1, 2, 3...)</small>

        <select
          name="area"
          value={processo.area}
          onChange={handleChange}
          required
        >
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
