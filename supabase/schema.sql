-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable RLS (Row Level Security)
alter database postgres set "auth.enabled" = true;

-- Create tables
-- Users Profile (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  first_name text,
  last_name text,
  phone text,
  company_name text,
  siret text,
  account_type text default 'individual',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Properties
create table properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  address text not null,
  type text not null, -- 'apartment', 'house', 'commercial', 'garage'
  price numeric not null,
  rent_amount numeric,
  surface numeric not null,
  rooms integer,
  status text not null, -- 'available', 'rented', 'maintenance'
  description text,
  charges jsonb default '{}'::jsonb, -- Stores deductible and non-deductible charges
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tenants
create table tenants (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  lease_start date not null,
  lease_end date not null,
  rent_amount numeric not null,
  deposit numeric not null,
  payment_method text not null,
  guarantor jsonb default '{}'::jsonb,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties not null,
  type text not null, -- 'income', 'expense'
  category text not null, -- 'rent', 'charges', 'maintenance', 'tax', 'insurance'
  amount numeric not null,
  date date not null,
  description text,
  accounting_month date not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents
create table documents (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties,
  tenant_id uuid references tenants,
  name text not null,
  type text not null, -- 'contract', 'invoice', 'tax', 'insurance'
  category text not null,
  size integer not null,
  url text not null,
  extracted_data jsonb default '{}'::jsonb,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_properties_user on properties(user_id);
create index idx_tenants_property on tenants(property_id);
create index idx_transactions_property on transactions(property_id);
create index idx_documents_property on documents(property_id);
create index idx_documents_tenant on documents(tenant_id);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table properties enable row level security;
alter table tenants enable row level security;
alter table transactions enable row level security;
alter table documents enable row level security;

-- Create policies
-- Profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Properties
create policy "Users can view own properties"
  on properties for select
  using (auth.uid() = user_id);

create policy "Users can insert own properties"
  on properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update own properties"
  on properties for update
  using (auth.uid() = user_id);

create policy "Users can delete own properties"
  on properties for delete
  using (auth.uid() = user_id);

-- Tenants
create policy "Users can view own tenants"
  on tenants for select
  using (auth.uid() = user_id);

create policy "Users can insert own tenants"
  on tenants for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tenants"
  on tenants for update
  using (auth.uid() = user_id);

create policy "Users can delete own tenants"
  on tenants for delete
  using (auth.uid() = user_id);

-- Transactions
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Documents
create policy "Users can view own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Create functions
-- Automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_properties_updated_at
  before update on properties
  for each row
  execute function update_updated_at_column();

create trigger update_tenants_updated_at
  before update on tenants
  for each row
  execute function update_updated_at_column();

create trigger update_documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at_column();
