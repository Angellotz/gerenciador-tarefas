

# 📝 Gerenciador de Tarefas – API + Frontend

Projeto Full Stack desenvolvido como desafio técnico.
A aplicação permite o gerenciamento completo de tarefas, incluindo criação, edição, exclusão, listagem e filtragem por status.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **ASP.NET Core Web API (.NET 8)**
- **Entity Framework Core**
- **SQL Server**
- **Swagger / OpenAPI**
- **Injeção de Dependência**

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript**

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura em camadas**, separando responsabilidades e facilitando manutenção e evolução:

```text
GerenciadorTarefasApi
 ├─ GerenciadorTarefas.API           → Controllers e configuração da API
 ├─ GerenciadorTarefas.Domain        → Entidades e regras de negócio
 ├─ GerenciadorTarefas.Application   → Serviços e interfaces
 ├─ GerenciadorTarefas.Infrastructure→ Repositórios e acesso a dados
 ├─ GerenciadorTarefas.Frontend      → Interface Web
 └─ GerenciadorTarefas.sln
```

## ⚙️ Pré-requisitos

- **.NET SDK 8 ou superior**

- **SQL Server (LocalDB, Express ou superior)**

- **Git**

## 🗄️ Banco de Dados

- **SGBD: SQL Server**

- **ORM: Entity Framework Core**

O banco de dados é criado automaticamente através de migrations

## Configuração da Connection String

No arquivo appsettings.json do projeto GerenciadorTarefas.API:
```
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=GerenciadorTarefasDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

## 🛠️ Criando o Banco de Dados

No terminal, navegue até a pasta da API:
```
cd GerenciadorTarefas.API
```

Execute as migrations:
```
dotnet ef database update
```
▶️ Executando a Aplicação
Backend (API)
```
dotnet run
```

A API ficará disponível em:
```
http://localhost:5173
```

Swagger (documentação da API):
```
http://localhost:5173/swagger
```
**Frontend**

**1.** Acesse a pasta GerenciadorTarefas.Frontend

**2.** Abra o arquivo index.html diretamente no navegador
ou utilize uma extensão como Live Server no VS Code

O frontend consome diretamente os endpoints da API.

## 🔌 Endpoints da API

**GET** /api/tarefas
Lista todas as tarefas

**GET** /api/tarefas/{id}
Retorna uma tarefa específica

**POST** /api/tarefas
Cria uma nova tarefa

**PUT** /api/tarefas/{id}
Atualiza uma tarefa existente

**DELETE** /api/tarefas/{id}
Remove uma tarefa

## ✅ Funcionalidades Implementadas

- Criar tarefas

- Listar tarefas

- Editar tarefas

- Excluir tarefas

- Filtrar tarefas por status (Pendente, Em Progresso, Concluída)

- Validações de dados

- Persistência em banco de dados

## 📌 Boas Práticas Aplicadas

- Clean Code

- Princípio da Responsabilidade Única (SRP)

- Separação de camadas

- Uso de DTOs e Services

- Tratamento de erros com respostas HTTP adequadas

## 👤 Autor

**Angelo da Silva Macedo**

Projeto desenvolvido para fins de avaliação técnica.