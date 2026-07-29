-- jobs.start_date has been referenced by JobForm and the /api/jobs routes
-- since they were built, but no migration ever created the column — every
-- job insert/update has been failing with "column jobs.start_date does not
-- exist". Safe to re-run.

alter table jobs add column if not exists start_date date;
