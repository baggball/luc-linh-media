-- Giai đoạn 2/4: bảng free_prompts + inquiries, kèm RLS + storage bucket.
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → Run.

-- 1. free_prompts
create table if not exists public.free_prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  crumb text not null,
  tag text,
  hashtag text,
  prompt_text text not null,
  images text[] not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.free_prompts enable row level security;

drop policy if exists "free_prompts_public_read" on public.free_prompts;
create policy "free_prompts_public_read"
  on public.free_prompts for select
  using (true);

drop policy if exists "free_prompts_admin_all" on public.free_prompts;
create policy "free_prompts_admin_all"
  on public.free_prompts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true)
on conflict (id) do nothing;

drop policy if exists "prompt_images_public_read" on storage.objects;
create policy "prompt_images_public_read"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

drop policy if exists "prompt_images_admin_write" on storage.objects;
create policy "prompt_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'prompt-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "prompt_images_admin_delete" on storage.objects;
create policy "prompt_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'prompt-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. inquiries (Liên hệ, Yêu cầu Video AI, Custom Chatbot)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'video_request', 'custom_chatbot')),
  name text not null,
  email text not null,
  phone_zalo text,
  payload jsonb not null default '{}',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "inquiries_public_insert" on public.inquiries;
create policy "inquiries_public_insert"
  on public.inquiries for insert
  with check (true);

drop policy if exists "inquiries_admin_read" on public.inquiries;
create policy "inquiries_admin_read"
  on public.inquiries for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
