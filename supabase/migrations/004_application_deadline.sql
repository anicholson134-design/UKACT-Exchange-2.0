-- Deadline for candidates to apply to a placement, distinct from the
-- placement's own start/end dates. Safe to re-run.

alter table jobs add column if not exists application_deadline timestamptz;
