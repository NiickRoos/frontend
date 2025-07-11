import { useState } from 'react';

interface Advogado {
  nome: string;
  oab: string;
  email: string;
  telefone: string;
  especialidade: string;
}

export default function AdCadastrar() {
  const [advogado, setAdvogado] = useState<Advogado>({
    nome: '',
    oab: '',
    email: '',
    telefone: '',
    especialidade: 'Direito Civil',
  });

  const [erros, setErros] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    // Bloquear números e símbolos no nome
    if (name === 'nome') {
      // Permite só letras (com acentos) e espaços
      value = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    }

    // Bloquear letras e símbolos na OAB, só números e limitar tamanho
    if (name === 'oab') {
      value = value.replace(/\D/g, ''); // remove tudo que não é número
      if (value.length > 10) value = value.slice(0, 10);
    }

    setAdvogado({ ...advogado, [name]: value });
    setErros([]); // limpa erros ao digitar
  };

  const validarCampos = () => {
    const errosTemp: string[] = [];

    if (!advogado.nome.trim()) {
      errosTemp.push('Nome é obrigatório. Exemplo: Ana Beatriz');
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(advogado.nome)) {
      errosTemp.push('Nome não pode conter números ou símbolos.');
    }

    if (!advogado.oab.trim()) {
      errosTemp.push('OAB é obrigatório.');
    } else if (!/^\d{4,10}$/.test(advogado.oab)) {
      errosTemp.push('OAB deve conter entre 4 e 10 dígitos numéricos. Exemplo: 123456');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!advogado.email.trim()) {
      errosTemp.push('Email é obrigatório.');
    } else if (!emailRegex.test(advogado.email)) {
      errosTemp.push('Formato de email inválido.');
    }

    if (!advogado.telefone.trim()) {
      errosTemp.push('Telefone é obrigatório.');
    } else if (advogado.telefone.replace(/\D/g, '').length < 8) {
      errosTemp.push('Telefone deve conter pelo menos 8 números.');
    }

    if (!advogado.especialidade.trim()) {
      errosTemp.push('Especialidade é obrigatória.');
    }

    return errosTemp;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errosValidacao = validarCampos();
    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/advogados/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advogado),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Advogado cadastrado com sucesso!');
        setAdvogado({
          nome: '',
          oab: '',
          email: '',
          telefone: '',
          especialidade: 'Direito Civil',
        });
        setErros([]);
      } else {
        alert(`Erro: ${dados.error || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar advogado');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Cadastrar Advogado</h2>

      {erros.length > 0 && (
        <div style={{ color: '#dc3545', marginBottom: 16 }}>
          <ul>
            {erros.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="nome"
          placeholder="Nome (sem números)"
          value={advogado.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="oab"
          placeholder="OAB (somente números, 4 a 10 dígitos)"
          value={advogado.oab}
          onChange={handleChange}
          required
          maxLength={10}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={advogado.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={advogado.telefone}
          onChange={handleChange}
          required
        />
        <select
          name="especialidade"
          value={advogado.especialidade}
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
