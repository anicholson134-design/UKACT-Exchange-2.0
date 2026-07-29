-- Human-readable placement URLs (e.g. /jobs/primate-keeper-exchange-a1b2c3d4)
-- instead of raw UUIDs. The trailing 8 chars of the row's own id keep every
-- slug unique with zero collision handling needed. Safe to re-run.

create or replace function slugify(input text)
returns text language sql immutable as $$
  select trim(both '-' from
    regexp_replace(
      regexp_replace(lower(input), '[^a-z0-9\s-]', '', 'g'),
    '[\s-]+', '-', 'g')
  )
$$;

alter table jobs add column if not exists slug text;

update jobs set slug = slugify(title) || '-' || substr(id::text, 1, 8)
where slug is null or slug = '';

create or replace function set_job_slug()
returns trigger language plpgsql as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := slugify(new.title) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

drop trigger if exists jobs_set_slug on jobs;
create trigger jobs_set_slug
  before insert on jobs
  for each row execute procedure set_job_slug();

alter table jobs alter column slug set not null;
create unique index if not exists jobs_slug_key on jobs(slug);
