# Deploy no Render

Guia para deploy do backend da CPX Labs no Render usando a saída `standalone` do Next.js via Docker.

## Pré-requisitos

- Conta no [Render](https://render.com) (planta **Starter** ou superior)
- Repositório GitHub conectado à conta Render
- Variáveis de ambiente definidas (ver seção abaixo)

## Arquivos de configuração

| Arquivo | Função |
|---|---|
| `Dockerfile` | Multi-stage build: instala dependências, compila o Next.js, copia saída `standalone` |
| `.dockerignore` | Exclui diretórios desnecessários da imagem Docker |
| `render.yaml` | Blueprint do Render — define serviço, porta, health check e env vars |
| `next.config.ts` | Ativa `output: "standalone"` para deploy via Docker |

## Deploy via Blueprint (recomendado)

1. Faça push do repositório para o GitHub.
2. No [Render Dashboard](https://dashboard.render.com), clique em **New → Blueprint**.
3. Conecte o repositório `cpxlabs/cpx-labs`.
4. O Render lerá `render.yaml` e criará o serviço automaticamente.
5. Configure os segredos (env vars marcadas com `sync: false`) no dashboard.

## Deploy manual (Docker)

```bash
# Build da imagem
docker build -t cpx-labs-api .

# Executar localmente (teste)
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3001 \
  -e CONTACT_TO_EMAIL=admin@example.com \
  cpx-labs-api
```

No Render:
1. **New → Web Service**.
2. Escolha o repositório.
3. Runtime: **Docker**.
4. Porta: **3001**.
5. Health Check Path: `/api/health`.

## Variáveis de ambiente

As variáveis marcadas com 🔒 devem ser configuradas manualmente no **Render Dashboard → Environment**.

### Obrigatórias

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SITE_URL` 🔒 | URL pública do deployment (ex.: `https://cpxlabs.onrender.com`) |
| `CONTACT_TO_EMAIL` 🔒 | E-mail que recebe contatos do formulário |

### SMTP (opcional — para envio real de e-mails)

| Variável | Descrição |
|---|---|
| `SMTP_HOST` 🔒 | Host SMTP (ex.: `smtp.gmail.com`) |
| `SMTP_PORT` | Porta SMTP (padrão: `587`) |
| `SMTP_USER` 🔒 | Usuário SMTP |
| `SMTP_PASS` 🔒 | Senha SMTP |

### WhatsApp Cloud API (opcional — necessário para o webhook)

| Variável | Descrição |
|---|---|
| `WHATSAPP_TOKEN` 🔒 | Token de acesso da WhatsApp Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` 🔒 | Phone Number ID do número conectado na Meta |
| `WHATSAPP_VERIFY_TOKEN` 🔒 | Token para validação do webhook pela Meta |
| `WHATSAPP_APP_SECRET` 🔒 | App Secret para verificação de assinatura |
| `WHATSAPP_ADMIN_NUMBER` 🔒 | Número que recebe os resumos das mensagens |

### Google Gemini (opcional — para resumir mensagens longas)

| Variável | Descrição |
|---|---|
| `GEMINI_API_KEY` 🔒 | Chave de API do Gemini |
| `WHATSAPP_AI_MODEL` | Modelo Gemini (padrão: `gemini-2.5-flash`) |

## Health check

O Render verificará a saúde do serviço em `GET /api/contact`. Esse endpoint retorna `405`, mas indica que o servidor está rodando e aceitando requisições.

## Logs

- Sem SMTP: submissões do formulário são logadas em stdout (visíveis no **Render Dashboard → Logs**).
- Webhook: mensagens processadas e falhas de IA são logadas com nível `info`/`warn`.

## Domínio personalizado

1. **Render Dashboard → Settings → Custom Domain**.
2. Adicione o domínio (ex.: `api.cpxlabs.com.br`).
3. Configure o registro CNAME no DNS apontando para `cpxlabs.onrender.com`.
4. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio personalizado.
