-- Capture a collection's address at signup (employerRegisterSchema already
-- had an optional `location` field — the form just never sent it, and the
-- signup trigger never read it). Also folds in the search_path fix applied
-- directly in Supabase earlier (this file had drifted from the deployed
-- function) so a fresh run of the migrations reproduces the working state.
-- Safe to re-run.

create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_role public.user_role;
begin
  v_role := (new.raw_user_meta_data->>'role')::public.user_role;

  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(v_role, 'candidate'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );

  if v_role = 'candidate' then
    insert into public.candidate_profiles (id) values (new.id);
  elsif v_role = 'employer' then
    insert into public.employer_profiles (id, company_name, location)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'company_name', 'Unknown Company'),
      nullif(new.raw_user_meta_data->>'location', '')
    );
  end if;

  return new;
end;
$$;
