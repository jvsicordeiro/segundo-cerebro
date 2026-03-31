-- ═══════════════════════════════════════════════════════
-- SEGUNDO CÉREBRO — Schema v2 (enxuto)
-- Supabase (PostgreSQL) · Projeto: sflxfdbubgoqzsnjlwyq
-- 2026-03-30
-- Removidas: grocery_items, cleaning_tasks, courses, symptoms, body_measures, investments
-- Absorvidas como categorias em tasks/goals ou jsonb
-- ═══════════════════════════════════════════════════════

-- Extensões
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ═══════════════════════════════════════════════════════
-- 0. HELPERS
-- ═══════════════════════════════════════════════════════

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function create_updated_at_trigger(tbl text)
returns void as $$
begin
  execute format(
    'create trigger trg_%s_updated_at before update on %I
     for each row execute function update_updated_at()',
    tbl, tbl
  );
end;
$$ language plpgsql;

-- ═══════════════════════════════════════════════════════
-- 1. PROFILES
-- ═══════════════════════════════════════════════════════

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  nickname    text not null default '',
  avatar_url  text,
  birth_date  date,
  bio         text,
  settings    jsonb not null default '{"theme":"light","notifications":true,"family_mode":false,"weekly_review_day":0}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
select create_updated_at_trigger('profiles');

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ═══════════════════════════════════════════════════════
-- 2. PEOPLE
-- ═══════════════════════════════════════════════════════

create type person_category as enum ('family','partner','friend','work','professional','other');

create table people (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  category    person_category not null default 'other',
  role        text,
  emoji       text default '👤',
  color       text default '#007AFF',
  birth_date  date,
  since_date  date,
  notes       text,
  is_group    boolean not null default false,
  group_size  int,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_people_user on people(user_id);
select create_updated_at_trigger('people');

-- ═══════════════════════════════════════════════════════
-- 3. COLLECTIONS
-- ═══════════════════════════════════════════════════════

create table collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  emoji       text default '📁',
  color       text default '#007AFF',
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_collections_user on collections(user_id);
select create_updated_at_trigger('collections');

-- ═══════════════════════════════════════════════════════
-- 4. TAGS
-- ═══════════════════════════════════════════════════════

create type tag_type as enum ('emotion','place','person','topic','custom');

create table tags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        tag_type not null default 'custom',
  color       text,
  constraint  uq_tag_user_name unique (user_id, name)
);
create index idx_tags_user on tags(user_id);

-- ═══════════════════════════════════════════════════════
-- 5. MEMORIES (entidade central)
-- ═══════════════════════════════════════════════════════

create type memory_type as enum ('memory','thought','event','milestone','quote','advice','dream');

create table memories (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          memory_type not null default 'memory',
  title         text not null,
  body          text,
  date_start    date,
  date_end      date,
  date_display  text,
  location      text,
  emoji         text,
  is_legacy     boolean not null default false,
  is_favorite   boolean not null default false,
  media_urls    text[] default '{}',
  voice_url     text,
  metadata      jsonb default '{}',
  collection_id uuid references collections(id) on delete set null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_memories_user on memories(user_id);
create index idx_memories_date on memories(user_id, date_start desc);
create index idx_memories_collection on memories(collection_id);
create index idx_memories_legacy on memories(user_id, is_legacy) where is_legacy = true;
create index idx_memories_search on memories using gin (
  (to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(body,'')))
);
select create_updated_at_trigger('memories');

-- Junction tables
create table memory_people (
  memory_id  uuid not null references memories(id) on delete cascade,
  person_id  uuid not null references people(id) on delete cascade,
  primary key (memory_id, person_id)
);

create table memory_tags (
  memory_id  uuid not null references memories(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (memory_id, tag_id)
);

create table memory_connections (
  memory_a  uuid not null references memories(id) on delete cascade,
  memory_b  uuid not null references memories(id) on delete cascade,
  label     text,
  primary key (memory_a, memory_b),
  constraint chk_no_self check (memory_a <> memory_b)
);

-- ═══════════════════════════════════════════════════════
-- 6. TASKS
-- ═══════════════════════════════════════════════════════

create type task_priority as enum ('urgent','high','medium','low');
create type recurrence as enum ('daily','weekly','biweekly','monthly','yearly');

create table tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  notes         text,
  priority      task_priority not null default 'medium',
  due_date      date,
  due_time      time,
  done          boolean not null default false,
  done_at       timestamptz,
  recurrence    recurrence,
  category      text,     -- "Clinai","Casa","Pessoal","Mercado","Limpeza" etc.
  person_id     uuid references people(id) on delete set null,
  collection_id uuid references collections(id) on delete set null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_tasks_user on tasks(user_id);
create index idx_tasks_due on tasks(user_id, due_date) where done = false;
select create_updated_at_trigger('tasks');

-- ═══════════════════════════════════════════════════════
-- 7. HABITS
-- ═══════════════════════════════════════════════════════

create table habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  emoji       text default '✅',
  frequency   recurrence not null default 'daily',
  target      int not null default 1,
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_habits_user on habits(user_id);
select create_updated_at_trigger('habits');

create table habit_logs (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  habit_id  uuid not null references habits(id) on delete cascade,
  date      date not null,
  value     int not null default 1,
  constraint uq_habit_log unique (habit_id, date)
);
create index idx_habit_logs_date on habit_logs(user_id, date desc);

-- ═══════════════════════════════════════════════════════
-- 8. MOOD
-- ═══════════════════════════════════════════════════════

create table mood_logs (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  date      date not null,
  mood      int not null check (mood between 1 and 5),
  note      text,
  constraint uq_mood_date unique (user_id, date)
);
create index idx_mood_user_date on mood_logs(user_id, date desc);

-- ═══════════════════════════════════════════════════════
-- 9. FINANCES (radar simplificado)
-- ═══════════════════════════════════════════════════════

create type finance_type as enum ('income','expense');

create table finance_categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  emoji      text default '💰',
  color      text default '#007AFF',
  type       finance_type not null default 'expense',
  sort_order int not null default 0,
  constraint uq_fin_cat unique (user_id, name, type)
);

create table transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          finance_type not null,
  category_id   uuid references finance_categories(id) on delete set null,
  description   text not null,
  amount        numeric(12,2) not null,
  date          date not null,
  is_recurring  boolean not null default false,
  notes         text,
  person_id     uuid references people(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_transactions_user on transactions(user_id);
create index idx_transactions_date on transactions(user_id, date desc);
select create_updated_at_trigger('transactions');

create table bills (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  description         text not null,
  amount              numeric(12,2) not null,
  due_day             int not null check (due_day between 1 and 31),
  category_id         uuid references finance_categories(id) on delete set null,
  active              boolean not null default true,
  notify_days_before  int not null default 2,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index idx_bills_user on bills(user_id);
select create_updated_at_trigger('bills');

create table financial_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  target      numeric(12,2) not null,
  current     numeric(12,2) not null default 0,
  emoji       text default '🎯',
  deadline    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_fin_goals_user on financial_goals(user_id);
select create_updated_at_trigger('financial_goals');

-- ═══════════════════════════════════════════════════════
-- 10. HEALTH (leve)
-- ═══════════════════════════════════════════════════════

create table medications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  dosage      text,
  frequency   text not null default '1x dia',
  time_of_day text,
  active      boolean not null default true,
  notify      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_medications_user on medications(user_id);
select create_updated_at_trigger('medications');

create table medication_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  medication_id uuid not null references medications(id) on delete cascade,
  date          date not null,
  taken         boolean not null default true,
  constraint    uq_med_log unique (medication_id, date)
);
create index idx_med_logs_date on medication_logs(user_id, date desc);

create table appointments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  person_id   uuid references people(id) on delete set null,
  date        date not null,
  time        time,
  location    text,
  notes       text,
  gcal_id     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_appointments_user on appointments(user_id);
create index idx_appointments_date on appointments(user_id, date);
select create_updated_at_trigger('appointments');

-- ═══════════════════════════════════════════════════════
-- 11. GOALS (multi-horizonte)
-- ═══════════════════════════════════════════════════════

create type goal_horizon as enum ('week','month','6months','1year','2years','3years','5years','life');

create table goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  description   text,
  horizon       goal_horizon not null default '1year',
  progress      int not null default 0 check (progress between 0 and 100),
  target_value  text,
  current_value text,
  emoji         text default '🎯',
  category      text,
  done          boolean not null default false,
  done_at       timestamptz,
  deadline      date,
  parent_id     uuid references goals(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_goals_user on goals(user_id);
create index idx_goals_horizon on goals(user_id, horizon);
select create_updated_at_trigger('goals');

-- ═══════════════════════════════════════════════════════
-- 12. PROJECTS
-- ═══════════════════════════════════════════════════════

create table projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  emoji       text default '📋',
  status      text not null default 'active',
  goal_id     uuid references goals(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_projects_user on projects(user_id);
select create_updated_at_trigger('projects');

-- ═══════════════════════════════════════════════════════
-- 13. ARCHAEOLOGIST
-- ═══════════════════════════════════════════════════════

create table archaeologist_quests (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text,
  emoji           text default '🏛️',
  status          text not null default 'pending',
  memories_count  int not null default 0,
  sort_order      int not null default 0,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index idx_arq_user on archaeologist_quests(user_id);

-- ═══════════════════════════════════════════════════════
-- 14. LETTERS (cartas pro futuro)
-- ═══════════════════════════════════════════════════════

create table letters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  recipient       text not null,
  title           text not null,
  body            text not null,
  open_date       date,
  open_condition  text,
  is_opened       boolean not null default false,
  person_id       uuid references people(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_letters_user on letters(user_id);
select create_updated_at_trigger('letters');

-- ═══════════════════════════════════════════════════════
-- 15. AI MESSAGES
-- ═══════════════════════════════════════════════════════

create table ai_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system')),
  content     text not null,
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now()
);
create index idx_ai_msgs_user on ai_messages(user_id, created_at desc);

-- ═══════════════════════════════════════════════════════
-- 16. VOICE ENTRIES
-- ═══════════════════════════════════════════════════════

create table voice_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  audio_url     text not null,
  transcript    text,
  duration_sec  int,
  parsed_type   text,
  parsed_ref_id uuid,
  processed     boolean not null default false,
  created_at    timestamptz not null default now()
);
create index idx_voice_user on voice_entries(user_id, created_at desc);

-- ═══════════════════════════════════════════════════════
-- 17. REVIEWS (IA gera)
-- ═══════════════════════════════════════════════════════

create type review_period as enum ('weekly','monthly','yearly');

create table reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  period      review_period not null,
  start_date  date not null,
  end_date    date not null,
  content     text,
  stats       jsonb default '{}',
  created_at  timestamptz not null default now()
);
create index idx_reviews_user on reviews(user_id, start_date desc);

-- ═══════════════════════════════════════════════════════
-- 18. SCHEDULE
-- ═══════════════════════════════════════════════════════

create table schedule_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  date        date not null,
  start_time  time,
  end_time    time,
  location    text,
  person_id   uuid references people(id) on delete set null,
  gcal_id     text,
  color       text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_schedule_user on schedule_items(user_id, date);
select create_updated_at_trigger('schedule_items');

-- ═══════════════════════════════════════════════════════
-- RLS (Row Level Security)
-- ═══════════════════════════════════════════════════════

do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
    and tablename not in ('schema_migrations','profiles','memory_people','memory_tags','memory_connections')
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())',
      'rls_' || t, t
    );
  end loop;
end;
$$;

-- Fix: profiles usa 'id' em vez de 'user_id'
drop policy if exists rls_profiles on profiles;
create policy rls_profiles on profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

-- Fix: junction tables sem user_id
drop policy if exists rls_memory_people on memory_people;
create policy rls_memory_people on memory_people for all
  using (exists (select 1 from memories where id = memory_id and user_id = auth.uid()))
  with check (exists (select 1 from memories where id = memory_id and user_id = auth.uid()));

drop policy if exists rls_memory_tags on memory_tags;
create policy rls_memory_tags on memory_tags for all
  using (exists (select 1 from memories where id = memory_id and user_id = auth.uid()))
  with check (exists (select 1 from memories where id = memory_id and user_id = auth.uid()));

drop policy if exists rls_memory_connections on memory_connections;
create policy rls_memory_connections on memory_connections for all
  using (exists (select 1 from memories where id = memory_a and user_id = auth.uid()))
  with check (exists (select 1 from memories where id = memory_a and user_id = auth.uid()));

-- ═══════════════════════════════════════════════════════
-- VIEWS
-- ═══════════════════════════════════════════════════════

create or replace view v_finance_monthly as
select
  user_id,
  date_trunc('month', date)::date as month,
  sum(case when type = 'income' then amount else 0 end) as income,
  sum(case when type = 'expense' then amount else 0 end) as expenses,
  sum(case when type = 'income' then amount else -amount end) as balance
from transactions
group by user_id, date_trunc('month', date);

create or replace view v_habit_streaks as
with dates as (
  select habit_id, user_id, date,
    date - (row_number() over (partition by habit_id order by date))::int as grp
  from habit_logs
),
streaks as (
  select habit_id, user_id, min(date) as streak_start, max(date) as streak_end, count(*) as streak_days
  from dates group by habit_id, user_id, grp
)
select
  habit_id, user_id,
  max(streak_days) as best_streak,
  (select streak_days from streaks s2
   where s2.habit_id = streaks.habit_id and s2.streak_end = current_date
   limit 1) as current_streak
from streaks group by habit_id, user_id;

create or replace view v_today_briefing as
select
  p.id as user_id,
  (select count(*) from tasks t where t.user_id = p.id and t.done = false and t.due_date <= current_date) as overdue_tasks,
  (select count(*) from bills b where b.user_id = p.id and b.active = true
   and b.due_day between extract(day from current_date)::int and extract(day from current_date)::int + 3) as upcoming_bills,
  (select count(*) from appointments a where a.user_id = p.id and a.date = current_date) as today_appointments,
  (select mood from mood_logs m where m.user_id = p.id and m.date = current_date limit 1) as today_mood
from profiles p;
