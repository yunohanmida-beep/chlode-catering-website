-- Chlode Event Catering Services website
-- Run in Supabase SQL Editor. Then create an Auth user and add its UID to admin_users below.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id integer primary key check (id = 1),
  tagline text not null default 'Chlode Event Catering Services is more than willing to cater to your preferences. So as we tag you on our timeline to HAVE IT YOUR WAY!',
  phone text not null default '09989213529',
  email text not null default 'chloedeventcateringservices@gmail.com',
  facebook_url text not null default 'https://www.facebook.com/SheenaMNA#',
  address text not null default '',
  maps_url text not null default 'https://www.google.com/maps/search/?api=1&query=Chlode+Event+Catering+Services',
  google_reviews_url text not null default 'https://www.google.com/maps',
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  source text not null default 'Customer feedback',
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

insert into public.business_settings (id) values (1) on conflict (id) do nothing;

alter table public.admin_users enable row level security;
alter table public.business_settings enable row level security;
alter table public.customer_reviews enable row level security;

-- Public may see published business details and published reviews.
drop policy if exists "Public can read business settings" on public.business_settings;
create policy "Public can read business settings" on public.business_settings
for select to anon, authenticated using (true);

drop policy if exists "Admins can update business settings" on public.business_settings;
create policy "Admins can update business settings" on public.business_settings
for all to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Public can read published reviews" on public.customer_reviews;
create policy "Public can read published reviews" on public.customer_reviews
for select to anon, authenticated using (
  is_published = true or exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Admins can manage reviews" on public.customer_reviews;
create policy "Admins can manage reviews" on public.customer_reviews
for all to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Admins can read their admin record" on public.admin_users;
create policy "Admins can read their admin record" on public.admin_users
for select to authenticated using (user_id = auth.uid());

grant select on public.business_settings to anon, authenticated;
grant insert, update, delete on public.business_settings to authenticated;
grant select on public.customer_reviews to anon, authenticated;
grant insert, update, delete on public.customer_reviews to authenticated;
grant select on public.admin_users to authenticated;

-- IMPORTANT: After creating your admin account in Supabase Authentication,
-- copy its user UID, then run this separately (replace the UUID):
-- insert into public.admin_users (user_id) values ('PASTE-AUTH-USER-UID-HERE');
