-- Site settings table for editable global content
create table if not exists site_settings (
  key   text primary key,
  value text not null default ''
);

-- Allow public read (logo etc. needed on public pages)
alter table site_settings enable row level security;

create policy "Public can read site_settings"
  on site_settings for select
  using (true);

create policy "Admins can manage site_settings"
  on site_settings for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
