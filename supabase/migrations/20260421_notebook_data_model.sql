create extension if not exists pgcrypto;

create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notebooks_user_id_updated_at_idx
  on public.notebooks (user_id, updated_at desc);

create table if not exists public.notebook_sources (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  url text not null check (char_length(trim(url)) > 0),
  title text,
  custom_title text,
  is_selected boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists notebook_sources_notebook_id_order_index_idx
  on public.notebook_sources (notebook_id, order_index asc, created_at asc);

create unique index if not exists notebook_sources_notebook_url_unique_idx
  on public.notebook_sources (notebook_id, url);

create table if not exists public.notebook_summaries (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null unique references public.notebooks(id) on delete cascade,
  content_markdown text not null,
  source_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.notebook_flashcards (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  front text not null,
  back text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists notebook_flashcards_notebook_id_order_index_idx
  on public.notebook_flashcards (notebook_id, order_index asc, created_at asc);

create table if not exists public.notebook_quizzes (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  title text not null,
  context_label text,
  source_count integer not null default 0,
  total_questions integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notebook_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.notebook_quizzes(id) on delete cascade,
  question_text text not null,
  hint text,
  correct_option_id text not null,
  order_index integer not null default 0
);

create index if not exists notebook_quiz_questions_quiz_id_order_index_idx
  on public.notebook_quiz_questions (quiz_id, order_index asc);

create table if not exists public.notebook_quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.notebook_quiz_questions(id) on delete cascade,
  option_key text not null check (char_length(trim(option_key)) > 0),
  text text not null,
  order_index integer not null default 0
);

create unique index if not exists notebook_quiz_options_question_option_key_unique_idx
  on public.notebook_quiz_options (question_id, option_key);

create index if not exists notebook_quiz_options_question_id_order_index_idx
  on public.notebook_quiz_options (question_id, order_index asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notebooks_set_updated_at on public.notebooks;
create trigger trg_notebooks_set_updated_at
before update on public.notebooks
for each row
execute function public.set_updated_at();

drop trigger if exists trg_notebook_summaries_set_updated_at on public.notebook_summaries;
create trigger trg_notebook_summaries_set_updated_at
before update on public.notebook_summaries
for each row
execute function public.set_updated_at();

alter table public.notebooks enable row level security;
alter table public.notebook_sources enable row level security;
alter table public.notebook_summaries enable row level security;
alter table public.notebook_flashcards enable row level security;
alter table public.notebook_quizzes enable row level security;
alter table public.notebook_quiz_questions enable row level security;
alter table public.notebook_quiz_options enable row level security;

drop policy if exists notebooks_owner_all on public.notebooks;
create policy notebooks_owner_all
on public.notebooks
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists notebook_sources_owner_all on public.notebook_sources;
create policy notebook_sources_owner_all
on public.notebook_sources
for all
using (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
);

drop policy if exists notebook_summaries_owner_all on public.notebook_summaries;
create policy notebook_summaries_owner_all
on public.notebook_summaries
for all
using (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
);

drop policy if exists notebook_flashcards_owner_all on public.notebook_flashcards;
create policy notebook_flashcards_owner_all
on public.notebook_flashcards
for all
using (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
);

drop policy if exists notebook_quizzes_owner_all on public.notebook_quizzes;
create policy notebook_quizzes_owner_all
on public.notebook_quizzes
for all
using (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebooks n
    where n.id = notebook_id and n.user_id = auth.uid()
  )
);

drop policy if exists notebook_quiz_questions_owner_all on public.notebook_quiz_questions;
create policy notebook_quiz_questions_owner_all
on public.notebook_quiz_questions
for all
using (
  exists (
    select 1
    from public.notebook_quizzes q
    join public.notebooks n on n.id = q.notebook_id
    where q.id = quiz_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebook_quizzes q
    join public.notebooks n on n.id = q.notebook_id
    where q.id = quiz_id and n.user_id = auth.uid()
  )
);

drop policy if exists notebook_quiz_options_owner_all on public.notebook_quiz_options;
create policy notebook_quiz_options_owner_all
on public.notebook_quiz_options
for all
using (
  exists (
    select 1
    from public.notebook_quiz_questions qq
    join public.notebook_quizzes q on q.id = qq.quiz_id
    join public.notebooks n on n.id = q.notebook_id
    where qq.id = question_id and n.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.notebook_quiz_questions qq
    join public.notebook_quizzes q on q.id = qq.quiz_id
    join public.notebooks n on n.id = q.notebook_id
    where qq.id = question_id and n.user_id = auth.uid()
  )
);
