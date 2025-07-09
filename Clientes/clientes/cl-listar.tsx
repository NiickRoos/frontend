import { useEffect, useState } from 'react';

interface Cliente {
  idClientes: number;
  nome: string;
  email: string;
  telefone: string;
  documentos: string;
  tipo_de_documento: 'CPF' | 'CNPJ';
  endereco: string;
  estado: string;
}

export default function ClListar() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/clientes')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar clientes');
        return res.json();
      })
      .then((data) => setClientes(data))
      .catch((err) => setErro(err.message));
  }, []);

  return (
    <div className="container-principal">
      <h2>Listar Clientes</h2>
      {erro && <p className="mensagem-erro">{erro}</p>}
      {clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Endereço</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.idClientes}>
                  <td>{c.idClientes}</td>
                  <td>{c.nome}</td>
                  <td>{c.email}</td>
                  <td>{c.telefone}</td>
                  <td>{c.documentos}</td>
                  <td>{c.tipo_de_documento}</td>
                  <td>{c.endereco}</td>
                  <td>{c.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
