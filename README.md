# PetAdopt - Plataforma de Adoção

O **PetAdopt** é uma plataforma para adoção de animais composta por um frontend em **React + Vite** e um backend em **NestJS**, ambos escritos em **TypeScript** e executados utilizando **Docker**.

Este repositório contém toda a aplicação, incluindo o frontend, backend e a infraestrutura necessária para desenvolvimento e produção.

---

# Tecnologias

## Frontend

* React
* TypeScript
* Vite
* React Router
* Styled Components
* Axios

## Backend

* NestJS
* TypeScript
* JWT
* MongoDB

## Infraestrutura

* Docker
* Docker Compose
* Nginx (Produção)
* Cloudflare Tunnel (Produção)

---

# Estrutura do Projeto

```text
pet-adopt/

├── back/                     # Backend (NestJS)
│   ├── src/
│   ├── uploads/
│   └── .env
│
├── front/                    # Frontend (React + Vite)
│   └── src/
│
├── nginx/
│
├── docker-compose.yml         # Produção
├── docker-compose-local.yml   # Desenvolvimento
└── README.md
```

---

# Pré-requisitos

Antes de iniciar, instale:

* Git
* Docker Desktop (já inclui Docker Compose)

---

# Configuração

## 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd pet-adopt
```

---

## 2. Configurar o Backend

Crie o arquivo:

```text
back/.env
```

Utilize as variáveis de ambiente fornecidas pela equipe do projeto.

**Importante**

O arquivo `.env` não faz parte do repositório por conter informações sensíveis como:

* Senhas
* Tokens JWT
* Configuração do MongoDB
* Configuração de e-mail

---

# Executando o Projeto

O projeto possui dois ambientes diferentes.

## Desenvolvimento

Durante o desenvolvimento utilize:

```bash
docker compose -f docker-compose-local.yml up -d --build
```

Esse ambiente:

* expõe o backend na porta **3002**
* expõe o frontend na porta **5173**
* não utiliza Nginx
* não utiliza Cloudflare Tunnel

### Acessos

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:3002
```

Swagger

```
http://localhost:3002/api
```

---

## Produção

Para executar a infraestrutura utilizada no servidor:

```bash
docker compose -f docker-compose.yml up -d --build
```

Esse ambiente utiliza:

* Nginx
* Cloudflare Tunnel
* Rede interna Docker

As portas não são expostas diretamente para a máquina local.

---

# Parando os Containers

Desenvolvimento

```bash
docker compose -f docker-compose-local.yml down
```

Produção

```bash
docker compose -f docker-compose.yml down
```

Todos os containers

```bash
docker compose down
```

---

# Fluxo de Desenvolvimento

Após iniciar os containers:

1. Abra o projeto no VS Code.
2. Faça suas alterações no frontend ou backend.
3. Teste a funcionalidade.
4. Realize o commit.
5. Envie as alterações para sua branch.

---

# Desenvolvimento Frontend

O frontend está localizado em:

```text
front/
```

Tecnologias utilizadas:

* React
* Vite
* TypeScript

Para localizar um componente ou texto da interface, utilize a pesquisa global do VS Code:

```
Ctrl + Shift + F
```

---

# Desenvolvimento Backend

O backend está localizado em:

```text
back/
```

É desenvolvido utilizando NestJS.

A documentação da API pode ser acessada em:

```
http://localhost:3002/api
```

---

# Comandos Úteis

Reconstruir os containers

```bash
docker compose -f docker-compose-local.yml up -d --build
```

Visualizar os containers

```bash
docker ps
```

Visualizar os logs

```bash
docker compose logs
```

Logs do backend

```bash
docker logs petadopt_api
```

Logs do frontend

```bash
docker logs petadopt_front
```

---

# Solução de Problemas

## O frontend não abre

Verifique se os containers estão em execução:

```bash
docker ps
```

O frontend deve estar publicado na porta:

```
5173
```

---

## O backend não responde

Confira os logs:

```bash
docker logs petadopt_api
```

---

## Erro informando que o arquivo `.env` não foi encontrado

Verifique se o arquivo existe em:

```text
back/.env
```

---

## Porta em uso

Certifique-se de que as portas abaixo não estejam sendo utilizadas por outro programa:

* 5173 (Frontend)
* 3002 (Backend)

---

# Observações

* Utilize `docker-compose-local.yml` para desenvolvimento.
* Utilize `docker-compose.yml` apenas para a infraestrutura de produção.
* Nunca envie o arquivo `.env` para o repositório.
* Nunca publique senhas, tokens ou credenciais no Git.
