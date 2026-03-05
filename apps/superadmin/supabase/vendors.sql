begin;

create extension if not exists pgcrypto;

drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.stores cascade;
drop table if exists public.profiles cascade;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null check (role in ('superadmin', 'vendor', 'customer')),
  owner_role text check (owner_role in ('vendor_owner', 'shop_owner')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  banner_url text,
  address text,
  city text,
  state text,
  district text,
  pincode text,
  theme_id text,
  primary_color text,
  status text not null default 'draft' check (status in ('draft', 'active', 'suspended')),
  is_published boolean not null default false,
  total_products int not null default 0,
  total_orders int not null default 0,
  total_revenue numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  price numeric not null default 0,
  compare_price numeric,
  stock int not null default 0,
  sku text,
  images text[] not null default '{}',
  category text,
  status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
  total_sold int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  vendor_id uuid not null references public.profiles(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  commission numeric not null default 0,
  commission_rate numeric not null default 0.10,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending' check (order_status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  product_name text not null,
  product_image text,
  quantity int not null default 1,
  price numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

drop trigger if exists stores_set_updated_at on public.stores;
create trigger stores_set_updated_at
before update on public.stores
for each row
execute procedure public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute procedure public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute procedure public.set_updated_at();

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_stores_vendor_id on public.stores(vendor_id);
create index if not exists idx_stores_slug on public.stores(slug);
create index if not exists idx_products_store_id on public.products(store_id);
create index if not exists idx_products_vendor_id on public.products(vendor_id);
create index if not exists idx_orders_store_id on public.orders(store_id);
create index if not exists idx_orders_vendor_id on public.orders(vendor_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "stores_read_public" on public.stores;
create policy "stores_read_public"
on public.stores
for select
using (true);

drop policy if exists "products_read_public" on public.products;
create policy "products_read_public"
on public.products
for select
using (true);

drop policy if exists "orders_read_owner" on public.orders;
create policy "orders_read_owner"
on public.orders
for select
using (auth.uid() = vendor_id);

drop policy if exists "order_items_read_owner" on public.order_items;
create policy "order_items_read_owner"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.vendor_id = auth.uid()
  )
);

-- Optional superadmin seed (safe + idempotent).
-- SETUP REQUIRED:
-- 1) Replace <REPLACE_WITH_SUPERADMIN_EMAIL> below with your actual superadmin email.
-- 2) Use the same value as SUPERADMIN_EMAIL in your app environment.
-- 3) Make sure that email already exists in auth.users.
insert into public.profiles (id, email, full_name, role, is_active)
select
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data ->> 'full_name', 'Super Admin'),
  'superadmin',
  true
from auth.users u
where lower(u.email) = lower('<REPLACE_WITH_SUPERADMIN_EMAIL>')
on conflict (id)
do update set
  email = excluded.email,
  role = 'superadmin',
  is_active = true,
  updated_at = now();

commit;
