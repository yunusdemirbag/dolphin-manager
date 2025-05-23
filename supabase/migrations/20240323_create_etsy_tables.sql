-- oauth_states tablosu
create table oauth_states (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  state text not null,
  provider text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '1 hour') not null
);

-- etsy_stores tablosu
create table etsy_stores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  etsy_user_id text not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, etsy_user_id)
);

-- RLS politikaları
alter table oauth_states enable row level security;
alter table etsy_stores enable row level security;

create policy "Users can insert their own oauth states"
  on oauth_states for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own oauth states"
  on oauth_states for select
  using (auth.uid() = user_id);

create policy "Users can delete their own oauth states"
  on oauth_states for delete
  using (auth.uid() = user_id);

create policy "Users can manage their own Etsy stores"
  on etsy_stores for all
  using (auth.uid() = user_id); 