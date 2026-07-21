-- Giai đoạn 5: bảng purchases cho thanh toán qua SePay (chuyển khoản QR tự động).
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → Run.

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  order_code text not null unique,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  sepay_transaction_id text,
  sepay_reference_code text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists purchases_order_code_idx on public.purchases (order_code);
create index if not exists purchases_user_id_idx on public.purchases (user_id);

alter table public.purchases enable row level security;

drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own"
  on public.purchases for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "purchases_insert_own_pending" on public.purchases;
create policy "purchases_insert_own_pending"
  on public.purchases for insert
  with check (user_id = auth.uid() and status = 'pending');

-- Không có policy update cho người dùng thường — chỉ webhook (dùng Supabase secret key,
-- bỏ qua RLS) mới được đổi trạng thái đơn hàng sang 'paid'.
drop policy if exists "purchases_admin_update" on public.purchases;
create policy "purchases_admin_update"
  on public.purchases for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
