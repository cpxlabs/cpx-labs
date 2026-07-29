# GOV.br — Credenciais OAuth2

Integração usada no gerador de contratos da Cluster Produtora para assinatura eletrônica via GOV.br (OpenID Connect).

---

## 1. Pré-requisito

Cadastro no **Portal de Serviços do GOV.br** como desenvolvedor:
https://www.gov.br/governodigital/pt-br/identidade/credencial-de-acesso

---

## 2. Variáveis de Ambiente (.env.local)

```env
# Obrigatórias para produção
GOVBR_CLIENT_ID=seu-client-id-aqui
GOVBR_CLIENT_SECRET=seu-client-secret-aqui

# Opcionais (defaults apontam para produção)
GOVBR_AUTHORIZE_URL=https://sso.acesso.gov.br/authorize
GOVBR_TOKEN_URL=https://sso.acesso.gov.br/token
GOVBR_JWT_SECRET=uma-chave-segura-aleatoria

# Usado no redirect_uri
NEXT_PUBLIC_BASE_URL=https://cpxlabs.com.br
```

---

## 3. Passo a passo

1. Acesse o [Painel do Desenvolvedor GOV.br](https://sso.acesso.gov.br).
2. Crie uma nova aplicação do tipo **Web**.
3. Defina a **URL de Redirecionamento**: `{NEXT_PUBLIC_BASE_URL}/api/cluster/gov-callback`
4. Habilite os **scopes**: `openid`, `email`, `cpf` (obrigatórios).
5. Copie o **Client ID** e **Client Secret** gerados.
6. Adicione as variáveis no `.env.local` do projeto.

---

## 4. Modo Desenvolvimento (Mock)

Se `GOVBR_CLIENT_ID` não estiver definida ou for `"mock-client-id"`, o sistema **não** redireciona para o GOV.br real. Em vez disso:

1. O código de autorização é interpretado como um **JSON base64** contendo os dados do usuário:
   ```
   base64({"sub":"123","name":"Fulano","cpf":"00000000000","email":"fulano@teste.com"})
   ```
2. Use este formato para testar localmente — gere o base64 de um JSON qualquer e cole como `?code=` na URL de callback:
   ```bash
   echo -n '{"sub":"test","name":"Cliente Teste","cpf":"12345678901","email":"teste@email.com"}' | base64
   ```
3. Acesse: `http://localhost:3000/api/cluster/gov-callback?code=<base64-aqui>`

---

## 5. Fluxo

```
Usuário → /api/cluster/gov-login → redirect GOV.br → login/cpf → callback → 
troca code por token → gera JWT próprio → redirect /contrato/assinado?token=...
```

O JWT interno (assinado com `GOVBR_JWT_SECRET`) contém os dados validados do usuário e expira em 1 hora.

---

## 6. Segurança

- `GOVBR_CLIENT_SECRET` **nunca** deve ser commitado.
- Tokens do GOV.br são trocados **server-side** apenas (`/api/cluster/gov-callback`).
- O JWT interno é usado para carregar a identidade do signatário na geração do PDF.
- O CPF trafega apenas no backend — na UI ele aparece mascarado.
