-- ============================================================
-- Supabase SQL Editor 실행용 쿼리문
-- [수학교실 정수 사칙연산 퀴즈 점수 저장 테이블 및 보안 정책]
-- ============================================================

-- 1. 학생 점수 저장 테이블 생성 (student_scores)
CREATE TABLE IF NOT EXISTS public.student_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;

-- 3. 모든 사용자가 랭킹을 조회(SELECT)할 수 있는 정책 생성
CREATE POLICY "Allow public select on student_scores" 
  ON public.student_scores 
  FOR SELECT 
  USING (true);

-- 4. 모든 사용자가 점수를 등록(INSERT)할 수 있는 정책 생성
CREATE POLICY "Allow public insert on student_scores" 
  ON public.student_scores 
  FOR INSERT 
  WITH CHECK (true);
