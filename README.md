# CPX Labs — Site Institucional

Site institucional do **CPX Labs**, grupo de consultoria em TI, construído com **Next.js 16**, **TypeScript** e **Tailwind CSS 4**.

## Identidade visual

A interface segue a paleta oficial do logo do **CPX Labs**, baseada em tons profundos de roxo, violeta e branco.

| Token | Hex | Uso principal |
|---|---|---|
| `brand-950` | `#16002f` | fundos escuros e rodapé |
| `brand-900` | `#200047` | superfícies escuras secundárias |
| `brand-700` | `#42058f` | contraste e blocos institucionais |
| `brand-500` | `#7f2cff` | CTAs e destaques principais |
| `brand-300` | `#c29fff` | realces, hover e números |
| `brand-100` | `#ede2ff` | fundos suaves e badges claros |

Os tokens ficam centralizados em `/src/app/globals.css` e são reutilizados por todas as seções principais.

## Preview

### Início
![Hero — Início](./public/screenshots/hero.png)

### Serviços
![Serviços](./public/screenshots/servicos.png)

### Quem Somos
![Quem Somos](./public/screenshots/quem-somos.png)

### Contato
![Contato](./public/screenshots/contato.png)

## Páginas e seções

| Seção | Rota | Descrição |
|---|---|---|
| **Início** | `/` | Hero com headline, estatísticas e CTAs |
| **Serviços** | `/servicos` | 5 cards de serviços de TI + banner de consultoria estratégica |
| **Ferramentas** | `/ferramentas` | Hub de ferramentas internas com links para GitHub |
| **Portfólio** | `/portfolio` | Projetos open-source com screenshots, descrições e links para GitHub + live demo |
| **Quem Somos** | `/quem-somos` | Missão, visão, valores, diferenciais e equipe de liderança |
| **Contato** | `/contato` | Formulário funcional via `/api/contact` + canais de contato |
| **Webhook WhatsApp** | `/api/whatsapp/webhook` | Endpoint para validar o webhook da Meta, resumir textões com IA e encaminhar alertas |

## Pré-requisitos

- **Node.js** ≥ 22 (testado com v22.23.1)
- **npm** ≥ 9

## Desenvolvimento local

```bash
# 1. Clone o repositório
git clone https://github.com/cpxlabs/cpx-labs.git
cd cpx-labs

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com seus valores

# 4. Inicie o servidor de desenvolvimento
npm run dev
# Acesse http://localhost:3000
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção localmente |
| `npm run lint` | Executa o ESLint |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |
| `node scripts/screenshots.mjs` | Regenera as screenshots de todos os projetos do portfólio |

## Testes

O projeto usa **Jest** + **React Testing Library** para testes de componentes e de rota de API.

```bash
# Rodar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com cobertura de código
npm run test:coverage
```

**Suítes de teste disponíveis (`src/__tests__/`):**

| Arquivo | O que testa |
|---|---|
| `Hero.test.tsx` | Headline, CTAs, estatísticas |
| `Services.test.tsx` | 6 cards de serviços, tags de tecnologia |
| `About.test.tsx` | História, valores, painel de código |
| `Contact.test.tsx` | Seção de contato com telefone e e-mail |
| `ContactForm.test.tsx` | Formulário, envio, validação, payload |
| `Footer.test.tsx` | Links de navegação, redes sociais, copyright |
| `PortfolioPage.test.tsx` | Grid de projetos, links GitHub/Live Demo |
| `FerramentasPage.test.tsx` | Card da ferramenta em destaque, CTAs |
| `QuemSomosPage.test.tsx` | Missão, visão, valores fundamentais |
| `ServicosPage.test.tsx` | Cards de serviço, banner de consultoria |
| `ContatoPage.test.tsx` | Formulário, cards de informação de contato |
| `api.contact.test.ts` | Validação, sanitização e respostas do endpoint `/api/contact` |
| `api.whatsapp-webhook.test.ts` | Verificação do webhook, assinatura, filtros e fallback |

## Estilo e branding

- A paleta global e o tratamento do logotipo ficam em `src/app/globals.css`.
- Os componentes em `src/components/` consomem os tokens `brand-*` para manter consistência visual.
- As screenshots em `public/screenshots/` foram atualizadas para refletir a identidade visual atual.

## Deploy na Vercel

### Deploy com um clique

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcpxlabs%2Fcpx-labs)

### Deploy manual via CLI

```bash
# Instale a CLI da Vercel globalmente (se ainda não tiver)
npm i -g vercel

# Faça login na Vercel
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### Variáveis de ambiente na Vercel

Configure as seguintes variáveis em **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL pública do site (ex.: `https://cpxlabs.com.br`) |
| `CONTACT_TO_EMAIL` | ✅ | E-mail que recebe os contatos do formulário |
| `SMTP_HOST` | ⚠️ opcional | Host SMTP para envio de e-mails |
| `SMTP_PORT` | ⚠️ opcional | Porta SMTP (padrão: `587`) |
| `SMTP_USER` | ⚠️ opcional | Usuário SMTP |
| `SMTP_PASS` | ⚠️ opcional | Senha SMTP |
| `WHATSAPP_TOKEN` | ⚠️ opcional | Token da WhatsApp Cloud API usado para enviar alertas |
| `WHATSAPP_PHONE_NUMBER_ID` | ⚠️ opcional | Phone Number ID do número conectado na Meta |
| `WHATSAPP_VERIFY_TOKEN` | ⚠️ opcional | Token usado pela Meta para validar o webhook |
| `WHATSAPP_APP_SECRET` | ⚠️ opcional | App Secret da aplicação Meta para validar a assinatura |
| `WHATSAPP_ADMIN_NUMBER` | ⚠️ opcional | Número que recebe os resumos gerados pelo webhook |
| `WHATSAPP_BUSINESS_PHONE_NUMBER` | ⚠️ opcional | Número da empresa para ignorar mensagens originadas do próprio negócio |
| `WHATSAPP_MIN_SUMMARY_CHARACTERS` | ⚠️ opcional | Mínimo de caracteres para tratar uma mensagem como “textão” |
| `WHATSAPP_GRAPH_API_VERSION` | ⚠️ opcional | Versão da Graph API para envio de mensagens |
| `WHATSAPP_AI_MODEL` | ⚠️ opcional | Modelo Gemini usado na geração do resumo |
| `WHATSAPP_AI_TIMEOUT_MS` | ⚠️ opcional | Timeout máximo da chamada de IA antes de cair no fallback |
| `GEMINI_API_KEY` | ⚠️ opcional | Chave de API do Gemini para resumir mensagens |

> **Sem SMTP configurado**: as submissões do formulário são registradas nos logs da Vercel Function. Integre o `nodemailer` (ou outro provider como [Resend](https://resend.com)) no arquivo `src/app/api/contact/route.ts` para habilitar o envio real de e-mails.

## Webhook do WhatsApp

O projeto também expõe o endpoint `/api/whatsapp/webhook` para integrar a **WhatsApp Cloud API** ao App Router do Next.js.

### Fluxo

1. A Meta valida o endpoint com um `GET /api/whatsapp/webhook`.
2. Mensagens novas chegam via `POST` assinado com `X-Hub-Signature-256`.
3. O endpoint filtra apenas mensagens de texto acima do limite configurado.
4. O texto é resumido com o Gemini; se a IA falhar, o sistema usa um fallback local.
5. O resumo é enviado para `WHATSAPP_ADMIN_NUMBER` usando a própria Cloud API.

### Configuração

1. Preencha as variáveis `WHATSAPP_*` e `GEMINI_API_KEY` em `.env.local` ou na Vercel.
2. Publique o projeto em uma URL pública HTTPS.
3. No painel da Meta Developers, configure a URL do webhook como:

   ```text
   https://seu-dominio.com/api/whatsapp/webhook
   ```

4. Use o mesmo valor de `WHATSAPP_VERIFY_TOKEN` no painel da Meta.
5. Faça um teste com o número sandbox/produção antes de liberar o fluxo definitivo.

### Observações de segurança e operação

- A rota valida a assinatura `X-Hub-Signature-256` com `WHATSAPP_APP_SECRET`.
- Mensagens duplicadas são ignoradas em memória para reduzir reprocessamento e retries repetidos.
- O resumo é encaminhado para um número administrador, sem responder automaticamente ao remetente final.
- Se a IA estiver indisponível, o webhook continua funcionando com um resumo de fallback.

### Domínio customizado

Após o deploy, adicione seu domínio em **Vercel Dashboard → Project → Settings → Domains** e atualize a variável `NEXT_PUBLIC_SITE_URL`.

## Estrutura do projeto

```
cpx-labs/
├── src/
│   ├── __tests__/
│   │   ├── api.contact.test.ts   # Testes da route handler /api/contact
│   │   ├── api.whatsapp-webhook.test.ts # Testes da route handler /api/whatsapp/webhook
│   │   ├── About.test.tsx        # Testes do componente Quem Somos
│   │   ├── Contact.test.tsx      # Testes do formulário de contato
│   │   ├── Footer.test.tsx       # Testes do rodapé
│   │   ├── Hero.test.tsx         # Testes da seção de destaque
│   │   └── Services.test.tsx     # Testes da seção de serviços
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts      # Serverless function — formulário de contato
│   │   │   └── whatsapp/
│   │   │       └── webhook/
│   │   │           └── route.ts  # Webhook da WhatsApp Cloud API
│   │   ├── ferramentas/
│   │   │   └── page.tsx          # Hub de ferramentas internas
│   │   ├── portfolio/
│   │   │   └── page.tsx          # Projetos open-source com screenshots
│   │   ├── globals.css
│   │   ├── layout.tsx            # Layout raiz (metadados SEO, lang="pt-BR")
│   │   └── page.tsx              # Página principal (hero + serviços + contato)
│   ├── components/
│   │   ├── Header.tsx            # Navegação fixa e responsiva
│   │   ├── Hero.tsx              # Seção de destaque
│   │   ├── Services.tsx          # Grade de serviços
│   │   ├── About.tsx             # Quem somos + equipe
│   │   ├── Contact.tsx           # Formulário de contato
│   │   ├── Footer.tsx            # Rodapé
│   │   ├── PageTransition.tsx    # Transições de página
│   │   ├── ThreeScene.tsx        # Cena Three.js 3D de fundo
│   │   └── three/                # Componentes Three.js
│   ├── lib/
│   │   ├── ai-summary.ts         # Resumo/fallback via Gemini REST
│   │   ├── tools.ts              # Dados tipados das ferramentas
│   │   └── whatsapp.ts           # Configuração, parsing e envio via WhatsApp Cloud API
├── public/
│   ├── portfolio/                # Screenshots dos projetos do portfólio
│   └── screenshots/              # Capturas de tela das seções
├── openspec/                     # Especificações do projeto
│   ├── project.md                # Visão geral das iniciativas
│   ├── specs/                    # Especificações formais por capacidade
│   └── changes/                  # Propostas de mudança por feature
├── scripts/
│   └── screenshots.mjs           # Script Puppeteer para capturar demos
├── .env.example                  # Template de variáveis de ambiente
├── .nvmrc                        # Versão do Node.js (22.23.1)
├── jest.config.ts                # Configuração do Jest
├── jest.setup.tsx                # Setup global dos testes (jest-dom)
├── vercel.json                   # Configuração do deploy na Vercel
└── next.config.ts                # Configuração do Next.js
```

## Tecnologias

- [Next.js 16](https://nextjs.org/) — framework React com App Router e Turbopack
- [React 19](https://react.dev/) — biblioteca de UI
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização utilitária
- [TypeScript 5](https://www.typescriptlang.org/) — tipagem estática
- [Vercel](https://vercel.com/) — plataforma de deploy

---

© 2024 CPX Labs. Todos os direitos reservados.
