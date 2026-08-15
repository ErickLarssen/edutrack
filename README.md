# EduTrack

Sistema web de gestão de equipamentos escolares — controle de empréstimo, devolução e manutenção de tablets, notebooks e Chromebooks, desenvolvido para o Programa PROATI da rede estadual de ensino de São Paulo.

[![Testes](https://github.com/ErickLarssen/edutrack/actions/workflows/tests.yml/badge.svg)](https://github.com/ErickLarssen/edutrack/actions/workflows/tests.yml)

**🔗 Aplicação em produção:** [edutrack-seven-gamma.vercel.app](https://edutrack-seven-gamma.vercel.app)

## O problema

Escolas que utilizam equipamentos tecnológicos em sala de aula frequentemente controlam empréstimos de forma manual (papel/planilha) — sem rastreabilidade de quem retirou o quê, sem histórico de manutenção, e sem visibilidade em tempo real da disponibilidade do inventário. O EduTrack nasceu para resolver exatamente esse problema, a partir da rotina real de um estagiário do PROATI, e hoje está em uso real numa escola pública.

## Funcionalidades

- 🔐 **Autenticação e autorização** por 4 papéis (Administrador, Coordenador, Diretor, Estagiário)
- 💻 **Equipamentos** — cadastro, edição, inativação/reativação, controle de status
- 👨‍🏫 **Professores** — cadastro com soft delete
- 🔄 **Empréstimos** — seleção múltipla de equipamentos, vínculo com professor
- ↩️ **Devoluções** — conferência por item, com registro de danos
- 🔧 **Manutenção** — ciclo de vida completo (aberta → em andamento → concluída), aberta manualmente ou automaticamente a partir de uma devolução com problema
- 📊 **Dashboard e Relatórios** — indicadores em tempo real, equipamentos mais utilizados/danificados, tempo médio de empréstimo
- 👥 **Gestão de usuários** — com proteções contra autossabotagem administrativa (ex: impedir que o único admin se desative)

## Stack tecnológica

**Backend**
- Node.js + Express — API REST
- Prisma ORM + MySQL — persistência de dados
- JWT + bcryptjs — autenticação e hash de senha
- Zod — validação de schema
- Jest + Supertest — testes unitários e de integração

**Frontend**
- React + Vite
- Tailwind CSS v4 — design system próprio
- TanStack Query — cache e sincronização de dados do servidor
- React Hook Form + Zod — formulários e validação
- React Router — roteamento com proteção de rotas
- GSAP — microinterações
- Vitest + Testing Library — testes de componente

**Infraestrutura**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)
- Banco de dados: [Aiven](https://aiven.io) (MySQL gerenciado)

## Arquitetura

O backend segue uma arquitetura em camadas — **Controller → Service → Repository** — separando lógica HTTP, regra de negócio e acesso a dados. Decisões relevantes incluem:

- **Transações atômicas** (Prisma `$transaction`) para operações com efeitos em cascata (ex: registrar um empréstimo atualiza o status dos equipamentos numa única operação garantida)
- **Soft delete** em entidades referenciadas por histórico (Equipamento, Professor, Usuário), preservando integridade referencial e rastreabilidade
- **Máquina de estados** explícita para o ciclo de vida de manutenções
- **Validação em duas camadas** — Zod no frontend (feedback imediato) e no backend (fonte de verdade)

O projeto é organizado como **monorepo**, com `backend/` e `frontend/` na mesma raiz.

```
edutrack/
├── backend/
│   ├── prisma/          # schema, migrations, seed
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── validations/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/  # design system + componentes por módulo
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/    # clientes de API
│   │   ├── contexts/
│   │   └── layouts/
│   └── tests/
```

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- MySQL 8 rodando localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env   # preencha DATABASE_URL, JWT_SECRET, etc.
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # aponte VITE_API_URL para o backend local
npm run dev
```

## Testes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Roadmap e evoluções futuras

Itens conscientemente deixados fora do escopo atual, documentados aqui em vez de esquecidos:

- **CI/CD com GitHub Actions** — planejado, ainda não implementado; rodar a suíte de testes automaticamente a cada push é o próximo passo natural, já que a infraestrutura de testes já existe
- **Configurações pessoais** — tela de autosserviço para troca de senha (hoje só o Admin pode alterar a senha de outro usuário)
- **Histórico agregado** — linha do tempo consolidada por equipamento (empréstimos + devoluções + manutenções em ordem cronológica)
- **Cancelamento de empréstimo** — reversão de um empréstimo criado por engano, antes de qualquer devolução
- **QR Code** — leitura rápida de equipamentos via câmera (o campo `qrCode` já existe no schema, reservado para essa expansão)
- **Multi-tenant** — suporte a múltiplas escolas com isolamento de dados, caso o sistema seja adotado por outras unidades

## Nota sobre o banco de dados gratuito

O plano gratuito do Aiven desliga o serviço automaticamente após períodos de inatividade. Se a aplicação retornar erro ao acessar dados após um tempo sem uso, acesse o [painel da Aiven](https://console.aiven.io) e reative o serviço manualmente.

## Contexto

Projeto desenvolvido por Erick Larssen, estagiário PROATI da Secretaria da Educação do Estado de São Paulo, como parte de seu portfólio como desenvolvedor Full-Stack — e em uso real na escola onde atua.

## Licença

Projeto pessoal de portfólio.