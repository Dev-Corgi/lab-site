-- 연구 분야 상세(슬러그 + 리치 HTML 본문). 공개 SELECT/인증 CRUD 정책은 기존 테이블과 동일합니다.

ALTER TABLE public.research_areas
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS body_html text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS body_html_kr text NOT NULL DEFAULT '';

-- 기존 행: 고유 슬러그 보장 (관리자에서 사람이 읽기 좋은 슬러그로 변경 가능)
UPDATE public.research_areas
SET slug = 'r-' || replace(id::text, '-', '')
WHERE slug IS NULL OR btrim(slug) = '';

ALTER TABLE public.research_areas
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS research_areas_slug_unique ON public.research_areas (slug);
