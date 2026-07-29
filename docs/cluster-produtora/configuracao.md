# Cluster Produtora — Configuração do Contrato Digital

## Visão Geral

O contrato digital da Cluster Produtora usa:
- **Formulário multi-step** (`/cluster-produtora/contrato`)
- **Autenticação GOV.br** via OAuth2/OpenID Connect para assinatura eletrônica
- **Geração de PDF** server-side com `jspdf`
- **Envio por e-mail** via Resend (PDF anexo)

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── api/cluster/
│   │   ├── contract/route.ts       # POST - gera PDF + envia e-mail
│   │   ├── gov-login/route.ts      # GET - redirect GOV.br
│   │   └── gov-callback/route.ts   # GET - callback OAuth
│   └── cluster-produtora/
│       ├── page.tsx                # Página institucional + CTA
│       └── contrato/
│           ├── page.tsx            # Wizard 3 etapas
│           └── assinado/
│               └── page.tsx        # Sucesso pós-assinatura
├── lib/cluster/
│   ├── types.ts                    # Tipos (form, service, gov)
│   ├── constants.ts                # Serviços, UFs, helpers
│   ├── govbr.ts                    # OAuth GOV.br (mock em dev)
│   └── contract-pdf.ts            # Geração de PDF A4
└── components/contract/           # (reservado para componentes do wizard)
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GOVBR_CLIENT_ID` | Produção | Client ID do app GOV.br |
| `GOVBR_CLIENT_SECRET` | Produção | Client Secret do app GOV.br |
| `GOVBR_JWT_SECRET` | Opcional | Chave para assinar JWT interno (default: dev) |
| `NEXT_PUBLIC_BASE_URL` | Opcional | URL base para redirect_uri (default: localhost) |
| `RESEND_API_KEY` | Produção | API Key do Resend para envio de e-mail |

---

## Como Testar Localmente (sem GOV.br real)

1. Gere um token base64 com dados fictícios:
   ```bash
   echo -n '{"sub":"dev","name":"Fulano Silva","cpf":"12345678901","email":"teste@email.com"}' | base64
   ```

2. Acesse a URL de callback diretamente:
   ```
   http://localhost:3000/api/cluster/gov-callback?code=<base64-aqui>
   ```

3. O sistema redirecionará para `/cluster-produtora/contrato/assinado?token=...`

---

## Fluxo Completo

```
1. Usuário → /cluster-produtora/contrato
2. Preenche dados pessoais (Step 1)
3. Seleciona serviço (Step 2)
4. Revisa e aceita termos (Step 3)
5. Clica "Assinar com GOV.br"
6. → /api/cluster/gov-login → redirect GOV.br
7. Login no GOV.br → /api/cluster/gov-callback
8. Troca code → token → JWT interno
9. → /contrato/assinado?token=...
10. Frontend chama POST /api/cluster/contract
11. Gera PDF → envia e-mail com anexo
12. Tela de sucesso com protocolo
```

---

## E-mail (Resend)

Em **desenvolvimento** (sem `RESEND_API_KEY`), o contrato não é enviado — o sistema loga no console e retorna `emailSent: false`. A tela de sucesso ainda exibe o protocolo e um link para download.

Em **produção**, configure a key do Resend e um domínio verificado.
