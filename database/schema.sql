-- Império Imports - Supabase/PostgreSQL production schema
-- Execute este arquivo no SQL Editor do Supabase para criar toda a estrutura.

create extension if not exists pgcrypto;

do $$
begin
  create type public.product_status as enum ('in_stock', 'pre_order');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.admin_role as enum ('owner', 'manager');
exception
  when duplicate_object then null;
end $$;

-- Atualiza automaticamente a coluna updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Usuários administradores autorizados a acessar o painel.
-- O id deve ser o mesmo UUID do usuário criado em Authentication > Users.
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.admin_role not null default 'manager',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_users is 'Administradores autorizados a gerenciar catálogo, produtos e configurações do site.';
comment on column public.admin_users.id is 'Mesmo id do usuário no Supabase Auth.';

-- Categorias dinâmicas exibidas no catálogo.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text not null default 'package',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

comment on table public.categories is 'Categorias ilimitadas criadas no painel administrativo.';
comment on column public.categories.slug is 'URL amigável usada em /categorias/[slug].';

-- Produtos do catálogo.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  full_description text,
  price numeric(12, 2),
  currency char(3) not null default 'BRL',
  status public.product_status not null default 'in_stock',
  code text unique,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_price_positive check (price is null or price >= 0),
  constraint products_currency_uppercase check (currency = upper(currency))
);

comment on table public.products is 'Produtos importados exibidos no catálogo público e gerenciados no painel.';
comment on column public.products.status is 'Disponibilidade comercial: em estoque ou sob encomenda.';
comment on column public.products.featured is 'Define se o produto aparece em áreas de destaque.';

-- Imagens relacionadas a cada produto.
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint product_images_url_not_blank check (length(trim(url)) > 0)
);

comment on table public.product_images is 'Galeria de imagens dos produtos. Pode apontar para Supabase Storage ou URL externa.';
comment on column public.product_images.is_primary is 'Imagem principal usada em cards e Open Graph.';

-- Configurações institucionais do site.
-- Usa chave booleana para manter apenas um registro principal.
create table if not exists public.site_settings (
  id boolean primary key default true,
  company_name text not null default 'Império Imports',
  whatsapp text not null default '(44) 98823-2561',
  email text not null default 'imperioimportspy@outlook.com',
  instagram text not null default '@importsim.perio',
  institutional_text text not null default '',
  hero_title text not null default 'Produtos importados originais dos EUA e Paraguai.',
  hero_subtitle text not null default '',
  featured_headline text not null default '',
  banners jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = true)
);

comment on table public.site_settings is 'Configurações globais editáveis pelo painel: contatos, texto institucional, banners e destaques.';

create index if not exists categories_active_sort_idx on public.categories (active, sort_order, name);
create index if not exists products_active_featured_idx on public.products (active, featured, sort_order);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists product_images_product_sort_idx on public.product_images (product_id, sort_order);

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- Verifica se o usuário logado é administrador ativo.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and active = true
  );
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
using (public.is_admin() or id = auth.uid());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
using (active = true or public.is_admin());

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (active = true or public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
on public.product_images
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.active = true
  )
);

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
on public.product_images
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());

-- Bucket público para imagens de produtos no Supabase Storage.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product image files" on storage.objects;
create policy "Public can read product image files"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product image files" on storage.objects;
create policy "Admins can upload product image files"
on storage.objects
for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product image files" on storage.objects;
create policy "Admins can update product image files"
on storage.objects
for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product image files" on storage.objects;
create policy "Admins can delete product image files"
on storage.objects
for delete
using (bucket_id = 'product-images' and public.is_admin());

insert into public.site_settings (
  id,
  company_name,
  whatsapp,
  email,
  instagram,
  institutional_text,
  hero_title,
  hero_subtitle,
  featured_headline,
  highlights
)
values (
  true,
  'Império Imports',
  '(44) 98823-2561',
  'imperioimportspy@outlook.com',
  '@importsim.perio',
  'A Império Imports conecta clientes a produtos importados originais dos Estados Unidos e Paraguai, com curadoria, transparência e atendimento próximo. Trabalhamos com itens em estoque e sob encomenda, sempre priorizando procedência, qualidade e uma experiência de compra segura.',
  'Produtos importados originais dos EUA e Paraguai.',
  'Catálogo premium com eletrônicos, perfumaria, acessórios, informática, farmácia e utilidades domésticas em estoque ou sob encomenda.',
  'Curadoria premium para comprar com confiança.',
  '[
    {"label": "Produtos 100% Originais"},
    {"label": "Importação dos EUA e Paraguai"},
    {"label": "Produtos em Estoque"},
    {"label": "Produtos Sob Encomenda"},
    {"label": "Atendimento Rápido"},
    {"label": "Catálogo Atualizado"},
    {"label": "Variedade de Produtos"},
    {"label": "Garantia de Procedência"}
  ]'::jsonb
)
on conflict (id) do nothing;

-- --------------------------------------------------------
-- CUSTOMER FEATURES (Cart & Favorites)
-- --------------------------------------------------------

-- Tabela de itens do carrinho do usuário.
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_items_quantity_positive check (quantity > 0),
  unique(user_id, product_id)
);

comment on table public.cart_items is 'Itens salvos no carrinho do cliente.';

-- Tabela de produtos favoritos do usuário.
create table if not exists public.favorite_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

comment on table public.favorite_products is 'Produtos favoritados (wishlist) pelo cliente.';

-- Triggers para updated_at no carrinho
drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

-- Políticas de segurança (RLS) para clientes

alter table public.cart_items enable row level security;
alter table public.favorite_products enable row level security;

-- O cliente logado só pode ver, inserir, atualizar e deletar seus próprios itens do carrinho
drop policy if exists "Users can manage their own cart" on public.cart_items;
create policy "Users can manage their own cart"
on public.cart_items
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- O cliente logado só pode ver, inserir e deletar seus próprios favoritos
drop policy if exists "Users can manage their own favorites" on public.favorite_products;
create policy "Users can manage their own favorites"
on public.favorite_products
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
