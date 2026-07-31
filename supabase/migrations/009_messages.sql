-- Messaging between a collection and a candidate, scoped to a specific
-- application (not a general inbox). Safe to re-run.

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references applications on delete cascade,
  sender_id       uuid not null references profiles(id),
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists messages_application_idx on messages(application_id, created_at);

alter table messages enable row level security;

drop policy if exists "participants read messages" on messages;
create policy "participants read messages"
  on messages for select using (
    exists (
      select 1 from applications a
      join jobs j on j.id = a.job_id
      where a.id = messages.application_id
        and (a.candidate_id = auth.uid() or j.employer_id = auth.uid())
    )
  );

drop policy if exists "participants send messages" on messages;
create policy "participants send messages"
  on messages for insert with check (
    sender_id = auth.uid() and
    exists (
      select 1 from applications a
      join jobs j on j.id = a.job_id
      where a.id = messages.application_id
        and (a.candidate_id = auth.uid() or j.employer_id = auth.uid())
    )
  );

-- Recipients mark messages as read; senders can't rewrite their own read_at
-- to look unread, and nobody can edit message bodies after sending.
drop policy if exists "recipients mark read" on messages;
create policy "recipients mark read"
  on messages for update using (
    sender_id <> auth.uid() and
    exists (
      select 1 from applications a
      join jobs j on j.id = a.job_id
      where a.id = messages.application_id
        and (a.candidate_id = auth.uid() or j.employer_id = auth.uid())
    )
  )
  with check (sender_id <> auth.uid());
