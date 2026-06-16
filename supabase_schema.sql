-- Living Law - Supabase Database Schema Script
-- Copy and run this script in the Supabase SQL Editor to prepare your PostgreSQL database tables and RLS policies.

-- 1. Create Profiles Table (Syncs with Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'professional', 'neutral', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profiles" on public.profiles
  for update using (auth.uid() = id);


-- 2. Create Cases Table
create table public.cases (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete set null,
  neutral_id uuid references public.profiles(id) on delete set null,
  title text not null,
  status text not null default 'pending',
  claim_amount numeric(12, 2) not null default 0.00,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Cases
alter table public.cases enable row level security;

-- Cases Policies
create policy "Users can view cases they are involved in" on public.cases
  for select using (
    auth.uid() = client_id or 
    auth.uid() = neutral_id or 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Authenticated users can create cases" on public.cases
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own cases" on public.cases
  for update using (
    auth.uid() = client_id or 
    auth.uid() = neutral_id or
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 3. Create Transactions Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  amount numeric(12, 2) not null,
  status text not null default 'success',
  razorpay_order_id text,
  razorpay_payment_id text,
  service_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Transactions
alter table public.transactions enable row level security;

-- Transactions Policies
create policy "Users can view their own transactions" on public.transactions
  for select using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Authenticated users/webhooks can insert transactions" on public.transactions
  for insert with check (auth.role() = 'authenticated');


-- 4. Create Automatically Triggered User Profile Creation function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'client'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
