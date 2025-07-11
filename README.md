
# ⚖️ Sistema Ampliado de Gestão de Casos Jurídicos

Bem-vindo(a) ao **Sistema Ampliado de Gestão de Casos Jurídicos**, uma plataforma desenvolvida para facilitar a organização e a administração do trabalho jurídico em escritórios de advocacia ou departamentos jurídicos de empresas.

---

##  Sobre o Projeto

Este sistema foi criado com o objetivo de digitalizar e simplificar a gestão jurídica, oferecendo uma plataforma amigável, funcional e eficiente. Permite o controle completo de:

- 📂 **Processos**
- 👤 **Clientes**
- 🧑‍⚖️ **Advogados**
- 📊 **Relatórios Inteligentes**

---

##  Funcionalidades Principais

O sistema é dividido em duas áreas de acesso:

### 🔐 Área do Administrador

- Atualizar e excluir **processos jurídicos**
- Editar e excluir **clientes**
-  Editar e exluir **advogados** 
- Acompanhar **relatórios detalhados**
- Edição de dados diretamente em tabelas com formulários validados

### 👥 Área do Cliente (Advogado)

- Cadastrar e listar processos  para manter o site atualizado de suas necessidades e acessar relatórios Inteligentes

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Fastify + MySQL2
- **Banco de Dados:** MySQL
- **Estilo:** CSS customizado com `Padrao.css`
- **Roteamento:** React Router

---

## 📁 Organização do Projeto



```plaintext

## Parte do Frontend

/FRONTEND
├── Admin/                # Componentes da área administrativa
├── Clientes/             # Componentes da área de cliente (usuário)
├── Imagens/              # Recursos visuais (logos, fundos, ícones, etc.)
├── Tela-Temporaria/      # Tela splash e seleção de usuário
├── app-adm.tsx           # Componente principal da área administrativa
├── app-adm.css           # Estilos da área administrativa
├── app-cliente.tsx       # Componente principal da área do cliente
├── app-cliente.css       # Estilos da área do cliente
├── main.tsx              # Arquivo principal de inicialização (entry point)
├── main.css              # Estilos globais
├── index.html            # HTML para importação


## Parte do Backend 


/BACKEND
├── src/
│   ├── rotas/
│   │   ├── advogados.ts       # Rotas para operações com advogados
│   │   ├── areas.ts           # Rotas para áreas jurídicas 
│   │   ├── clientes.ts        # Rotas para operações com clientes
│   │   ├── processos.ts       # Rotas para operações com processos
│   │   └── relatorios.ts      # Rotas para geração de relatórios
│   ├── database.ts            # Conexão com o banco de dados MySQL
│   └── server.ts              # Configuração principal do servidor Fastify
├── mysql.sql                  # Script de criação do banco de dados e dados iniciais

```




## 🌐 Rodando o projeto localmente


Instruções para rodar o projeto localmente na sua máquina.

### Principais
 Baixe os repositorios no github, e entre no visual studio code

### Backend

- Na pasta backend digite no terminal "npm i" ou "npm install fastify mysql2 dotenv"
- Isso vai instalar as dependências do projetos 
- Após isso vá no arquivo "mysql.slq" e copie, cole ele em seu mysql 
- Depois disso  só digitar "npm run dev" no terminal e pronto! o backend estará funcionando 🧙‍♂️

### Frontend
- Na pasta Frontend digite no terminal "npm i --save-dev @types/node" e "npx tsc --init" ou só "npm i" 
- Após baixar todas as dependências
- Depois disso  só digitar "npm run dev" no terminal e pronto! o Frontend estará funcionando, para acessar a página só entre no link que aparece no terminal 🧙‍♂️
