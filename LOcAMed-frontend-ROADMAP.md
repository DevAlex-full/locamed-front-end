# LocaMed --- ROADMAP.md

## Objetivo

Concluir, estabilizar, auditar e preparar o LocaMed / Poltronas Med para
homologação e posterior produção.

Consulte este arquivo junto com `AGENTE.md`.

# Fase 0 --- Estabilização imediata

## Backend

-   [ ] Corrigir bootstrap do Fastify em `POST /financial`.
-   [ ] Localizar o schema responsável por
    `data/required must be array`.
-   [ ] Corrigir o JSON Schema/adapter na origem.
-   [ ] Procurar schemas financeiros semelhantes.
-   [ ] `npm run typecheck`
-   [ ] `npm run lint`
-   [ ] `npm run build`
-   [ ] `npm run dev`
-   [ ] Confirmar servidor ativo.

## Frontend

-   [ ] Confirmar `/` como Landing Page pública.
-   [ ] Corrigir `/login`.
-   [ ] Corrigir cadastro.
-   [ ] Corrigir CTA Login.
-   [ ] Corrigir CTA Começar Agora.
-   [ ] Corrigir CTA Criar Conta Grátis.
-   [ ] Corrigir CTA Cadastre-se agora.
-   [ ] Garantir que `/` não redirecione para Dashboard.
-   [ ] Garantir proteção das rotas privadas.
-   [ ] Testar navegação direta e refresh.
-   [ ] `npm run typecheck`
-   [ ] `npm run lint`
-   [ ] `npm run build`
-   [ ] `npm run dev`

# Fase 1 --- Núcleo

## Etapas 1--12

1.  Estrutura inicial do backend
2.  Banco de Dados e Modelagem
3.  Infraestrutura da API
4.  Autenticação e Controle de Acesso
5.  Auditoria
6.  Usuários e Empresas
7.  Estrutura Inicial do Frontend
8.  Autenticação e Página de Login
9.  Layout Principal e Navegação
10. Dashboard Inicial
11. Gestão de Clientes
12. Gestão de Poltronas

Preservar e corrigir apenas quando necessário.

# Fase 2 --- Operação

## 13. Gestão de Reservas

-   [ ] CRUD
-   [ ] filtros/paginação
-   [ ] status
-   [ ] conflitos
-   [ ] isolamento
-   [ ] auditoria
-   [ ] integração com poltronas
-   [ ] concorrência/overbooking
-   [ ] frontend
-   [ ] React Query
-   [ ] validação
-   [ ] testes reais

## 14. Bloqueios e Manutenção

-   [ ] bloqueios por período
-   [ ] manutenção
-   [ ] disponibilidade
-   [ ] conflitos
-   [ ] frontend
-   [ ] integração com reservas

## 15. Entregas

-   [ ] criação
-   [ ] atualização/status
-   [ ] vínculo com reserva
-   [ ] frontend
-   [ ] integração

# Fase 3 --- Contratos e Financeiro

## 16. Gestão de Contratos

-   [ ] modelos
-   [ ] vínculo com reserva/cliente
-   [ ] vigência
-   [ ] assinatura/status
-   [ ] frontend
-   [ ] validação

## 17. Controle Financeiro

-   [ ] transações
-   [ ] cobranças
-   [ ] status
-   [ ] filtros
-   [ ] dashboard
-   [ ] precisão monetária
-   [ ] frontend
-   [ ] integração

## 18. Integração Asaas

-   [ ] adapter/service
-   [ ] criação de cobranças
-   [ ] consulta de pagamentos
-   [ ] configuração segura
-   [ ] secrets
-   [ ] frontend quando necessário
-   [ ] nunca expor API key

A configuração real da conta Asaas é externa ao código.

## 19. Webhooks

-   [ ] endpoint
-   [ ] validação do token
-   [ ] idempotência
-   [ ] auditoria
-   [ ] atualização financeira
-   [ ] eventos desconhecidos
-   [ ] testes de segurança

# Fase 4 --- Disponibilidade e Growth

## 20. Disponibilidade

-   [ ] calendário
-   [ ] bloqueios
-   [ ] consulta por poltrona
-   [ ] liberação
-   [ ] frontend
-   [ ] integração

## 21. Parceiros

-   [ ] médicos
-   [ ] clínicas
-   [ ] referral code
-   [ ] CRUD
-   [ ] isolamento
-   [ ] frontend

## 22. Comissões

-   [ ] cálculo
-   [ ] registro
-   [ ] status
-   [ ] liquidação
-   [ ] amount_cents/Decimal
-   [ ] frontend
-   [ ] auditoria

# Fase 5 --- Administração

## 23. Auditoria Visual

-   [ ] revisão visual completa
-   [ ] responsividade
-   [ ] loading
-   [ ] erro
-   [ ] empty states
-   [ ] modais
-   [ ] mensagens
-   [ ] consistência

## 24. Configurações

-   [ ] empresa
-   [ ] usuário
-   [ ] permissões
-   [ ] preferências
-   [ ] segurança

## 25. Documentos

-   [ ] modelos
-   [ ] geração
-   [ ] armazenamento
-   [ ] acesso seguro
-   [ ] vínculos

# Fase 6 --- Qualidade

## 26. Testes

-   [ ] unitários
-   [ ] integração
-   [ ] API
-   [ ] autenticação
-   [ ] multi-tenancy
-   [ ] concorrência
-   [ ] financeiro
-   [ ] frontend crítico
-   [ ] rotas

## 27. Hardening

-   [ ] IDOR
-   [ ] autenticação/autorização
-   [ ] company_id
-   [ ] webhooks
-   [ ] secrets
-   [ ] logs
-   [ ] inputs
-   [ ] CORS
-   [ ] rate limiting quando apropriado
-   [ ] Decimal/centavos
-   [ ] idempotência
-   [ ] arredondamento
-   [ ] status de pagamento
-   [ ] error boundaries
-   [ ] API errors
-   [ ] lazy loading
-   [ ] bundle

# Fase 7 --- Deploy

## 28. Deploy Backend

-   [ ] variáveis de ambiente
-   [ ] migrations
-   [ ] health check
-   [ ] logs
-   [ ] CORS
-   [ ] secrets
-   [ ] produção

## 29. Deploy Frontend

-   [ ] build
-   [ ] variáveis
-   [ ] URL da API
-   [ ] SPA fallback
-   [ ] rotas
-   [ ] autenticação
-   [ ] HTTPS

## 30. MVP Final

-   [ ] backend inicia
-   [ ] frontend inicia
-   [ ] landing abre
-   [ ] login funciona
-   [ ] cadastro funciona
-   [ ] autenticação funciona
-   [ ] dashboard funciona
-   [ ] CRUDs principais
-   [ ] reservas
-   [ ] disponibilidade
-   [ ] entregas
-   [ ] contratos
-   [ ] financeiro
-   [ ] parceiros
-   [ ] comissões
-   [ ] auditoria
-   [ ] multi-tenancy
-   [ ] hardening
-   [ ] backend typecheck PASS
-   [ ] frontend typecheck PASS
-   [ ] backend lint PASS
-   [ ] frontend lint PASS
-   [ ] backend build PASS
-   [ ] frontend build PASS
-   [ ] backend runtime PASS
-   [ ] frontend runtime PASS

## Critério de conclusão

Uma etapa só é DONE quando implementação e integração estiverem
comprovadas.

Mensagens antigas do agente não são evidência suficiente.

A fonte de verdade é o código atual + testes executados.
