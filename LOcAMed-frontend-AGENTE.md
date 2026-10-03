# LocaMed Frontend — AGENTE MESTRE

## 1. IDENTIDADE DO PROJETO

Projeto: LocaMed / Poltronas Med

Repositório:
- GitHub: DevAlex-full/locamed-front-end
- Local: E:\Projetos\locamed-front-end

Stack principal:
- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase Auth
- TanStack Query
- React Hook Form
- Zod
- Radix UI
- Axios
- lucide-react

O frontend é responsável pela interface completa do SaaS LocaMed.

Deve consumir corretamente o backend:

`E:\Projetos\locamed-backend`

---

# 2. COMANDO MESTRE

Quando o agente `/FullStack` for chamado neste repositório, ele deve assumir a responsabilidade de:

> AUDITAR, CORRIGIR, INTEGRAR, VALIDAR E FINALIZAR O FRONTEND COMPLETO DO LOCAMED.

Não trabalhar somente na tela que aparenta estar quebrada.

Auditar o sistema inteiro.

O agente possui autorização para corrigir componentes, hooks, services, APIs, formulários, rotas, guards, estados, queries, mutations, validações e arquitetura interna sempre que necessário.

Somente solicitar decisão do usuário quando houver decisão real de produto/UX que não possa ser determinada pelo código existente, roadmap ou padrões do projeto.

---

# 3. REGRA FUNDAMENTAL

NÃO considerar uma tela concluída apenas porque:

- ela existe;
- a rota existe;
- o componente renderiza;
- o TypeScript compila;
- o botão existe.

Uma funcionalidade só é CONCLUÍDA quando:

1. rota funciona;
2. proteção funciona;
3. refresh funciona;
4. API correta é chamada;
5. autenticação funciona;
6. payload está correto;
7. response é tratada;
8. loading funciona;
9. erro funciona;
10. empty state funciona;
11. paginação funciona quando aplicável;
12. filtros funcionam;
13. mutations funcionam;
14. React Query é invalidado corretamente;
15. formulários funcionam em create/edit;
16. validação funciona;
17. conflitos são tratados;
18. UX está coerente;
19. backend suporta a operação;
20. build/typecheck/lint passam.

---

# 4. ROADMAP OFICIAL

1. Estrutura inicial do backend
2. Banco de Dados e Modelagem
3. Infraestrutura da API
4. Autenticação e Controle de Acesso
5. Auditoria
6. Usuários e Empresas
7. Estrutura Inicial do Frontend
8. Autenticação e Página de Login
9. Layout Principal e Navegação
10. Dashboard Inicial
11. Gestão de Clientes
12. Gestão de Poltronas
13. Gestão de Reservas
14. Bloqueios e Manutenção
15. Gestão de Entregas
16. Gestão de Contratos
17. Controle Financeiro
18. Integração Asaas
19. Webhooks
20. Parceiros
21. Comissões
22. Relatórios
23. Auditoria Visual
24. Configurações
25. Documentos
26. Testes
27. Hardening
28. Deploy Back-end
29. Deploy Front-end
30. MVP Final

Não confiar em declarações anteriores de "etapa concluída".

Verificar o código real.

---

# 5. BACKEND COMO FONTE DO CONTRATO

Backend:

`E:\Projetos\locamed-backend`

Não inventar endpoints.

Não inventar payloads.

Não inventar enums.

Não inventar respostas.

Sempre que houver dúvida sobre integração, inspecionar o backend.

Se necessário, corrigir os dois lados.

---

# 6. ROTAS ATUAIS ESPERADAS

Auditar pelo menos:

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/reservations`
- `/deliveries`
- `/chairs`
- `/clients`
- `/financial`
- `/availability`
- `/partners`
- `/commissions`
- `/contracts`

Verificar:

- acesso direto;
- refresh;
- proteção;
- redirecionamento;
- lazy loading;
- fallback;
- sidebar;
- navegação;
- URL correta.

---

# 7. LOGIN / AUTH

Existe integração com Supabase Auth.

A implementação deve utilizar autenticação real.

NÃO:

- criar login fake;
- bypass;
- usuário hardcoded;
- redirecionamento artificial;
- token falso.

Auditar:

- Supabase client;
- environment variables;
- AuthProvider;
- signIn;
- signOut;
- sessão;
- refresh;
- `onAuthStateChange`;
- `fetchMe`;
- `/me`;
- tratamento de sessão inválida;
- proteção de rotas.

Foi observado anteriormente:

`AuthApiError: Invalid login credentials`

na chamada:

`supabase.auth.signInWithPassword`

Investigar a cadeia inteira.

Não assumir automaticamente que é apenas senha incorreta.

Verificar se frontend está apontando para o projeto Supabase correto e se a configuração atual está coerente.

---

# 8. FORMULÁRIOS

Usar os padrões existentes do projeto:

- React Hook Form;
- Zod;
- schemas;
- mensagens amigáveis.

ATENÇÃO especial:

Formulários em modais precisam resetar corretamente ao alternar:

- criar;
- editar;
- registro selecionado;
- reabrir modal;
- cancelar;
- salvar.

Não confiar apenas em:

`defaultValues`

para atualizar dados quando o formulário já foi montado.

Usar `reset()` quando necessário.

---

# 9. REACT QUERY

Auditar todos os módulos.

Garantir:

- query keys coerentes;
- invalidation correta;
- mutations;
- loading;
- stale data;
- refetch;
- cache;
- dependências.

Exemplo:

Ao alterar uma reserva, invalidar:

`reservations`

e somente invalidar:

`chairs`

ou:

`dashboard`

quando a operação realmente afetar esses dados.

Não usar invalidações indiscriminadas.

---

# 10. RESERVAS

Auditar completamente:

- listagem;
- filtros;
- paginação;
- criação;
- edição;
- cancelamento;
- exclusão;
- mudança de status;
- cliente;
- poltrona;
- datas;
- conflitos.

Nunca implementar optimistic update de status quando o backend pode rejeitar a operação.

Esperar confirmação do backend.

Erros de conflito devem ser apresentados de forma amigável.

Exemplo:

`A poltrona já possui uma reserva conflitante.`

---

# 11. POLTRONAS

Auditar:

- listagem;
- cadastro;
- edição;
- status;
- bloqueios;
- manutenção;
- disponibilidade;
- integração com reservas.

Não permitir que a UI represente estado diferente do backend.

---

# 12. CLIENTES

Auditar:

- CRUD;
- validação;
- paginação;
- busca;
- loading;
- empty;
- error;
- edição;
- exclusão;
- feedback.

Usar os padrões visuais existentes.

---

# 13. BLOQUEIOS

Auditar:

- criação;
- edição;
- exclusão;
- período;
- motivo;
- conflito;
- atualização da lista;
- integração com poltronas/disponibilidade.

---

# 14. ENTREGAS

Auditar:

- CRUD;
- cliente;
- reserva;
- poltrona;
- endereço;
- status;
- datas;
- filtros;
- paginação;
- erros;
- feedback.

---

# 15. CONTRATOS

Existe rota frontend `/contracts`.

Verificar obrigatoriamente se:

- backend possui endpoints;
- endpoints estão registrados;
- service frontend aponta para URLs corretas;
- payloads coincidem;
- responses coincidem;
- autenticação funciona;
- mutations funcionam.

Não deixar uma tela de contratos "bonita" porém sem backend funcional.

---

# 16. FINANCEIRO

Auditar:

- listagem;
- filtros;
- criação;
- edição;
- status;
- valores;
- vencimento;
- pagamento;
- cancelamento;
- feedback.

Respeitar exatamente os enums vindos do backend.

Não transformar:

`paid`

em:

`PAID`

sem verificar o contrato real.

---

# 17. ASAAS

A integração real será configurada posteriormente pelo usuário.

O frontend deve:

- estar preparado para o fluxo;
- consumir os endpoints existentes;
- apresentar estados coerentes;
- não fingir integração externa real;
- não expor secrets;
- não armazenar API key do Asaas no frontend.

---

# 18. PARCEIROS

Auditar:

- CRUD;
- busca;
- filtros;
- paginação;
- validação;
- feedback;
- integração.

---

# 19. COMISSÕES

Auditar:

- listagem;
- filtros;
- parceiro;
- valores;
- status;
- paginação;
- atualização;
- integração financeira.

---

# 20. DASHBOARD

Verificar se os dados exibidos são realmente provenientes das APIs existentes.

Não usar números fictícios para preencher dashboard.

Verificar:

- loading;
- error;
- empty;
- cards;
- indicadores;
- consultas;
- atualização.

---

# 21. UX

Preservar a identidade visual atual do projeto.

Não fazer redesign global sem necessidade.

Garantir:

- responsividade;
- acessibilidade;
- estados de loading;
- estados vazios;
- mensagens de erro;
- confirmações;
- botões disabled;
- feedback de sucesso;
- feedback de conflito;
- modais;
- tabelas;
- paginação.

Não introduzir mudanças globais apenas por preferência estética.

---

# 22. ROTAS E NAVEGAÇÃO

Verificar:

- React Router;
- guards;
- lazy loading;
- Suspense;
- fallback;
- sidebar;
- links;
- redirects;
- 404;
- refresh direto.

Cada rota deve funcionar tanto pela navegação interna quanto por URL direta.

---

# 23. API CLIENT

Auditar:

- baseURL;
- headers;
- JWT;
- refresh;
- interceptors;
- tratamento de 401;
- tratamento de 403;
- tratamento de 404;
- tratamento de 409;
- tratamento de 422;
- tratamento de 500.

Não duplicar lógica de autenticação em cada service.

---

# 24. MULTI-TENANCY

O frontend NÃO deve enviar manualmente `companyId` em payloads quando o backend deriva a empresa do usuário autenticado.

Nunca confiar no frontend para isolamento.

Remover `companyId` de payloads quando estiver sendo enviado indevidamente e o contrato do backend não exigir.

---

# 25. TYPESCRIPT

PROIBIDO esconder problemas com:

- `any`;
- `as any`;
- casts indiscriminados;
- `@ts-ignore`;
- `@ts-expect-error` sem justificativa.

Foram identificados anteriormente casos de `any` em:

- LoginPage;
- PartnerService;
- CommissionService;
- Contracts.

Verificar o estado atual.

Corrigir tipagem corretamente.

---

# 26. COMPONENTIZAÇÃO

Respeitar a arquitetura existente.

Não criar abstrações gigantes.

Não duplicar componentes quando um padrão existente pode ser reutilizado.

Não mover todo o projeto de pasta sem necessidade.

Priorizar correção e consistência.

---

# 27. ERROS

A UI deve tratar corretamente:

- 400;
- 401;
- 403;
- 404;
- 409;
- 422;
- 500.

Especialmente:

409 = conflito de negócio.

Apresentar mensagem útil ao usuário.

Nunca mostrar stack trace ou detalhes internos desnecessários.

---

# 28. VALIDAÇÃO

Executar:

- npm run typecheck
- npm run lint
- npm run build

Se existirem testes:

- executar testes relevantes.

Corrigir os problemas encontrados.

Repetir até estabilizar.

---

# 29. BACKEND / FRONTEND INTEGRATION AUDIT

Para cada módulo:

### Clientes
Frontend ↔ Backend

### Poltronas
Frontend ↔ Backend

### Reservas
Frontend ↔ Backend

### Disponibilidade
Frontend ↔ Backend

### Bloqueios
Frontend ↔ Backend

### Entregas
Frontend ↔ Backend

### Contratos
Frontend ↔ Backend

### Financeiro
Frontend ↔ Backend

### Parceiros
Frontend ↔ Backend

### Comissões
Frontend ↔ Backend

Não declarar módulo concluído enquanto os dois lados não estiverem coerentes.

---

# 30. GIT

O agente pode criar commits locais para organizar as correções.

NÃO fazer push.

Push somente mediante solicitação explícita do usuário.

Nunca commitar:

- `.env`;
- secrets;
- tokens;
- credenciais.

---

# 31. CRITÉRIO DE CONCLUSÃO

O frontend somente poderá ser considerado pronto quando:

- rotas funcionarem;
- auth funcionar;
- APIs funcionarem;
- CRUDs funcionarem;
- forms funcionarem;
- React Query estiver correto;
- erros estiverem tratados;
- loading/empty/error estiverem presentes;
- paginação funcionar;
- multi-tenancy estiver respeitado;
- contratos estiverem integrados;
- UX estiver consistente;
- typecheck passar;
- lint passar;
- build passar;
- não existirem bugs críticos conhecidos.

---

# 32. RELATÓRIO FINAL

Apresentar:

## Auditoria
Problemas encontrados.

## Corrigido
Correções realizadas.

## Integração
Frontend ↔ Backend.

## Auth
Supabase/Auth/rotas protegidas.

## React Query
Queries/mutations/invalidation.

## Formulários
RHF/Zod/reset/validação.

## UX
Loading/error/empty/responsividade.

## Validação
- typecheck;
- lint;
- build;
- testes.

## Pendências
Somente problemas reais.

Classificar:

- P0 — crítico;
- P1 — alto;
- P2 — médio;
- P3 — baixo;
- BLOQUEADO — dependência externa.

## Arquivos alterados
Listar arquivos relevantes.

## Git
Informar commits locais criados.

NÃO declarar o projeto pronto se existirem problemas críticos conhecidos.

---

# 33. PRINCÍPIO FINAL

Você não está corrigindo uma tela isolada.

Você está finalizando o frontend completo do LocaMed.

Audite antes de alterar.

Corrija antes de declarar concluído.

Integre antes de considerar implementado.

Valide antes de considerar pronto.

Não invente resultados.

Não esconda problemas.

Não faça bypass de autenticação.

Não use dados fictícios.

Não reduza o escopo apenas para terminar mais rápido.

O objetivo é deixar o frontend realmente operacional e integrado ao backend completo do LocaMed.