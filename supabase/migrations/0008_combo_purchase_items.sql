-- Combo tự chọn: một đơn hàng có thể mở khóa nhiều sản phẩm con.
-- Chạy file này trong Supabase Dashboard -> SQL Editor -> Run trước khi dùng tính năng combo.

alter table public.purchases
  add column if not exists purchase_type text not null default 'single'
    check (purchase_type in ('single', 'cart', 'combo')),
  add column if not exists billing_cycle text
    check (billing_cycle in ('monthly', 'yearly')),
  add column if not exists title text;

do $$
declare
  v_constraint_name text;
begin
  select conname into v_constraint_name
  from pg_constraint
  where conrelid = 'public.purchases'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%purchase_type%'
  limit 1;

  if v_constraint_name is not null then
    execute format('alter table public.purchases drop constraint %I', v_constraint_name);
  end if;

  alter table public.purchases
    add constraint purchases_purchase_type_check
    check (purchase_type in ('single', 'cart', 'combo'));
end $$;

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (purchase_id, product_id)
);

create index if not exists purchase_items_purchase_id_idx on public.purchase_items (purchase_id);
create index if not exists purchase_items_product_id_idx on public.purchase_items (product_id);

alter table public.purchase_items enable row level security;

drop policy if exists "purchase_items_select_own" on public.purchase_items;
create policy "purchase_items_select_own"
  on public.purchase_items for select
  using (
    exists (
      select 1 from public.purchases pu
      where pu.id = purchase_id
        and (
          pu.user_id = auth.uid()
          or exists (select 1 from public.profiles pr where pr.id = auth.uid() and pr.role = 'admin')
        )
    )
  );

drop policy if exists "purchase_items_admin_all" on public.purchase_items;
create policy "purchase_items_admin_all"
  on public.purchase_items for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Backfill quyền mua lẻ cũ vào purchase_items để code mới đọc thống nhất.
insert into public.purchase_items (purchase_id, product_id)
select id, product_id
from public.purchases
where purchase_type = 'single'
on conflict (purchase_id, product_id) do nothing;

create or replace function public.create_purchase(p_product_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_price integer;
  v_title text;
  v_purchase_id uuid;
  v_order_code text;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select price, title into v_price, v_title
  from public.products
  where id = p_product_id
    and is_published = true
    and is_free = false
    and price > 0;

  if v_price is null then
    raise exception 'product is unavailable for purchase';
  end if;

  v_order_code := 'LLM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));

  insert into public.purchases (user_id, product_id, amount, order_code, status, purchase_type, title)
  values (v_user_id, p_product_id, v_price, v_order_code, 'pending', 'single', v_title)
  returning id into v_purchase_id;

  insert into public.purchase_items (purchase_id, product_id)
  values (v_purchase_id, p_product_id)
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

create or replace function public.create_combo_purchase(
  p_product_ids uuid[],
  p_billing_cycle text default 'monthly'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_unique_count integer;
  v_valid_count integer;
  v_first_product_id uuid;
  v_purchase_id uuid;
  v_order_code text;
  v_amount integer;
  v_title text;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if p_billing_cycle not in ('monthly', 'yearly') then
    raise exception 'invalid billing cycle';
  end if;

  select count(distinct x) into v_unique_count
  from unnest(p_product_ids) as x;

  if v_unique_count <> 3 then
    raise exception 'combo requires exactly 3 different chatbot products';
  end if;

  select count(*) into v_valid_count
  from public.products
  where id = any(p_product_ids)
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%';

  select id into v_first_product_id
  from public.products
  where id = any(p_product_ids)
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%'
  limit 1;

  if v_valid_count <> 3 or v_first_product_id is null then
    raise exception 'one or more chatbot products are unavailable for combo';
  end if;

  v_amount := case when p_billing_cycle = 'yearly' then 3830000 else 399000 end;
  v_title := case
    when p_billing_cycle = 'yearly' then 'Combo tự chọn 3 Chatbot KOC AI - Gói năm'
    else 'Combo tự chọn 3 Chatbot KOC AI - Gói tháng'
  end;
  v_order_code := 'LLM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));

  insert into public.purchases (user_id, product_id, amount, order_code, status, purchase_type, billing_cycle, title)
  values (v_user_id, v_first_product_id, v_amount, v_order_code, 'pending', 'combo', p_billing_cycle, v_title)
  returning id into v_purchase_id;

  insert into public.purchase_items (purchase_id, product_id)
  select v_purchase_id, id
  from public.products
  where id = any(p_product_ids)
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

revoke all on function public.create_purchase(uuid) from public, anon;
grant execute on function public.create_purchase(uuid) to authenticated;

revoke all on function public.create_combo_purchase(uuid[], text) from public, anon;
grant execute on function public.create_combo_purchase(uuid[], text) to authenticated;

create or replace function public.create_cart_purchase(
  p_product_ids uuid[],
  p_billing_cycle text default 'monthly'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_unique_count integer;
  v_valid_count integer;
  v_first_product_id uuid;
  v_purchase_id uuid;
  v_order_code text;
  v_amount integer;
  v_title text;
  v_purchase_type text;
  v_billing_cycle text;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if p_billing_cycle not in ('monthly', 'yearly') then
    raise exception 'invalid billing cycle';
  end if;

  select count(distinct x) into v_unique_count
  from unnest(p_product_ids) as x;

  if v_unique_count < 1 or v_unique_count > 3 then
    raise exception 'cart supports 1 to 3 different chatbot products';
  end if;

  select count(*), coalesce(sum(price), 0) into v_valid_count, v_amount
  from public.products
  where id = any(p_product_ids)
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%';

  select id into v_first_product_id
  from public.products
  where id = any(p_product_ids)
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%'
  limit 1;

  if v_valid_count <> v_unique_count or v_first_product_id is null then
    raise exception 'one or more chatbot products are unavailable for cart checkout';
  end if;

  if v_unique_count = 3 then
    v_amount := case when p_billing_cycle = 'yearly' then 3830000 else 399000 end;
    v_purchase_type := 'combo';
    v_billing_cycle := p_billing_cycle;
    v_title := case
      when p_billing_cycle = 'yearly' then 'Combo tự chọn 3 Chatbot KOC AI - Gói năm'
      else 'Combo tự chọn 3 Chatbot KOC AI - Gói tháng'
    end;
  else
    v_purchase_type := 'cart';
    v_title := 'Giỏ hàng Chatbot AI (' || v_unique_count || ' sản phẩm)';
    v_billing_cycle := null;
  end if;

  v_order_code := 'LLM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));

  insert into public.purchases (user_id, product_id, amount, order_code, status, purchase_type, billing_cycle, title)
  values (v_user_id, v_first_product_id, v_amount, v_order_code, 'pending', v_purchase_type, v_billing_cycle, v_title)
  returning id into v_purchase_id;

  insert into public.purchase_items (purchase_id, product_id)
  select v_purchase_id, id
  from public.products
  where id = any(p_product_ids)
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

revoke all on function public.create_cart_purchase(uuid[], text) from public, anon;
grant execute on function public.create_cart_purchase(uuid[], text) to authenticated;

drop policy if exists "product_private_content_entitled_read" on public.product_private_content;
create policy "product_private_content_entitled_read"
  on public.product_private_content for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_free = true and p.is_published = true
    )
    or exists (
      select 1 from public.purchases pu
      where pu.product_id = product_id
        and pu.user_id = auth.uid()
        and pu.status = 'paid'
    )
    or exists (
      select 1
      from public.purchase_items pi
      join public.purchases pu on pu.id = pi.purchase_id
      where pi.product_id = product_id
        and pu.user_id = auth.uid()
        and pu.status = 'paid'
    )
    or exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role = 'admin'
    )
  );
