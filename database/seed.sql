-- Império Imports - dados iniciais opcionais
-- Execute depois de database/schema.sql para popular o catálogo.

insert into public.categories (id, name, slug, description, image_url, icon, sort_order, active)
values
  ('10000000-0000-0000-0000-000000000001', 'Eletrônicos', 'eletronicos', 'Tecnologia original para rotina, lazer e produtividade.', '/images/hero-imports.png', 'smartphone', 1, true),
  ('10000000-0000-0000-0000-000000000002', 'Perfumaria', 'perfumaria', 'Fragrâncias importadas com procedência e curadoria.', '/images/hero-imports.png', 'sparkles', 2, true),
  ('10000000-0000-0000-0000-000000000003', 'Acessórios para Celular', 'acessorios-para-celular', 'Carregadores, cabos, capas, suportes e itens premium.', '/images/hero-imports.png', 'cable', 3, true),
  ('10000000-0000-0000-0000-000000000004', 'Farmácia', 'farmacia', 'Produtos de cuidado, bem-estar e uso diário importados.', '/images/hero-imports.png', 'shield-plus', 4, true),
  ('10000000-0000-0000-0000-000000000005', 'Informática', 'informatica', 'Periféricos, componentes e acessórios para setup.', '/images/hero-imports.png', 'laptop', 5, true),
  ('10000000-0000-0000-0000-000000000006', 'Utilidades Domésticas', 'utilidades-domesticas', 'Soluções práticas e elegantes para casa.', '/images/hero-imports.png', 'package', 6, true),
  ('10000000-0000-0000-0000-000000000007', 'Produtos Importados', 'produtos-importados', 'Novidades originais dos EUA e Paraguai.', '/images/hero-imports.png', 'globe-2', 7, true),
  ('10000000-0000-0000-0000-000000000008', 'Diversos', 'diversos', 'Itens selecionados para oportunidades e encomendas.', '/images/hero-imports.png', 'layers-3', 8, true)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    image_url = excluded.image_url,
    icon = excluded.icon,
    sort_order = excluded.sort_order,
    active = excluded.active;

insert into public.products (
  id,
  category_id,
  name,
  slug,
  description,
  full_description,
  price,
  status,
  code,
  featured,
  active,
  sort_order,
  metadata
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Fone Bluetooth Premium',
    'fone-bluetooth-premium',
    'Audio limpo, bateria de longa duração e acabamento sofisticado.',
    'Fone sem fio importado com estojo compacto, conexão estável e construção pensada para uso diário. Ideal para clientes que buscam procedência e experiência premium.',
    389.90,
    'in_stock',
    'IMP-AUD-001',
    true,
    true,
    1,
    '{"origin": "Paraguai"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Perfume Importado Signature',
    'perfume-importado-signature',
    'Fragrância marcante com embalagem elegante e original.',
    'Produto de perfumaria importada para quem busca presença, fixação e procedência. Disponível em estoque limitado e também sob consulta para reposição.',
    529.90,
    'in_stock',
    'IMP-PER-014',
    true,
    true,
    2,
    '{"origin": "EUA"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'Carregador USB-C Turbo',
    'carregador-usb-c-turbo',
    'Carregamento rápido para rotina intensa e dispositivos modernos.',
    'Acessório importado com foco em segurança, eficiência e compatibilidade. Produto recomendado para smartphones, tablets e dispositivos USB-C.',
    129.90,
    'pre_order',
    'IMP-CEL-022',
    false,
    true,
    3,
    '{"origin": "Paraguai"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000004',
    'Kit Bem-Estar Importado',
    'kit-bem-estar-importado',
    'Produtos selecionados para cuidado diário e conveniência.',
    'Curadoria de itens importados de farmácia, com foco em procedência e disponibilidade sob encomenda para reposições específicas.',
    219.90,
    'pre_order',
    'IMP-FAR-008',
    false,
    true,
    4,
    '{"origin": "EUA"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000005',
    'Mouse Wireless Pro',
    'mouse-wireless-pro',
    'Precisão, ergonomia e visual discreto para setups modernos.',
    'Mouse importado para trabalho e produtividade, com resposta rápida, pegada confortável e design minimalista.',
    259.90,
    'in_stock',
    'IMP-INF-031',
    true,
    true,
    5,
    '{"origin": "Paraguai"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000006',
    'Luminária Smart Portátil',
    'luminaria-smart-portatil',
    'Design elegante para casa, trabalho e viagem.',
    'Luminária compacta com acabamento premium, ideal para ambientes organizados e funcionais. Disponível em lotes limitados.',
    189.90,
    'in_stock',
    'IMP-UTI-010',
    false,
    true,
    6,
    '{"origin": "Paraguai"}'::jsonb
  )
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    description = excluded.description,
    full_description = excluded.full_description,
    price = excluded.price,
    status = excluded.status,
    code = excluded.code,
    featured = excluded.featured,
    active = excluded.active,
    sort_order = excluded.sort_order,
    metadata = excluded.metadata;

insert into public.product_images (product_id, url, alt_text, sort_order, is_primary)
select id, '/images/hero-imports.png', name, 1, true
from public.products
where slug in (
  'fone-bluetooth-premium',
  'perfume-importado-signature',
  'carregador-usb-c-turbo',
  'kit-bem-estar-importado',
  'mouse-wireless-pro',
  'luminaria-smart-portatil'
)
and not exists (
  select 1
  from public.product_images
  where product_images.product_id = products.id
);

-- Para criar o primeiro administrador:
-- 1. Crie um usuário em Supabase > Authentication > Users.
-- 2. Copie o UUID do usuário.
-- 3. Execute:
-- insert into public.admin_users (id, email, full_name, role)
-- values ('UUID_DO_AUTH_USER', 'admin@exemplo.com', 'Administrador', 'owner');
