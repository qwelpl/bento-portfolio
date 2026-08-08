-- run this in supabase sql editor

alter table portfolios add column if not exists views bigint default 0;

create table if not exists portfolio_views_log (
  id bigserial primary key,
  portfolio_id uuid references portfolios(id) on delete cascade not null,
  viewed_at timestamptz default now()
);

alter table portfolio_views_log enable row level security;

create policy "anyone can insert views"
  on portfolio_views_log for insert with check (true);

create policy "owner can read own views"
  on portfolio_views_log for select using (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  );

create index if not exists portfolio_views_log_portfolio_id_idx on portfolio_views_log(portfolio_id);
create index if not exists portfolio_views_log_viewed_at_idx on portfolio_views_log(viewed_at);

create or replace function increment_portfolio_views(p_username text)
returns void language plpgsql security definer as $$
declare
  v_portfolio_id uuid;
begin
  select id into v_portfolio_id from portfolios where username = p_username;
  if v_portfolio_id is null then return; end if;

  update portfolios set views = views + 1 where id = v_portfolio_id;
  insert into portfolio_views_log(portfolio_id) values (v_portfolio_id);
end;
$$;
