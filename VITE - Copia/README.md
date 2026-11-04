# Aplicação React com Supabase

Aplicação web criada com React e Vite. A listagem e os detalhes dos registros são consultados na tabela `jogos` do Supabase.

## Requisitos

- Node.js (versão LTS) e npm
- Um projeto no Supabase com a tabela `jogos` configurada

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Na raiz do projeto, crie o arquivo `.env.local` com as credenciais do seu projeto Supabase:

   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publicavel
   ```

   Encontre a URL e a chave publicável (publishable/anon) nas configurações de API do projeto Supabase. O cliente da aplicação lê essas variáveis em `src/services/supabase.js`.

   As variáveis com prefixo `VITE_` são incluídas no código enviado ao navegador. Use somente a chave publicável/anon e nunca coloque uma chave `service_role` ou outro segredo nesse arquivo. O `.env.local` é ignorado pelo Git; não publique credenciais em repositórios ou mensagens.

3. Se o servidor de desenvolvimento já estiver aberto, reinicie-o após criar ou alterar o arquivo de ambiente.

## Executar

Inicie o servidor local:

```bash
npm run dev
```

Abra no navegador o endereço informado pelo Vite (normalmente `http://localhost:5173`).

## Outros comandos

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve localmente a versão gerada
npm run lint     # executa o ESLint
```
