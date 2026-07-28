-- Safe to re-run: tears down anything from a previous partial/broken attempt
-- before rebuilding, so a dropped type or a half-applied run never leaves
-- stray objects behind (e.g. a trigger function referencing a type that no
-- longer exists, which throws "type ... does not exist" at signup time).

-- ── Teardown ──────────────────────────────────────────────────────────────
drop trigger if exists set_applications_updated_at on applications;
drop trigger if exists set_jobs_updated_at on jobs;
drop trigger if exists set_profiles_updated_at on profiles;
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists handle_new_user();
drop function if exists set_updated_at();

drop table if exists audit_log cascade;
drop table if exists saved_jobs cascade;
drop table if exists applications cascade;
drop table if exists jobs cascade;
drop table if exists employer_profiles cascade;
drop table if exists candidate_profiles cascade;
drop table if exists profiles cascade;

drop type if exists application_status;
drop type if exists job_status;
drop type if exists employer_status;
drop type if exists user_role;
drop type if exists contract_type;

-- ── Build ─────────────────────────────────────────────────────────────────

-- Enable extensions
create extension if not exists "pg_trgm";

-- ENUMS
create type user_role as enum ('candidate', 'employer', 'admin');
create type employer_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type job_status as enum ('draft', 'pending_review', 'active', 'closed', 'rejected');
create type application_status as enum ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired');
create type contract_type as enum ('full_time', 'part_time', 'contract', 'internship');

-- PROFILES
create table profiles (
  id                  uuid primary key references auth.users on delete cascade,
  role                user_role not null,
  full_name           text not null,
  avatar_url          text,
  phone               text,
  email_verified_at   timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- CANDIDATE PROFILES
create table candidate_profiles (
  id            uuid primary key references profiles on delete cascade,
  headline      text,
  summary       text,
  location      text,
  cv_url        text,
  cv_filename   text,
  linkedin_url  text,
  skills        text[] default '{}',
  years_exp     int,
  open_to_work  boolean default true
);

-- EMPLOYER PROFILES
create table employer_profiles (
  id                uuid primary key references profiles on delete cascade,
  company_name      text not null,
  company_size      text,
  industry          text,
  website           text,
  logo_url          text,
  description       text,
  location          text,
  status            employer_status default 'pending',
  reviewed_by       uuid references profiles(id),
  reviewed_at       timestamptz,
  rejection_reason  text
);

-- JOBS
create table jobs (
  id                uuid primary key default gen_random_uuid(),
  employer_id       uuid not null references employer_profiles on delete cascade,
  title             text not null,
  description       text not null,
  location          text,
  remote            boolean default false,
  contract_type     contract_type not null,
  salary_min        int,
  salary_max        int,
  skills_required   text[] default '{}',
  status            job_status default 'pending_review',
  reviewed_by       uuid references profiles(id),
  reviewed_at       timestamptz,
  expires_at        timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Full-text search index on jobs
create index jobs_fts_idx on jobs using gin(to_tsvector('english', title || ' ' || description));
create index jobs_title_trgm_idx on jobs using gin(title gin_trgm_ops);

-- APPLICATIONS
create table applications (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null references jobs on delete cascade,
  candidate_id    uuid not null references candidate_profiles on delete cascade,
  cover_letter    text,
  cv_url          text,
  status          application_status default 'submitted',
  employer_notes  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(job_id, candidate_id)
);

-- SAVED JOBS
create table saved_jobs (
  candidate_id  uuid references candidate_profiles on delete cascade,
  job_id        uuid references jobs on delete cascade,
  saved_at      timestamptz default now(),
  primary key (candidate_id, job_id)
);

-- AUDIT LOG
create table audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references profiles(id),
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  payload     jsonb,
  created_at  timestamptz default now()
);

-- TRIGGER: auto-create profile + sub-profile on auth.users insert
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_role user_role;
begin
  v_role := (new.raw_user_meta_data->>'role')::user_role;

  insert into profiles (id, role, full_name)
  values (
    new.id,
    coalesce(v_role, 'candidate'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );

  if v_role = 'candidate' then
    insert into candidate_profiles (id) values (new.id);
  elsif v_role = 'employer' then
    insert into employer_profiles (id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'company_name', 'Unknown Company'));
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- TRIGGER: updated_at timestamps
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on profiles
  for each row execute procedure set_updated_at();
create trigger set_jobs_updated_at before update on jobs
  for each row execute procedure set_updated_at();
create trigger set_applications_updated_at before update on applications
  for each row execute procedure set_updated_at();

-- ROW LEVEL SECURITY
alter table profiles           enable row level security;
alter table candidate_profiles enable row level security;
alter table employer_profiles  enable row level security;
alter table jobs               enable row level security;
alter table applications       enable row level security;
alter table saved_jobs         enable row level security;
alter table audit_log          enable row level security;

-- PROFILES policies
create policy "users read own profile"
  on profiles for select using (id = auth.uid());
create policy "users update own profile"
  on profiles for update using (id = auth.uid());

-- CANDIDATE policies
create policy "candidate own profile"
  on candidate_profiles for all using (id = auth.uid());
create policy "employers view candidates who applied"
  on candidate_profiles for select
  using (
    exists (
      select 1 from applications a
      join jobs j on j.id = a.job_id
      where a.candidate_id = candidate_profiles.id
        and j.employer_id = auth.uid()
    )
  );

-- EMPLOYER policies
create policy "employer own profile"
  on employer_profiles for all using (id = auth.uid());
create policy "public employer profiles"
  on employer_profiles for select using (status = 'approved');

-- JOB policies
create policy "public active jobs"
  on jobs for select using (status = 'active');
create policy "employer own jobs"
  on jobs for all using (employer_id = auth.uid());

-- APPLICATION policies
create policy "candidate own applications"
  on applications for all using (candidate_id = auth.uid());
create policy "employer view job applications"
  on applications for select
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id and j.employer_id = auth.uid()
    )
  );
create policy "employer update application status"
  on applications for update
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id and j.employer_id = auth.uid()
    )
  );

-- SAVED JOBS policies
create policy "candidate own saved jobs"
  on saved_jobs for all using (candidate_id = auth.uid());

-- Storage buckets (run via Supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('cvs', 'cvs', false);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true);
