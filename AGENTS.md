# 🩺 Med Hub - Roadmap & Documentation

## 🎨 Design System & UI/UX (Prioridade Absoluta)
O foco principal agora é elevar a interface para um nível "Premium/State-of-the-art".
- **Visual**: Glassmorphism, Sombras Suaves, Bordas Arredondadas (xl/2xl), Animações Fluidas (`framer-motion` ou CSS transitions).
- **Tipografia**: Uso extensivo da fonte **Poppins** para títulos e **Inter** para corpo.
- **Micro-interações**: Hover effects em cards, botões com feedback visual, loaders elegantes (ECG animation).

## 🚀 Rumo aos 95% - Status Atual

### 1. Infraestrutura & Banco de Dados ✅
- [x] **Configurar PostgreSQL**: Conexão configurada e script `init-db` criado.
- [x] **Persistência**: Schema atualizado com suporta a novas roles e campos.
- [x] **Seed**: Scripts de seed para Admin e Banco inicial criados.

### 2. Dashboards "Premium" (UI/UX) ✅
- [x] **Dashboard Médico**:
    - [x] Cards com Glassmorphism e animações.
    - [x] Saudação personalizada e "Logout".
    - [x] Adaptação para visão de **Enfermeiro**.
- [x] **Dashboard Hospital**:
    - [x] Criação de vagas com seletor (Médico/Enfermeiro).
    - [x] Lista de Candidatos interativa.
- [x] **Dashboard Admin**:
    - [x] Toggle View (Hospital/Médico) funcional.
    - [x] Visual polido e consistente.

### 3. Fluxos de Negócio & Features 💼
- [x] **Notificações**: Sistema de `Toasts` customizado implementado (substituindo alerts).
- [x] **Suporte a Enfermagem**:
    - [x] Nova Role `nurse` no banco de dados.
    - [x] Cadastro específico (COREN).
    - [x] Vagas dedicadas a enfermeiros.
- [x] **Perfil**: Página de edição de perfil (Upload de foto, alterar senha).
- [x] **Documents & Holerites (Payslips)**:
    - [x] Sistema de upload de holerites para Hospitais.
    - [x] Área de "Meus Documentos" para Médicos e Enfermeiros.
- [x] **Chat Integrado**:
    - [x] Mensagens diretas entre Hospital e Profissionais (Médicos/Enfermeiros).
    - [x] Foco total na inclusão da enfermagem.

## 4. Polimento Visual (UI/UX) - Premium ✨
- [x] **Animações**: Refinar transições e feedbacks (Page Transitions).
- [x] **Inclusividade**: Revisão final de textos para garantir que "Enfermeiros" sejam citados.

## 5. Monetização & Institucional 💰
- [x] **Páginas Institucionais**:
    - [x] Termos de Uso, Privacidade, Compliance, LGPD criados.
    - [x] Links no rodapé com "MapTooltip" animado.
- [x] **Estratégia de Monetização**:
    - [x] Sistema de **Verificação** ("Verified Badge") implementado.
    - [x] Landing Page de **Planos** (Pricing Premium).
    - [x] Bloqueio proativo de limites para contas Grátis.
- [x] **UX de Autenticação**:
    - [x] Redirecionamento inteligente (Navbar/Hero) se já logado.
    - [x] Banner de Cookies "Super Lindinho" implementado.

---

## 🛠️ Banco de Dados (Atualizado)

O projeto agora possui scripts para facilitar a configuração:

1.  **Configurar `.env`**: Crie o arquivo com suas credenciais (ex: `DB_PASSWORD`).
2.  **Inicializar Banco**: Rode `npm run init-db` para criar o banco e as tabelas automaticamente.
3.  **Criar Admin**: Rode `npx ts-node server/seedAdmin.ts`.

---

## 🤖 Comandos Úteis
- `npm run dev`: Inicia Frontend (Vite) + Backend (Node).
- `npm run init-db`: Reseta e cria o banco de dados `med_hub`.
