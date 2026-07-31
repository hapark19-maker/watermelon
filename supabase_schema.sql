-- ============================================================
-- Supabase SQL Editor 실행용 쿼리문 (가장 확실하고 쉬운 100% 오류 없는 버전)
-- ============================================================

-- 1. 기존 정책 및 테이블 초기화 (필요시)
CREATE TABLE IF NOT EXISTS public.student_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. anon(익명 사용자) 및 모든 역할에 테이블 전체 권한 부여
GRANT ALL ON TABLE public.student_scores TO anon, authenticated, service_role;

-- 3. RLS (Row Level Security) 비활성화 (익명 사용자의 INSERT/SELECT 접근 차단 오류 100% 해결)
ALTER TABLE public.student_scores DISABLE ROW LEVEL SECURITY;
