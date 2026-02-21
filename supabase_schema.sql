-- Create the clients table
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  contact text,
  email text,
  phone text,
  phone_owner text,
  instagram text,
  socials text,
  status text default 'Lead',
  type text,
  price numeric default 0,
  recurring numeric default 0,
  domain text,
  niche text,
  hosting text,
  description text,
  expenses jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  date date default current_date,
  final_deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.clients enable row level security;

-- Create policies so users can only access their own data
create policy "Users can only create their own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

create policy "Users can only view their own clients"
  on public.clients for select
  using (auth.uid() = user_id);

create policy "Users can only update their own clients"
  on public.clients for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own clients"
  on public.clients for delete
  using (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger to call the function
create trigger on_clients_updated
  before update on public.clients
  for each row
  execute procedure public.handle_updated_at();
