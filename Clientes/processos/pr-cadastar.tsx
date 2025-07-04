import React, { useState } from 'react';

function PrCadastrar() {
  const [processo, setProcesso] = useState({
    numero: '',
    descricao: '',
    // outros campos do processo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProcesso({
      ...processo,
      [e.target.name]: e.target.value,
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
        setProcesso({ numero: '', descricao: '' }); // limpa o form
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch {
      alert('Erro ao cadastrar processo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Número do Processo:</label>
        <input
          type="text"
          name="numero"
          value={processo.numero}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={processo.descricao}
          onChange={handleChange}
          required
        />
      </div>

      {/* Adicione outros campos conforme necessidade */}

      <button type="submit">Cadastrar Processo</button>
    </form>
  );
}

export default PrCadastrar;
