# 🐾 PetAdopt - Plataforma de Adoção de Animais

Olá! Bem-vindo ao **PetAdopt**! 😊

Esta é uma aplicação que ajuda pessoas a encontrarem e adotarem animais de estimação. O sistema funciona como um "site" onde você pode ver informações sobre os animais disponíveis para adoção.

---

# 🌟 O Que É Este Projeto?

Imagine que temos um "sistema" que tem duas partes principais trabalhando juntas:

1. **Parte Visual (Frontend)** - É o que você vê no navegador, como botões, fotos dos animais, formulários
2. **Parte Lógica (Backend)** - É o "cérebro" por trás do site que guarda as informações, autentica usuários e gerencia os dados

Ambas as partes foram criadas para trabalhar juntas perfeitamente! 💪

---

# 🛠️ Tecnologias Usadas

## Na Parte Visual (Frontend)
- **React** - Uma ferramenta popular para criar interfaces modernas
- **TypeScript** - Uma versão melhorada de JavaScript que ajuda a evitar erros
- **Vite** - Um acelerador para carregar o site rapidamente

## Na Parte Lógica (Backend)
- **NestJS** - Um organizador inteligente dos dados e regras do sistema
- **MongoDB** - Onde os dados são guardados (como uma biblioteca gigante de informações)
- **JWT** - Um sistema de segurança para proteger contas de usuários

## Infraestrutura
- **Docker** - Uma ferramenta mágica que empacota tudo para funcionar em qualquer computador! 🎁

---

# 🗂️ Como Está Organizado?

```
pet-adopt/
│
├── back/                    ← A parte lógica do sistema (backend)
│   └── Aqui ficam os "cérebros" e regras
│
├── front/                   ← A parte visual (frontend)
│   └── O que você vê no navegador
│
├── nginx/                   ← Um tradutor entre o site e os usuários
│
└── Arquivos especiais de configuração
```

---

# 📋 O Que Você Precisa Ter Antes

Para usar este projeto, basta ter instalado no seu computador:

1. ✅ **Docker Desktop** - É um programa gratuito que vem com todas as ferramentas necessárias! Ele instala o Git automaticamente também.

📥 [Baixe aqui](https://www.docker.com/products/docker-desktop)

---

# 🚀 Como Começar (Passo a Passo Fácil)

## 1️⃣ Baixar o Projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd pet-adopt
```

Isso é como baixar uma pasta completa com todas as informações do projeto!

---

## 2️⃣ Preparar as Configurações

Dentro da pasta `back/`, crie um arquivo chamado `.env`. Pense nisso como um "caderno de anotações" com senhas e configurações especiais.

⚠️ **Atenção**: Este arquivo é secreto! Por isso, ele não está no repositório. Você deve criá-lo manualmente com as informações fornecidas pela equipe.

**O que NÃO compartilhar este arquivo:**
- Senhas
- Tokens de segurança
- Configurações sensíveis

É como se fosse o "diário dos segredos" do sistema - ninguém mais deve ver! 🔐

---

# 💻 Como Rodar o Projeto (Para Desenvolvimento)

Use este comando para começar a usar o PetAdopt no seu computador:

```bash
docker compose -f docker-compose-local.yml up -d --build
```

O que acontece agora? 🤔

✅ O **PetAdopt** será iniciado automaticamente  
✅ Você conseguirá ver o site na porta **5173** (http://localhost:5173)  
✅ Os "servidores" ficam rodando na porta **3002**  

### Onde Acessar?

- 🎨 **Site do PetAdopt**: http://localhost:5173
- 🔐 **Área de Login/API**: http://localhost:3002/api
- 📖 **Documentação Técnica**: http://localhost:3002/api (Swagger)

> 💡 **Dica**: O "Swagger" é como uma página que mostra todas as regras da API, útil para desenvolvedores.

---

# ⏹️ Para Parar Quando Acabou

Quando quiser parar o PetAdopt:

```bash
docker compose -f docker-compose-local.yml down
```

É como desligar o computador - tudo para de rodar e libera os recursos!

---

# 🔄 Comandos Úteis

| O Que Você Quer Fazer | Comando |
|-----------------------|---------|
| Iniciar novamente o projeto | `docker compose -f docker-compose-local.yml up -d --build` |
| Ver se está tudo rodando | `docker ps` |
| Ler o que está acontecendo (logs) | `docker compose logs` |
| Ver só o que o backend está fazendo | `docker logs petadopt_api` |
| Ver só o que o frontend está fazendo | `docker logs petadopt_front` |

---

# 🛠️ Dicas para Desenvolvedores

## Quer encontrar algo no código?

Use a pesquisa global do seu editor de código (VS Code):

```
Ctrl + Shift + F
```

Isso vai procurar por qualquer coisa em todo o projeto! ✨

## Documentação da API

O backend tem uma documentação completa que mostra:
- Quais endpoints existem
- Como usar cada funcionalidade
- Que tipos de dados são esperados

Acesse: http://localhost:3002/api

---

# ❓ Solução de Problemas Comuns

### "O site não aparece quando eu abro..." 🖥️

**Verifique se o PetAdopt está rodando:**
```bash
docker ps
```

Você deve ver algo com "5173" na coluna PORT. Se não estiver, reinicie!

---

### "O sistema de login/API não responde..." 🔐

**Veja o que está acontecendo:**
```bash
docker logs petadopt_api
```

Procure mensagens de erro ou avisos no terminal.

---

### "Erro: Arquivo .env não encontrado" 📁

**Verifique se existe:**
- Entre na pasta `back/`
- Crie um arquivo chamado `.env` (com esse ponto antes!)
- Preencha com as configurações fornecidas

---

### "As portas estão em uso por outro programa..." ⚠️

Alguma outra coisa pode estar usando as portas 5173 ou 3002. Para verificar:

```bash
# No Windows
netstat -ano | findstr :5173

# Ou feche outros programas que usem o navegador
```

---

# ⚠️ Regras Importantes (Não Ignore!)

1. ✅ Use **docker-compose-local.yml** para testes no seu computador
2. ✅ Use **docker-compose.yml** apenas para produção real
3. ❌ **Nunca** envie o arquivo `.env` para o repositório!
4. ❌ **Nunca** compartilhe senhas, chaves ou informações secretas!
5. ✅ Faça backup das configurações sensíveis em local seguro

---

# 🎉 Pronto para Começar?

Basta executar os comandos e acessar http://localhost:5173 no seu navegador!

Se tiver dúvidas, consulte a documentação técnica ou pergunte à equipe do projeto! 😊

---

*Desenvolvido com ❤️ para ajudar na adoção responsável de animais!* 🐶🐱🐰
