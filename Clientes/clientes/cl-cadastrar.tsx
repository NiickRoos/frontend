import { useState } from 'react';

interface Cliente {
  nome: string;
  email: string;
  telefone: string;
  documentos: string;
  tipo_de_documento: 'CPF' | 'CNPJ';
  endereco: string;
  estado: string;
}

export default function ClCadastrar() {
  const [cliente, setCliente] = useState<Cliente>({
    nome: '',
    email: '',
    telefone: '',
    documentos: '',
    tipo_de_documento: 'CPF',
    endereco: '',
    estado: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3000/clientes/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cliente cadastrado com sucesso!');
        setCliente({
          nome: '',
          email: '',
          telefone: '',
          documentos: '',
          tipo_de_documento: 'CPF',
          endereco: '',
          estado: '',
        });
      } else {
        alert(`Erro: ${dados.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar cliente');
    }
  };

  return (
    <div>
      <h2>Cadastrar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={cliente.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={cliente.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={cliente.telefone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="documentos"
          placeholder="Documento"
          value={cliente.documentos}
          onChange={handleChange}
          required
        />
        <select
          name="tipo_de_documento"
          value={cliente.tipo_de_documento}
          onChange={handleChange}
          required
        >
          <option value="CPF">CPF</option>
          <option value="CNPJ">CNPJ</option>
        </select>
        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={cliente.endereco}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={cliente.estado}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
