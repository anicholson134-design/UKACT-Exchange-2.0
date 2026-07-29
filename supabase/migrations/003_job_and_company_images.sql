-- Placement advert photo. employer_profiles.logo_url already existed but was
-- never editable by the employer themselves — no schema change needed there,
-- just an admin/self-service UI (see app/employer/profile). Safe to re-run.

alter table jobs add column if not exists image_url text;
