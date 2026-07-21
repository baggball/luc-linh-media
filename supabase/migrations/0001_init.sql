-- Giai đoạn 1: bảng profiles + products, kèm RLS.
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → Run.

-- 1. profiles: mở rộng auth.users với role (customer/admin)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: tự tạo profile (role='customer') khi có user đăng ký mới
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('chatbot', 'workflow', 'app', 'veo3')),
  slug text unique not null,
  title text not null,
  description text,
  is_free boolean not null default false,
  price integer not null default 0,
  workflow_link text,
  warranty text default '15 ngày',
  rating numeric(2,1) default 5.0,
  sold_count integer not null default 0,
  images text[] not null default '{}',
  video_url text,
  faq jsonb not null default '[]',
  is_published boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (is_published = true);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
  on public.products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. Storage bucket cho ảnh sản phẩm (đọc công khai, ghi chỉ admin)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
