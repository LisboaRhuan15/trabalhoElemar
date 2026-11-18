# Frameworks Front-end: Validação de Formulários e Tratamento de Erros

Aplicação React (Vite) com React Router, Supabase Auth, Context API, React Hook Form e Zod.

## Como executar

1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências: `npm install`
3. Copie `.env.example` para `.env` e preencha:
   - `VITE_SUPABASE_URL`: URL do projeto no Supabase
   - `VITE_SUPABASE_ANON_KEY`: chave pública (anon/publishable) do projeto
4. Inicie a aplicação: `npm run dev` (abre em `http://localhost:5173`)

Nenhuma chave privada (`service_role`) é utilizada ou versionada.

## Rotas

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | Início | Público |
| `/login` | Login | Público |
| `/registro` | Cadastro | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/registros` | Listagem de registros | Autenticado |
| `/registros/novo` | Novo registro | Autenticado |
| `/registros/:id` | Detalhes do registro | Autenticado |
| `/perfil` | Perfil | Autenticado |

## SQL aplicado no banco

```sql
-- RLS na tabela e leitura apenas para autenticados
alter table public.jogos enable row level security;

create policy "Leitura apenas para autenticados"
on public.jogos for select to authenticated using (true);

-- Coluna com o dono do registro
alter table public.jogos
  add column user_id uuid default auth.uid() references auth.users (id);

-- Constraint: tamanho do nome entre 3 e 100 caracteres
alter table public.jogos
  add constraint jogos_nome_tamanho
  check (char_length(nome) between 3 and 100);

-- Política: inserir somente em nome do próprio usuário
create policy "Inserir apenas em nome do proprio usuario"
on public.jogos for insert to authenticated
with check (auth.uid() = user_id);
```

## Teste de validação no banco (Etapa 5)

Os testes foram feitos diretamente no SQL Editor do Supabase, sem usar o formulário.

**1. Constraint CHECK (nome com apenas 2 caracteres):**

```sql
insert into public.jogos (nome, genero, ano_lancamento, preco, plataforma)
values ('ab', 'Ação', 2020, 10, 'PC');
```

Resultado: o banco recusou a inserção.

```
ERROR: 23514: new row for relation "jogos" violates check constraint "jogos_nome_tamanho"
```

**2. Política RLS (inserir em nome de outro usuário):**

```sql
begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"<uuid-do-meu-usuario>","role":"authenticated"}', true);

insert into public.jogos (nome, genero, ano_lancamento, preco, plataforma, user_id)
values ('Jogo Teste', 'Ação', 2020, 10, 'PC', '00000000-0000-0000-0000-000000000000');
rollback;
```

Resultado: o banco recusou a inserção, pois o `user_id` informado era diferente do usuário autenticado.

```
ERROR: 42501: new row violates row-level security policy for table "jogos"
```

Conclusão: mesmo ignorando o formulário, o banco impede dados inválidos e inserções em nome de terceiros. A validação do front-end melhora a experiência, mas a segurança real está no Supabase.

## Perguntas

**1. Qual é a vantagem de utilizar o React Hook Form em relação a controlar cada campo com `useState`?**
Menos código e menos re-renderizações. Com `useState` é preciso criar um estado e um `onChange` para cada campo. O React Hook Form registra os campos com `register` e controla valores, erros e envio (`handleSubmit`, `isSubmitting`) em um só lugar.

**2. Qual é o papel do Zod e do `zodResolver`?**
O Zod descreve as regras de validação em schemas reutilizáveis, fora do JSX. O `zodResolver` conecta o schema ao React Hook Form: ele valida os dados com o schema e converte os erros do Zod em erros dos campos.

**3. Por que a validação no front-end não é suficiente para garantir a segurança dos dados?**
O código do front-end roda no navegador e pode ser alterado ou ignorado. Quem chama a API do Supabase diretamente (curl, scripts) não passa pelo formulário. A segurança real precisa estar no servidor, com Auth, RLS e constraints.

**4. Qual é a diferença entre um erro de validação do formulário e um erro devolvido pelo Supabase?**
O erro de validação do formulário vem do schema Zod, acontece no navegador antes do envio e dá feedback imediato. O erro do Supabase vem do servidor depois do envio (e-mail já cadastrado, credenciais inválidas, violação de RLS ou constraint). Ele é tratado com `setError`, usando o `code` do erro para mostrar uma mensagem amigável.

**5. Por que o login deve exibir uma mensagem genérica para credenciais inválidas?**
Para não revelar se um e-mail está cadastrado. Mensagens diferentes para "e-mail não encontrado" e "senha incorreta" permitem que um atacante descubra contas válidas (enumeração de usuários).

**6. Qual é a função das *constraints* e do `WITH CHECK` do RLS?**
A constraint (`CHECK`) garante a integridade dos dados: o banco recusa valores que violam a regra, venham de onde vierem. O `WITH CHECK` garante que a linha nova ou alterada seja permitida para aquele usuário (por exemplo, só inserir com o próprio `user_id`). Já o `USING` filtra as linhas que já existem (quais podem ser lidas, alteradas ou apagadas).

## Fontes consultadas

- Zod: https://zod.dev
- React Hook Form (`useForm`, `setError`, `formState`): https://react-hook-form.com
- Supabase Auth, códigos de erro: https://supabase.com/docs/guides/auth/debugging/error-codes
- Supabase, Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Documentação do PostgreSQL sobre constraints `CHECK`

## Dificuldades encontradas

- **Pasta duplicada do projeto:** o `npm install` foi executado na pasta externa, o que criou um `package.json` sem scripts e causou o erro `Missing script: "dev"`. Resolvi movendo o `package.json` para a pasta correta e reinstalando as dependências.
- **Nome da tabela:** a consulta falhava com `Could not find the table 'public.Trabalho Elevar'`, porque esse era o nome do projeto no Supabase, e não o da tabela. A tabela correta é `jogos`.
- **Terminal ocupado pelo Vite:** os comandos do Git digitados no terminal onde o servidor estava rodando não eram executados. Passei a usar um segundo terminal.
- **Erros do Supabase:** aprendi que a mensagem do erro (em inglês e técnica) não deve ser exibida ao usuário. O correto é decidir a mensagem pelo `error.code`, com um texto padrão para erros desconhecidos.
- **RLS:** a tabela estava sem RLS (`UNRESTRICTED`), então foi preciso habilitá-la e criar as políticas de leitura e inserção.