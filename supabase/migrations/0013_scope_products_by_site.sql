-- Keep Lục Linh Video AI and Lục Linh AI Store isolated while sharing one Supabase project.

alter table public.products
  add column if not exists site_key text;

update public.products
set site_key = 'ai-store'
where slug = any(array[
  'chatgpt-plus', 'google-ai-pro', 'canva-pro', 'claude-pro', 'capcut-pro', 'heygen', 'midjourney', 'notion',
  'chatgpt', 'grok-super', 'gemini-pro-storage', 'canva-pro-lifetime', 'freepik-premium', 'openart-essential',
  'meitu-vip', 'wink-vip-plus', 'google-veo-3', 'kling-ai', 'heygen-creator', 'higgsfield-ai', 'picsart-5k',
  'capcut-pro-store', 'vidiq-boost', 'nexlev', 'gmail-old', 'tiktok-us-2024', 'adsense-xmdt', 'minimax-voice',
  'suno-premium', 'elevenlabs-creator', 'cursor-pro', 'claude-pro-store', 'youtube-premium', 'netflix-hd',
  'zoom-pro', 'microsoft-365', 'discord-nitro-trial', 'notion-plus-store', 'microsoft-copilot'
]);

update public.products
set site_key = 'video-ai'
where site_key is null;

alter table public.products
  alter column site_key set default 'video-ai',
  alter column site_key set not null;

create index if not exists products_site_key_published_type_idx
  on public.products (site_key, is_published, type, created_at desc);

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
    and site_key = 'video-ai'
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%';

  select id into v_first_product_id
  from public.products
  where id = any(p_product_ids)
    and site_key = 'video-ai'
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
  select v_purchase_id, id
  from public.products
  where id = any(p_product_ids) and site_key = 'video-ai'
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
    and site_key = 'video-ai'
    and type = 'chatbot'
    and is_published = true
    and is_free = false
    and price > 0
    and slug not ilike '%combo-test%';

  select id into v_first_product_id
  from public.products
  where id = any(p_product_ids)
    and site_key = 'video-ai'
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
  select v_purchase_id, id
  from public.products
  where id = any(p_product_ids) and site_key = 'video-ai'
  on conflict (purchase_id, product_id) do nothing;

  return v_purchase_id;
end;
$$;

revoke all on function public.create_combo_purchase(uuid[], text) from public, anon;
grant execute on function public.create_combo_purchase(uuid[], text) to authenticated;

revoke all on function public.create_cart_purchase(uuid[], text) from public, anon;
grant execute on function public.create_cart_purchase(uuid[], text) to authenticated;
