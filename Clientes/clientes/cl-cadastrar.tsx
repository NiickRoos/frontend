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

  const [erros, setErros] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
    setErros([]);
  };

  const validarCampos = () => {
    const errosTemp: string[] = [];

    if (!cliente.nome.trim()) {
  errosTemp.push('Nome: este campo é obrigatório. Exemplo: Maria Silva');
} else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(cliente.nome)) {
  errosTemp.push('Nome: não pode conter números ou símbolos. Use apenas letras. Exemplo: Ana Beatriz');
}

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cliente.email.trim()) {
      errosTemp.push('E-mail: este campo é obrigatório. Exemplo: maria@email.com');
    } else if (!emailRegex.test(cliente.email)) {
      errosTemp.push('E-mail: formato inválido. Use algo como maria@email.com');
    }

    if (!cliente.telefone.trim()) {
      errosTemp.push('Telefone: obrigatório. Exemplo: (11) 91234-5678');
    } else if (cliente.telefone.replace(/\D/g, '').length < 8) {
      errosTemp.push('Telefone: deve ter pelo menos 8 números.');
    }

    const doc = cliente.documentos.replace(/\D/g, '');
    if (!cliente.documentos.trim()) {
      errosTemp.push('Documento: obrigatório.');
    } else if (cliente.tipo_de_documento === 'CPF' && doc.length !== 11) {
      errosTemp.push('CPF: deve conter exatamente 11 dígitos. Exemplo: 123.456.789-00');
    } else if (cliente.tipo_de_documento === 'CNPJ' && doc.length !== 14) {
      errosTemp.push('CNPJ: deve conter exatamente 14 dígitos. Exemplo: 12.345.678/0001-90');
    }

    if (!cliente.endereco.trim()) errosTemp.push('Endereço: campo obrigatório. Exemplo: Rua das Flores, 123');

    if (!cliente.estado.trim()) {
      errosTemp.push('Estado: campo obrigatório. Exemplo: SP');
    } else if (cliente.estado.length !== 2) {
      errosTemp.push('Estado: deve conter a sigla com 2 letras maiúsculas. Exemplo: RJ');
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
        setErros([]);
      } else {
        alert(`Erro: ${dados.error || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar cliente');
    }
  };

  return (
    <div>
      <h2>Cadastrar Cliente</h2>

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
        <label>
          Nome completo:
          <input
            type="text"
            name="nome"
            placeholder="Ex: Maria Silva"
            value={cliente.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          E-mail:
          <input
            type="email"
            name="email"
            placeholder="Ex: maria@email.com"
            value={cliente.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Telefone:
          <input
            type="text"
            name="telefone"
            placeholder="Ex: (11) 91234-5678"
            value={cliente.telefone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Documento:
          <input
            type="text"
            name="documentos"
            placeholder={cliente.tipo_de_documento === 'CPF' ? 'Ex: 123.456.789-00' : 'Ex: 12.345.678/0001-90'}
            value={cliente.documentos}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tipo de documento:
          <select
            name="tipo_de_documento"
            value={cliente.tipo_de_documento}
            onChange={handleChange}
            required
          >
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
          </select>
        </label>

        <label>
          Endereço:
          <input
            type="text"
            name="endereco"
            placeholder="Ex: Rua das Flores, 123"
            value={cliente.endereco}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Estado (sigla):
          <input
            type="text"
            name="estado"
            placeholder="Ex: SP"
            value={cliente.estado}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
