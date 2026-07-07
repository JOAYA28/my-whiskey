-- ============================================================
-- 내 취향 한 잔, 위스키 편 (Whisky Flavor Match) - Supabase 스키마
-- Supabase 프로젝트의 SQL Editor에서 아래 스크립트를 실행하세요.
--
-- 질문(questions)과 위스키(whiskies) 데이터는 코드에서 관리한다.
-- (lib/questions.ts, lib/whisky-data.ts 참고 - MVP에서는 콘텐츠 변경이
--  거의 없고 배포로 즉시 반영 가능하므로 DB 테이블을 두지 않는다.)
-- Supabase에는 사용자의 익명 응답/추천 결과만 저장해 통계 및
-- 결과 공유 링크(예: /?result=<id>)에 사용한다.
-- ============================================================

-- 1. 결과 저장 테이블
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  user_vector jsonb not null,
  recommended_whisky_id text not null,
  similar_whisky_ids jsonb not null,
  match_rate int not null check (match_rate between 0 and 100),
  created_at timestamptz not null default now()
);

-- 2. Row Level Security 활성화
alter table public.quiz_results enable row level security;

-- 3. 익명 사용자도 결과를 저장(insert)할 수 있도록 허용
drop policy if exists "Allow public insert" on public.quiz_results;
create policy "Allow public insert"
  on public.quiz_results
  for insert
  to anon
  with check (true);

-- 4. 익명 사용자가 참여자 수 집계 및 공유된 결과를 조회할 수 있도록 허용
drop policy if exists "Allow public read" on public.quiz_results;
create policy "Allow public read"
  on public.quiz_results
  for select
  to anon
  using (true);

-- 5. 실시간(Realtime) 구독 활성화 -> 메인 화면 실시간 참여자 수 배너에 사용
alter publication supabase_realtime add table public.quiz_results;

-- 6. 조회 성능을 위한 인덱스
create index if not exists quiz_results_created_at_idx
  on public.quiz_results (created_at desc);
