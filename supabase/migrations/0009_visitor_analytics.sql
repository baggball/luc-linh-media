-- Thống kê khách truy cập và phễu bán hàng.
-- Dữ liệu chỉ được ghi qua API server bằng service role; không mở quyền ghi trực tiếp cho trình duyệt.

create table if not exists public.analytics_sessions (
  id uuid primary key,
  visitor_id uuid not null,
  user_id uuid references public.profiles(id) on delete set null,
  first_path text not null default '/',
  last_path text not null default '/',
  referrer_domain text,
  source text not null default 'direct',
  medium text,
  campaign text,
  device_type text not null default 'desktop' check (device_type in ('desktop', 'mobile', 'tablet', 'other')),
  page_views integer not null default 0,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.analytics_sessions(id) on delete cascade,
  visitor_id uuid not null,
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null check (
    event_name in ('page_view', 'view_product', 'add_to_cart', 'begin_checkout', 'purchase_completed', 'sign_up')
  ),
  path text not null default '/',
  product_slug text,
  value integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_sessions_visitor_id_idx on public.analytics_sessions (visitor_id);
create index if not exists analytics_sessions_user_id_idx on public.analytics_sessions (user_id);
create index if not exists analytics_sessions_started_at_idx on public.analytics_sessions (started_at desc);
create index if not exists analytics_sessions_last_seen_at_idx on public.analytics_sessions (last_seen_at desc);
create index if not exists analytics_sessions_source_idx on public.analytics_sessions (source);
create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_visitor_id_idx on public.analytics_events (visitor_id);
create index if not exists analytics_events_user_id_idx on public.analytics_events (user_id);
create index if not exists analytics_events_path_idx on public.analytics_events (path);

alter table public.analytics_sessions enable row level security;
alter table public.analytics_events enable row level security;

-- Không tạo policy public: anon/authenticated không thể đọc hoặc tự chèn dữ liệu.

create or replace function public.record_analytics_event(
  p_session_id uuid,
  p_visitor_id uuid,
  p_user_id uuid,
  p_event_name text,
  p_path text,
  p_referrer_domain text,
  p_source text,
  p_medium text,
  p_campaign text,
  p_device_type text,
  p_product_slug text,
  p_value integer,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_name not in ('page_view', 'view_product', 'add_to_cart', 'begin_checkout', 'purchase_completed', 'sign_up') then
    raise exception 'Unsupported analytics event';
  end if;

  insert into public.analytics_sessions (
    id,
    visitor_id,
    user_id,
    first_path,
    last_path,
    referrer_domain,
    source,
    medium,
    campaign,
    device_type,
    page_views,
    started_at,
    last_seen_at
  )
  values (
    p_session_id,
    p_visitor_id,
    p_user_id,
    p_path,
    p_path,
    nullif(p_referrer_domain, ''),
    coalesce(nullif(p_source, ''), 'direct'),
    nullif(p_medium, ''),
    nullif(p_campaign, ''),
    coalesce(nullif(p_device_type, ''), 'other'),
    case when p_event_name = 'page_view' then 1 else 0 end,
    now(),
    now()
  )
  on conflict (id) do update set
    user_id = coalesce(excluded.user_id, analytics_sessions.user_id),
    last_path = excluded.last_path,
    last_seen_at = now(),
    page_views = analytics_sessions.page_views + case when p_event_name = 'page_view' then 1 else 0 end,
    referrer_domain = coalesce(analytics_sessions.referrer_domain, excluded.referrer_domain),
    source = case when analytics_sessions.source = 'direct' then excluded.source else analytics_sessions.source end,
    medium = coalesce(analytics_sessions.medium, excluded.medium),
    campaign = coalesce(analytics_sessions.campaign, excluded.campaign);

  insert into public.analytics_events (
    session_id,
    visitor_id,
    user_id,
    event_name,
    path,
    product_slug,
    value,
    metadata
  )
  values (
    p_session_id,
    p_visitor_id,
    p_user_id,
    p_event_name,
    p_path,
    nullif(p_product_slug, ''),
    p_value,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.record_analytics_event(uuid, uuid, uuid, text, text, text, text, text, text, text, text, integer, jsonb) from public;
revoke all on function public.record_analytics_event(uuid, uuid, uuid, text, text, text, text, text, text, text, text, integer, jsonb) from anon;
revoke all on function public.record_analytics_event(uuid, uuid, uuid, text, text, text, text, text, text, text, text, integer, jsonb) from authenticated;
grant execute on function public.record_analytics_event(uuid, uuid, uuid, text, text, text, text, text, text, text, text, integer, jsonb) to service_role;
