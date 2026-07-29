# Capability: contract-generator

Gerador de contratos de prestação de serviços de produção musical para a **Cluster Produtora**. O cliente preenche seus dados num formulário, seleciona o serviço desejado, assina eletronicamente via GOV.br e recebe uma cópia do contrato assinado por e-mail.

---

## Architecture overview

```
User fills form  ──>  Preview & sign  ──>  GOV.br OAuth login  ──>  PDF generated  ──>  Sent via email
```

Dependencies to add:
- **`react-hook-form` + `zod`** — form state + validation
- **`@react-email/components` + `resend`** — email template + delivery (Resend supports Brazil)
- **`@node-rs/jwt`** or **`jose`** — JWT validation for GOV.br OpenID Connect tokens
- **`jspdf`** — PDF generation (lightweight, works client-side for preview)

---

## Pages / Routes

| Route | Method | Description |
|---|---|---|
| `/cluster-produtora/contrato` | GET | Contract form page — multi-step wizard |
| `/cluster-produtora/contrato/assinado` | GET | Success page after signing |
| `/api/cluster/contract` | POST | Generate + send contract |
| `/api/cluster/gov-login` | GET | Redirect to GOV.br OAuth |
| `/api/cluster/gov-callback` | GET | GOV.br OAuth callback |

---

## 1. Contract Form (`/cluster-produtora/contrato`)

### Requirement: Multi-step wizard

A 3-step form guiding the client through contract creation.

#### Step 1 — Dados Pessoais

| Field | Type | Required | Validation |
|---|---|---|---|
| Nome completo | text | yes | min 3 chars |
| CPF/CNPJ | text | yes | 11 or 14 digits, validated via check digits |
| E-mail | email | yes | valid format |
| Telefone | tel | yes | (XX) XXXXX-XXXX |
| Endereço | text | yes | min 10 chars |
| Cidade / UF | text + select | yes | valid UF |
| Profissão | text | no | — |

#### Step 2 — Dados do Serviço

- **Tipo de serviço**: radio group com os serviços da tabela do Cluster Produtora:
  - Produção de Single (R$ 600,00)
  - Pós-Produção de Single (R$ 400,00)
  - EP / Álbum (valor por faixa)

- **Escopo detalhado**: textarea livre para o cliente descrever o projeto.

- **Nº de faixas** (só aparece se EP/Álbum): number, min 2.

- **Prazo desejado**: date picker (estimativa).

#### Step 3 — Revisão e Assinatura

- Resumo do contrato em linguagem clara
- Termos de serviço (checkboxes):
  - [ ] Li e concordo com os termos de serviço da Cluster Produtora
  - [ ] Autorizo o tratamento dos meus dados conforme a LGPD
- Botão "Assinar com GOV.br"

### Requirement: Form validation

**Scenario: Invalid CPF shows inline error**

**When** the user types an invalid CPF and continues
**Then** an inline error message appears: "CPF inválido. Verifique os dígitos."

**Scenario: Required field left empty**

**When** the user tries to advance without filling a required field
**Then** the field is marked with a red border and error message below it

**Scenario: E-mail format validation**

**When** the user types an e-mail without "@"
**Then** an error says "Informe um e-mail válido."

### Requirement: Data persistence

Form data is saved to `sessionStorage` at each step so navigation back preserves inputs.

---

## 2. GOV.br Integration

### Requirement: Authentication via GOV.br OpenID Connect

The GOV.br platform provides OAuth 2.0 / OpenID Connect for citizen authentication. The integration:

1. User clicks "Assinar com GOV.br"
2. Redirect to GOV.br authorization endpoint with `openid`, `email`, `cpf` scopes
3. After login, GOV.br redirects back to `/api/cluster/gov-callback` with an authorization code
4. Backend exchanges code for tokens at GOV.br token endpoint
5. ID token contains user identity claims (name, CPF hashed, e-mail)
6. These claims are used to populate the signer identity on the PDF

**Configuration (env vars):**

```
GOVBR_CLIENT_ID=...
GOVBR_CLIENT_SECRET=...
GOVBR_REDIRECT_URI=https://cpxlabs.com.br/api/cluster/gov-callback
GOVBR_AUTHORIZE_URL=https://sso.acesso.gov.br/authorize
GOVBR_TOKEN_URL=https://sso.acesso.gov.br/token
```

**Scenario: Successful GOV.br login**

**When** the user completes login on GOV.br
**Then** the app receives their verified name + CPF hash + e-mail
**And** the contract PDF includes their verified identity data

**Scenario: GOV.br login fails/cancelled**

**When** the user cancels or the GOV.br flow returns an error
**Then** the user is redirected back to the form with a message: "Não foi possível autenticar com GOV.br. Tente novamente."

### Requirement: "Assinatura Eletrônica" acknowledgment page

After successful GOV.br authentication, show a confirmation screen:
- Full name (from GOV.br)
- CPF (masked: `XXX.XXX.XXX-00`)
- "Ao confirmar, você declara que leu e concorda com os termos do contrato."
- Button: "Confirmar e Assinar"

On confirm:
1. PDF is generated server-side
2. Signer identity is embedded in the PDF metadata
3. A timestamp is recorded
4. PDF is stored temporarily and sent via e-mail

---

## 3. PDF Generation

### Requirement: Professional contract PDF

Generated PDF must contain:

1. **Header**: Cluster Produtora logo/branding + CPX Labs
2. **Contract sections** (matching the terms on `/cluster-produtora`):
   - Dados do Contratante (name, CPF/CNPJ, address)
   - Descrição do Serviço (type, scope, number of tracks if applicable)
   - Valor e Condições de Pagamento
   - Prazo
   - Disposições Gerais (cláusulas do termo técnico)
3. **Signature block**:
   - "Assinado eletronicamente via GOV.br"
   - Signer full name
   - CPF (masked)
   - Date and time of signing
   - Protocol code (UUID)

### Requirement: PDF delivered as attachment

PDF is sent as an e-mail attachment and also available for download on the success page.

---

## 4. E-mail Delivery

### Requirement: Send contract copy via e-mail

**When** the contract is signed
**Then** an e-mail is sent to the client's e-mail address with:
- Subject: "Contrato Cluster Produtora — Código #PROTOCOLO"
- Body: professional e-mail with contract summary and next steps
- Attachment: PDF of the signed contract
- CC: contato@cpxlabs.com.br

**Scenario: E-mail delivery failure**

**When** the e-mail fails to send
**Then** the user is still shown the success page with a download link for the PDF
**And** the backend retries e-mail delivery up to 3 times

### Requirement: E-mail template (≈ 20 lines)

Professional HTML e-mail with:
- Cluster Produtora branding
- Contract number
- "Seu contrato foi assinado com sucesso!"
- Summary table with key info
- Download link + "Em caso de dúvidas, responda a este e-mail."

---

## 5. Success Page (`/cluster-produtora/contrato/assinado`)

Display after signing:
- "Contrato assinado com sucesso!"
- Protocol code
- Signer name
- Date/time
- Button: "Baixar PDF"
- Button: "Voltar ao site"

---

## 6. Navigation

### Requirement: Link to contract generator

**Scenario: Navigate to contract form**

**When** a visitor is on `/cluster-produtora`
**Then** a CTA button is visible: "Solicitar Serviço" linking to `/cluster-produtora/contrato`

---

## Out of scope (v1)

- WhatsApp notification of new contracts
- Dashboard for admin to view signed contracts
- Contract renegotiation / amendment workflow
- Physical (non-GOV.br) signature via typed name checkbox
- File upload (e.g., client sends reference track)

---

## Security notes

- GOV.br tokens are exchanged server-side, never exposed to the client
- PDF generation happens server-side
- Contract data is not stored in a database in v1 — only sent via e-mail
- CPF is validated but only the masked version appears on UI (full CPF may appear on PDF for legal validity)
- All API routes under `/api/cluster/` require `Cluster-Contract` header or GOV.br bearer token
