# Banco de dados Supabase

Esta pasta contém a estrutura pronta para PostgreSQL no Supabase.

## Arquivos

- `schema.sql`: cria tipos, tabelas, relacionamentos, constraints, índices, triggers, RLS, policies e bucket `product-images`.
- `seed.sql`: popula categorias e produtos fictícios para demonstração.

## Ordem de execução

1. Abra o projeto no Supabase.
2. Acesse `SQL Editor`.
3. Cole e execute todo o conteúdo de `database/schema.sql`.
4. Opcionalmente, cole e execute `database/seed.sql`.
5. Crie um usuário em `Authentication > Users`.
6. Copie o UUID do usuário criado.
7. Execute o insert abaixo trocando os valores:

```sql
insert into public.admin_users (id, email, full_name, role)
values ('UUID_DO_AUTH_USER', 'admin@exemplo.com', 'Administrador', 'owner');
```

Após isso, o usuário conseguirá acessar `/admin`.
