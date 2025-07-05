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
    especialidade: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdvogado({ ...advogado, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3000/advogados/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advogado)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Advogado cadastrado com sucesso!');
        setAdvogado({
          nome: '',
          oab: '',
          email: '',
          telefone: '',
          especialidade: ''
        });
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar advogado');
    }
  };

  return (
    <div>
      <h2>Cadastrar Advogado</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={advogado.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="oab"
          placeholder="OAB"
          value={advogado.oab}
          onChange={handleChange}
          required
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
        <input
          type="text"
          name="especialidade"
          placeholder="Especialidade"
          value={advogado.especialidade}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
