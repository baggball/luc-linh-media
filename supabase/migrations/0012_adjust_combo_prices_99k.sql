-- Reprice the pick-any-3 chatbot combo after individual products moved to 99,000 VND.
-- Monthly: 249,000 VND. Yearly: 2,390,000 VND (about 20% below 12 monthly payments).

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

  select count(distinct x) into v_unique_count from unnest(p_product_ids) as x;
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

  v_amount := case when p_billing_cycle = 'yearly' then 2390000 else 249000 end;
  v_title := case
    when p_billing_cycle = 'yearly' then 'Combo tự chọn 3 Chatbot KOC AI - Gói năm'
    else 'Combo tự chọn 3 Chatbot KOC AI - Gói tháng'
  end;
  v_order_code := 'LLM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));

  insert into public.purchases (user_id, product_id, amount, order_code, status, purchase_type, billing_cycle, title)
  values (v_user_id, v_first_product_id, v_amount, v_order_code, 'pending', 'combo', p_billing_cycle, v_title)
  returning id into v_purchase_id;

  insert into public.purchase_items (purchase_id, product_id)
  select v_purchase_id, id from public.products where id = any(p_product_ids)
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

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

  select count(distinct x) into v_unique_count from unnest(p_product_ids) as x;
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
    v_amount := case when p_billing_cycle = 'yearly' then 2390000 else 249000 end;
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
  select v_purchase_id, id from public.products where id = any(p_product_ids)
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

revoke all on function public.create_combo_purchase(uuid[], text) from public, anon;
grant execute on function public.create_combo_purchase(uuid[], text) to authenticated;

revoke all on function public.create_cart_purchase(uuid[], text) from public, anon;
grant execute on function public.create_cart_purchase(uuid[], text) to authenticated;
