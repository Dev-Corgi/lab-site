-- -----------------------------------------------------------------------------
-- 비로그인 방문자(anon)에게 SELECT 허용 + 로그인 관리자(authenticated JWT)에게 전체 수정 허용
--
-- 증상: 관리자는 DB를 읽지만, 공개 페이지는 anon 키로 조회 → RLS 때문에 [] 반환 시
--       앱이 하드코딩 폴백 목록만 보여 "반영 안 됨"처럼 보입니다.
--
-- 적용: Supabase Dashboard → SQL Editor에서 실행 (또는 supabase db push 등)
--
-- 참고: 동일 이름 정책이 이미 있으면 DROP 후 재생성합니다. 다른 정책과 충돌 시 이름을 바꿔 주세요.
-- -----------------------------------------------------------------------------

ALTER TABLE IF EXISTS public.research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.research_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.homepage_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lectures ENABLE ROW LEVEL SECURITY;

-- 각 테이블: anon 공개 조회 / authenticated 테이블 전체(CRUD·SELECT)
DROP POLICY IF EXISTS "cms_public_select_all" ON public.research_areas;
CREATE POLICY "cms_public_select_all" ON public.research_areas FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.research_areas;
CREATE POLICY "cms_authenticated_full" ON public.research_areas FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.research_highlights;
CREATE POLICY "cms_public_select_all" ON public.research_highlights FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.research_highlights;
CREATE POLICY "cms_authenticated_full" ON public.research_highlights FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.team_members;
CREATE POLICY "cms_public_select_all" ON public.team_members FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.team_members;
CREATE POLICY "cms_authenticated_full" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.alumni;
CREATE POLICY "cms_public_select_all" ON public.alumni FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.alumni;
CREATE POLICY "cms_authenticated_full" ON public.alumni FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.publications;
CREATE POLICY "cms_public_select_all" ON public.publications FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.publications;
CREATE POLICY "cms_authenticated_full" ON public.publications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.news;
CREATE POLICY "cms_public_select_all" ON public.news FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.news;
CREATE POLICY "cms_authenticated_full" ON public.news FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.notices;
CREATE POLICY "cms_public_select_all" ON public.notices FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.notices;
CREATE POLICY "cms_authenticated_full" ON public.notices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.homepage_hero;
CREATE POLICY "cms_public_select_all" ON public.homepage_hero FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.homepage_hero;
CREATE POLICY "cms_authenticated_full" ON public.homepage_hero FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.site_settings;
CREATE POLICY "cms_public_select_all" ON public.site_settings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.site_settings;
CREATE POLICY "cms_authenticated_full" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.contact_info;
CREATE POLICY "cms_public_select_all" ON public.contact_info FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.contact_info;
CREATE POLICY "cms_authenticated_full" ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.supporters;
CREATE POLICY "cms_public_select_all" ON public.supporters FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.supporters;
CREATE POLICY "cms_authenticated_full" ON public.supporters FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.job_openings;
CREATE POLICY "cms_public_select_all" ON public.job_openings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.job_openings;
CREATE POLICY "cms_authenticated_full" ON public.job_openings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.tools;
CREATE POLICY "cms_public_select_all" ON public.tools FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.tools;
CREATE POLICY "cms_authenticated_full" ON public.tools FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_public_select_all" ON public.lectures;
CREATE POLICY "cms_public_select_all" ON public.lectures FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "cms_authenticated_full" ON public.lectures;
CREATE POLICY "cms_authenticated_full" ON public.lectures FOR ALL TO authenticated USING (true) WITH CHECK (true);
