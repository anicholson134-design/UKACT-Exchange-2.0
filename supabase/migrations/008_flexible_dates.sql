-- Lets a collection offer a flexible exchange (e.g. "2 days, anytime in
-- September") instead of fixed dates. When flexible_dates is true,
-- start_date/expires_at hold the window bounds rather than the fixed
-- exchange dates, and flexible_duration_days holds the exchange length
-- within that window. Safe to re-run.

alter table jobs add column if not exists flexible_dates boolean not null default false;
alter table jobs add column if not exists flexible_duration_days int;
