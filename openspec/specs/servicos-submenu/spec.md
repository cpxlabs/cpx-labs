# Capability: servicos-submenu

Transformar o link "Serviços" no header em um menu dropdown com duas categorias, movendo as rotas da Cluster Produtora para dentro de `/servicos/`.

---

## Estado atual

```
Header: Início | Serviços | Cluster Produtora | Ferramentas | ...

Rotas:
  /servicos                          → Página de serviços de TI
  /cluster-produtora                 → Página institucional Cluster
  /cluster-produtora/contrato        → Wizard de contrato
  /cluster-produtora/contrato/assinado → Sucesso
```

## Estado desejado

```
Header: Início | Serviços ▼ | Ferramentas | ...

  Serviços dropdown:
    ├── Soluções em TI       → /servicos
    └── Produção Musical     → /servicos/producao-musical

Rotas:
  /servicos                          → "Soluções em TI" (inalterada)
  /servicos/producao-musical         → Página institucional (era /cluster-produtora)
  /servicos/producao-musical/contrato        → Wizard de contrato
  /servicos/producao-musical/contrato/assinado → Sucesso
```

---

## 1. Mover rotas da Cluster Produtora

### 1.1 Mover diretório

```
src/app/cluster-produtora/  →  src/app/servicos/producao-musical/
```

### 1.2 Atualizar imports

Todos os `@/lib/cluster/...` continuam funcionando (não mudam de lugar). Nenhum import precisa ser alterado.

### 1.3 Adicionar redirect (opcional)

Um arquivo `src/app/cluster-produtora/page.tsx` que redireciona via `next/navigation` para `/servicos/producao-musical` mantém compatibilidade com links antigos.

---

## 2. Header com submenu dropdown

### 2.1 Estrutura do navLinks

O array `navLinks` no `Header.tsx` vira:

```typescript
const navLinks = [
  { label: "Início", href: "/" },
  {
    label: "Serviços",
    children: [
      { label: "Soluções em TI", href: "/servicos" },
      { label: "Produção Musical", href: "/servicos/producao-musical" },
    ],
  },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];
```

### 2.2 Comportamento do dropdown

- **Desktop**: hover abre o submenu, clique no label "Serviços" não navega (apenas abre/fecha). Os sub-items são links clicáveis que navegam e fecham o submenu.
- **Mobile**: toque expande/colapsa o submenu. Sub-items navegam e fecham o menu mobile.
- Item pai "Serviços" fica destacado se qualquer filho estiver ativo.

### 2.3 Design

- Submenu com fundo `bg-brand-950` e borda `brand-800`, padding, borderRadius `xl`.
- Items com hover `bg-brand-900/60` e transição suave.
- Seta indicadora (▾) ao lado do label "Serviços" que rotaciona quando aberto.

---

## 3. Ações

1. Mover `src/app/cluster-produtora/` → `src/app/servicos/producao-musical/`
2. Criar redirect em `src/app/cluster-produtora/page.tsx`
3. Atualizar `Header.tsx` com submenu dropdown
4. Atualizar Footer.tsx se necessário
5. Atualizar documentação em `docs/` e `AGENTS.md`
6. Verificar build
