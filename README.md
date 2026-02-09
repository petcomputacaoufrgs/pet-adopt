# PetAdopt - Plataforma de Adoção (Docker)

Este repositório contém o código fonte unificado (Backend + Frontend) e a infraestrutura necessária para rodar a aplicação PetAdopt utilizando containers Docker.

O projeto possui configurações distintas para Desenvolvimento Local e Produção (Servidor).

## Pré-requisitos

Para executar este projeto, o seu ambiente deve ter instalado:

[Git](https://git-scm.com/install/)

[Docker](https://www.docker.com/products/docker-desktop/)

Docker Compose (Geralmente incluído no Docker Desktop)

## Instalação e Configuração

1. Clonar o Repositório
2. Configuração de Variáveis de Ambiente (.env)

**Importante:** Por segurança, as chaves de API, senhas de banco de dados e tokens não estão incluídos no repositório.

## Como Rodar

Existem dois modos de execução, definidos por arquivos docker-compose diferentes.

### Opção A: Rodar Localmente

Use este modo para programar. Ele expõe as portas 3000 e 3002 diretamente na sua máquina e não utiliza o túnel Cloudflare.

`docker-compose -f docker-compose.yml up -d --build`

Acesso:

Frontend: http://localhost:3000

API: http://localhost:3002

Swagger Docs: http://localhost:3002/api

### Opção B: Rodar no Servidor (Produção)

Use este modo para o deploy. Ele utiliza Nginx e Cloudflare Tunnel para expor a aplicação de forma segura via HTTPS, sem abrir portas locais.

`docker-compose -f docker-compose_server.yml up -d --build`

Acesso:

Acessível apenas através do domínio público configurado no .env

### Comandos Úteis

#### Parar a aplicação:

- Local
  
`docker-compose -f docker-compose.yml down`

- Produção
  
`docker-compose -f docker-compose_server.yml down`

- Todos os conteineres

`docker-compose down`


### Solução de Problemas

1. Porta já em uso:
Certifique-se de que não há outros serviços (como um MongoDB local ou outro projeto Node/React) rodando nas portas 3000 ou 3002 antes de subir o conteiner.
