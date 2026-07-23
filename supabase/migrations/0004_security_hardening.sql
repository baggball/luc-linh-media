-- Expand phase (safe to run before deploying the matching application code):
-- prevent role escalation, add server-authoritative checkout, and copy paid
-- delivery links into a protected table. The old columns/policies remain usable
-- until 0005 is run after the new deployment is verified.

-- A customer may edit only their display name, never their role.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

create table if not exists public.product_private_content (
  product_id uuid primary key references public.products(id) on delete cascade,
  workflow_link text,
  video_url text,
  updated_at timestamptz not null default now()
);

alter table public.product_private_content enable row level security;

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
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role = 'admin'
    )
  );

drop policy if exists "product_private_content_admin_all" on public.product_private_content;
create policy "product_private_content_admin_all"
  on public.product_private_content for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Preserve existing delivery data. Public columns are cleared only in 0005,
-- after the application has switched to product_private_content.
insert into public.product_private_content (product_id, workflow_link, video_url)
select id, workflow_link, video_url from public.products
where workflow_link is not null or video_url is not null
on conflict (product_id) do update
set workflow_link = excluded.workflow_link,
    video_url = excluded.video_url,
    updated_at = now();

create or replace function public.create_purchase(p_product_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_price integer;
  v_purchase_id uuid;
  v_order_code text;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select price into v_price
  from public.products
  where id = p_product_id
    and is_published = true
    and is_free = false
    and price > 0;

  if v_price is null then
    raise exception 'product is unavailable for purchase';
  end if;

  v_order_code := 'LLM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));

  insert into public.purchases (user_id, product_id, amount, order_code, status)
  values (v_user_id, p_product_id, v_price, v_order_code, 'pending')
  returning id into v_purchase_id;

  return v_purchase_id;
end;
$$;

revoke all on function public.create_purchase(uuid) from public, anon;
grant execute on function public.create_purchase(uuid) to authenticated;

create unique index if not exists purchases_sepay_transaction_id_uidx
  on public.purchases (sepay_transaction_id)
  where sepay_transaction_id is not null;
