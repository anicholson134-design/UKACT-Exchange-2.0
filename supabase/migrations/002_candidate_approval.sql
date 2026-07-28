-- Candidate approval workflow, mirroring the existing employer one, plus
-- removal of the unused open_to_work flag. Safe to re-run.

do $$ begin
  if not exists (select 1 from pg_type where typname = 'candidate_status') then
    create type candidate_status as enum ('pending', 'approved');
  end if;
end $$;

alter table candidate_profiles
  add column if not exists status candidate_status not null default 'pending',
  add column if not exists reviewed_by uuid references profiles(id),
  add column if not exists reviewed_at timestamptz;

alter table candidate_profiles drop column if exists open_to_work;

-- Grandfather in everyone who signed up before this feature existed — only
-- candidates who register from now on start out pending.
update candidate_profiles set status = 'approved', reviewed_at = now()
where status = 'pending' and reviewed_at is null;

-- ── Protect status/reviewed_* from being self-edited ────────────────────────
-- The "own profile" RLS policies below allow a candidate/employer to update
-- their own row, which is required for normal profile editing — but with no
-- column-level restriction, that also means a client could self-approve by
-- writing directly to `status` via the API. Force these columns back to
-- their previous value on any update that isn't made through the
-- service-role (admin) client.
create or replace function protect_reviewed_status()
returns trigger language plpgsql as $$
begin
  if auth.role() <> 'service_role' then
    new.status := old.status;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_candidate_status on candidate_profiles;
create trigger protect_candidate_status
  before update on candidate_profiles
  for each row execute procedure protect_reviewed_status();

-- Same gap exists on employer_profiles.status — patch it too while we're here.
drop trigger if exists protect_employer_status on employer_profiles;
create trigger protect_employer_status
  before update on employer_profiles
  for each row execute procedure protect_reviewed_status();
