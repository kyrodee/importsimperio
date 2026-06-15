# Império Imports

Site profissional em Next.js 15 para catálogo premium de produtos importados originais dos EUA e Paraguai, com painel administrativo protegido, Supabase/PostgreSQL, SEO e dados iniciais.

## Stack

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, PostgreSQL, Storage e RLS

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com).
2. Crie uma conta ou entre na sua conta.
3. Clique em `New project`.
4. Escolha a organização, nome do projeto, senha do banco e região.
5. Aguarde o Supabase finalizar a criação.

## 2. Obter as chaves de acesso

No painel do Supabase:

1. Vá em `Project Settings`.
2. Abra `API`.
3. Copie:
   - `Project URL`
   - `anon public`
   - `service_role` apenas se futuramente criar rotinas server-side com privilégios elevados

## 3. Configurar o `.env`

Crie um arquivo `.env.local` na raiz do projeto usando `.env.example` como base:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

Para produção, ajuste `NEXT_PUBLIC_SITE_URL` para o domínio real.

## 4. Executar o banco

1. Abra `database/schema.sql`.
2. Copie todo o conteúdo.
3. No Supabase, acesse `SQL Editor`.
4. Cole e execute o SQL.
5. Opcional: execute `database/seed.sql` para criar categorias e produtos fictícios.

Depois, crie o primeiro administrador:

1. Acesse `Authentication > Users`.
2. Crie um usuário com e-mail e senha.
3. Copie o UUID do usuário.
4. Execute no SQL Editor:

```sql
insert into public.admin_users (id, email, full_name, role)
values ('UUID_DO_AUTH_USER', 'admin@exemplo.com', 'Administrador', 'owner');
```

## 5. Rodar localmente

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm run dev
```

Acesse:

- Site: `http://localhost:3000`
- Catálogo: `http://localhost:3000/catalogo`
- Admin: `http://localhost:3000/admin`

## 6. Publicar na Vercel

1. Suba o repositório para o GitHub.
2. Acesse [vercel.com](https://vercel.com).
3. Clique em `Add New Project`.
4. Importe o repositório.
5. Em `Environment Variables`, cadastre as variáveis do `.env.local`.
6. Faça o deploy.
7. No Supabase, confira se o domínio de produção está permitido em `Authentication > URL Configuration`.

## Estrutura importante

- `src/app/(site)`: páginas públicas do site e catálogo.
- `src/app/admin`: login, painel e server actions administrativas.
- `src/components`: componentes reutilizáveis de UI, catálogo e admin.
- `src/lib`: Supabase, dados, tipos, helpers e lógica compartilhada.
- `database/schema.sql`: modelagem completa para Supabase.
- `database/seed.sql`: dados fictícios iniciais.

## Observações de produção

- O banco usa Row Level Security em todas as tabelas.
- O painel só libera acesso a usuários autenticados e ativos em `admin_users`.
- Imagens enviadas pelo admin vão para o bucket público `product-images`.
- A vitrine pública usa Server Components, metadata, Open Graph, sitemap, robots e Schema.org.
