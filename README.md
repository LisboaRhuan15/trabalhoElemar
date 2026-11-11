## Perguntas

**1. Qual é a responsabilidade do Supabase Auth dentro da aplicação?**
Cadastrar usuários, validar credenciais (e-mail e senha), criar e renovar a
sessão (token JWT) e encerrar a sessão. Ele também armazena os dados do usuário.

**2. Por que utilizamos a Context API para compartilhar as informações do usuário autenticado?**
Porque várias partes da aplicação (menu, rotas protegidas, perfil, dashboard)
precisam saber quem está logado. A Context API disponibiliza esse estado para
qualquer componente sem passar props por vários níveis.

**3. Qual é a diferença entre utilizar `useState` diretamente em cada componente e utilizar um contexto global de autenticação?**
Com `useState` em cada componente, cada um teria sua própria cópia do estado,
repetindo a lógica e podendo ficar fora de sincronia. Com o contexto global
existe uma única fonte de verdade, atualizada em um só lugar e consumida por todos.

**4. O que acontece quando um usuário tenta acessar uma rota protegida sem estar autenticado?**
O `ProtectedRoute` verifica o contexto; sem usuário, usa o `Navigate` para
redirecioná-lo para `/login`. Durante a verificação inicial da sessão, mostra
uma mensagem de carregamento.

**5. Qual é a função do método `onAuthStateChange()`?**
Registrar um listener que é chamado sempre que o estado de autenticação muda
(login, logout, renovação do token), permitindo atualizar o contexto
automaticamente. O listener é removido com `unsubscribe()` quando o componente
é desmontado.

**6. Por que a proteção de rotas com React Router não é suficiente para garantir a segurança dos dados?**
Porque o código do front-end roda no navegador e pode ser alterado ou
contornado; qualquer pessoa pode chamar a API do Supabase diretamente com a
chave pública. A proteção real deve estar no banco, com políticas RLS.

**7. Qual é a diferença entre autenticação e autorização?**
Autenticação é verificar quem é o usuário (login). Autorização é definir o que
esse usuário pode acessar ou fazer (por exemplo, as policies RLS que permitem
leitura só para usuários autenticados).
