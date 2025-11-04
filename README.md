# 💰 InnoFinances

> Projeto desenvolvido como parte de um desafio técnico da **InnoDev**.

O InnoFinances é um dashboard financeiro interativo que permite visualizar e analisar dados de transações — incluindo saldos, balanços, receitas e despesas — de forma intuitiva e organizada.

O sistema conta com duas telas principais:

- 🔐 **Login**: autenticação com validação de credenciais.
- 📊 **Dashboard**: rota protegida onde são exibidos os gráficos e relatórios financeiros.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

- ⚡ Next.js 16
- 🎨 Tailwind CSS
- 🧩 shadcn/ui
- 📚 TanStack Query
- 🧠 TypeScript

## ⚙️ Instalação

Clone o repositório e instale as dependências com:

```ts
pnpm install
```

## 🔧 Configuração do Ambiente

Antes de executar o projeto, crie um arquivo .env.local na raiz e defina as seguintes variáveis:

```
JWT_SECRET=chave_encriptada
EMAIL=seu_email@exemplo.com
PASSWORD=sua_senha
NODE_ENV=development
```

> 💡 Dica: você pode gerar um hash para o **JWT_SECRET** em sites como em: [178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html).

Em seguida, faça o download do arquivo `transactions.json` neste [link](https://drive.google.com/file/d/1W6AKvWNyZTQFV7P4mTGegge5yR0RL4qd/view?pli=1) e salve-o na pasta:

```
/data/transactions.json
```

> Caso a pasta `data` não exista, crie-a na raiz do projeto.

## ▶️ Execução

Para rodar o projeto em ambiente de desenvolvimento:

```
pnpm run dev
```

O servidor será iniciado em http://localhost:3000.

# 📜 Licença

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.
