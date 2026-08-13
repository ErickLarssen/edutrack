# Sistema de Gestão de Equipamentos Escolares

Sistema web para controle de empréstimo, devolução e manutenção de tablets,
notebooks e Chromebooks utilizados por professores e alunos em escola pública
da rede estadual de São Paulo (Programa PROATI).

## Status do projeto
🚧 Em desenvolvimento

## Stack
- **Frontend:** React + Vite + React Router + Axios + GSAP
- **Backend:** Node.js + Express
- **Banco de dados:** MySQL + Prisma ORM

## Estrutura do repositório
\`\`\`
backend/    → API REST (Node.js + Express + Prisma)
frontend/   → Interface web (React + Vite)
\`\`\`

## Evoluções futuras

**Histórico agregado**: uma visão de linha do tempo consolidada por equipamento (empréstimos + devoluções + manutenções em ordem cronológica). Hoje esse histórico já existe de forma distribuída entre os módulos de Empréstimos, Devoluções e Manutenção.
**Tela de Configurações**: preferências pessoais do usuário logado (troca de senha própria, preferências de exibição).
**Cancelamento de empréstimo**: decidido conscientemente como fora de escopo, ver Etapa 5 (módulo de Empréstimos).
- Arquitetura pronta para receber: endpoint de busca por QR (`GET /equipamentos?qrCode=...`, reaproveitando o filtro de busca já existente), e uma tela de "leitura rápida" no frontend usando a câmera do dispositivo.

## Como rodar o projeto
_(será documentado conforme o backend e frontend forem implementados)_

## Licença
Projeto pessoal de portfólio.