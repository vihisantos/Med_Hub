# Med Hub

<p align="center">
  <strong>The Operating System for Medical Shift Management</strong>
  <br>
  Conectando hospitais de alto padrao com profissionais de saude de elite.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## Sobre

**Med Hub** e uma plataforma premium de gerenciamento de plantoes medicos. Conecta hospitais a medicos e enfermeiros qualificados, oferecendo dashboards em tempo real, sistema de candidatura inteligente, chat integrado e gestao financeira.

Projeto em estagio de prototipo de alta fidelidade com MVP funcional.

---

## Tech Stack

### Frontend

| Tecnologia | Proposito |
|---|---|
| **React 18** | Biblioteca de interface |
| **TypeScript** | Tipagem estatica |
| **Vite 5** | Build tool e dev server |
| **Tailwind CSS 3** | Estilizacao utilitaria |
| **Framer Motion** | Animacoes e transicoes |
| **Lucide React** | Iconografia |
| **React Router 6** | Roteamento SPA |
| **Vitest + Testing Library** | Testes unitarios |

### Backend

| Tecnologia | Proposito |
|---|---|
| **Node.js + Express 4** | Servidor HTTP |
| **TypeScript** | Tipagem estatica |
| **PostgreSQL** | Banco de dados relacional |
| **JWT (jsonwebtoken)** | Autenticacao via tokens |
| **bcryptjs** | Hashing de senhas |
| **multer** | Upload de arquivos |
| **cors** | Cross-origin requests |
| **dotenv** | Variaveis de ambiente |

### Infraestrutura & Ferramentas

| Tecnologia | Proposito |
|---|---|
| **GitHub Pages** | Deploy estatico |
| **concurrently** | Dev server em paralelo |
| **nodemon** | Hot reload do backend |
| **gh-pages** | Deploy automatizado |

---

## Funcionalidades Principais

- **Dashboard Hospital** — Gerenciamento de vagas, selecao de candidatos, metricas em tempo real
- **Dashboard Profissional** — Candidatura com um clique, filtros por especialidade/local/taxa
- **Multi-role** — Suporte a Medicos e Enfermeiros com cadastro especifico (CRM/COREN)
- **Chat Integrado** — Mensagens diretas entre hospitais e profissionais
- **Perfil e Documentos** — Upload de foto, holerites, gestao de documentos
- **Sistema de Verificacao** — Badge verified e planos premium
- **Painel Admin** — Visao unificada com toggle entre hospital e profissional
- **Notificacoes** — Sistema de toasts customizado
- **Papeis Institucionais** — Termos de Uso, Privacidade, LGPD, Compliance
- **Banner de Cookies** — Consentimento com LGPD

---

## Estrutura do Projeto

```
med-hub-web/
  src/                     Frontend React SPA
    components/            Componentes reutilizaveis
    pages/                 Paginas e rotas
    context/               Contextos React
    types/                 Tipos TypeScript
    utils/                 Utilitarios
    App.tsx                Entry point + rotas
    main.tsx               Renderizacao
  server/                  Backend API Express
    controllers/           Logica dos endpoints
    routes/                Definicao de rotas
    middleware/            Middlewares (auth, upload)
    db.ts                  Configuracao PostgreSQL
    initDb.ts              Script de inicializacao do banco
    schema.sql             Schema do banco de dados
    seedAdmin.ts           Seed de admin
  dist/                    Build de producao
  public/                  Assets estaticos
```

---

## Arquitetura

```
[Cliente React SPA] ---- fetch /api/* ---- [Servidor Express]
       |                                          |
       | React Router 6                    JWT Auth Middleware
       | Framer Motion                     Controllers + Routes
       | Tailwind + Lucide                 PostgreSQL
       v                                          v
[GitHub Pages Deploy]                   [Banco de Dados]
```

---

<p align="center">
  <br>
  <sub>Desenvolvido por <a href="https://capybaraholding.com.br" target="_blank"><strong>Capybara Holding</strong></a></sub>
  <br>
  <sub>&copy; 2026 Med Hub. Todos os direitos reservados.</sub>
</p>
