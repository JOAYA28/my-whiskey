import { createClient } from "@supabase/supabase-js";

// docs/supabase-info.md 에 기재된 프로젝트 자격 증명을 그대로 하드코딩합니다.
// 이 키는 Supabase의 "publishable(anon)" 키로, RLS 정책으로 접근 범위가
// 제한되므로 클라이언트 소스코드에 노출되어도 안전합니다.
const SUPABASE_PROJECT_ID = "chyznhwgmcxpzugurunw";
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Nc9sIkNIsIwC4yHfgUTYvA_j2ninNkT";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const QUIZ_RESULTS_TABLE = "quiz_results";
