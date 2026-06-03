# 🚀 TaskFlow - Fullstack Task Management

O **TaskFlow** é uma aplicação fullstack de gerenciamento de tarefas e projetos baseada em quadros (estilo Kanban). O sistema permite que os usuários criem contas, gerenciem seus perfis com segurança e organizem seus fluxos de trabalho através de quadros personalizáveis.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React.js** (com Vite)
* **React Hooks & Context API** (para gerenciamento de estado global de autenticação)
* **Axios** (para consumo da API com interceptors de Token JWT)
* **CSS Modules** (para estilização escopada)

### Backend
* **Node.js** com **Express**
* **Prisma ORM** (integração e modelagem do banco de dados)
* **JSON Web Tokens (JWT)** (autenticação e proteção de rotas)
* **Bcrypt** (criptografia de senhas para segurança de dados)
* **PostgreSQL / MySQL** (Banco de dados relacional controlado via Prisma)

---

## ⚙️ Funcionalidades Implementadas

* **Autenticação Completa:** Cadastro de usuários e Login com geração de Token JWT persistido no `localStorage`.
* **Middlewares de Segurança:** Rotas privadas no backend protegidas por validação de token JWT.
* **Gerenciamento de Perfil:** Atualização de dados cadastrais (Nome e E-mail) e alteração opcional de senha com revalidação de segurança no banco de dados.
* **Gerenciamento de Quadros:** Criação, listagem e **exclusão de quadros (boards)** com validação de propriedade (um usuário só pode deletar seus próprios quadros).

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o **Node.js** instalado em sua máquina.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/SEU_USUARIO/taskflow-fullstack.git](https://github.com/SEU_USUARIO/taskflow-fullstack.git)
cd taskflow-fullstack
