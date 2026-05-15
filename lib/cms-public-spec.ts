/**
 * /api/public/cms/[slug] 전용 허용 목록 (오픈 테이블 읽기)
 */
export type CmsSlugSpec =
  | { kind: "list"; table: string; orders?: { column: string; ascending?: boolean }[]; filters?: { column: string; value: string | number | boolean }[]; limit?: number }
  | { kind: "single"; table: string };

export const CMS_PUBLIC_SPEC: Record<string, CmsSlugSpec> = {
  "research-areas": {
    kind: "list",
    table: "research_areas",
    orders: [{ column: "sort_order", ascending: true }],
  },
  /** 레거시: 홈 UI는 research-areas 상위 4개를 사용. 외부/구버전 호환용으로 유지 */
  "research-highlights": {
    kind: "list",
    table: "research_highlights",
    orders: [{ column: "sort_order", ascending: true }],
  },
  publications: {
    kind: "list",
    table: "publications",
    orders: [{ column: "year", ascending: false }],
  },
  "publications-featured": {
    kind: "list",
    table: "publications",
    filters: [{ column: "is_featured", value: true }],
    orders: [{ column: "year", ascending: false }],
    limit: 4,
  },
  news: {
    kind: "list",
    table: "news",
    orders: [{ column: "date", ascending: false }],
  },
  "news-latest": {
    kind: "list",
    table: "news",
    orders: [{ column: "date", ascending: false }],
    limit: 5,
  },
  notices: {
    kind: "list",
    table: "notices",
    orders: [
      { column: "is_pinned", ascending: false },
      { column: "event_date", ascending: false },
    ],
  },
  "team-members": {
    kind: "list",
    table: "team_members",
    orders: [{ column: "sort_order", ascending: true }],
  },
  "alumni-list": {
    kind: "list",
    table: "alumni",
    orders: [{ column: "year", ascending: false }],
  },
  supporters: {
    kind: "list",
    table: "supporters",
    orders: [{ column: "sort_order", ascending: true }],
  },
  "homepage-hero": { kind: "single", table: "homepage_hero" },
  "site-settings": { kind: "single", table: "site_settings" },
  "contact-info": { kind: "single", table: "contact_info" },
  "job-openings": { kind: "single", table: "job_openings" },
  tools: {
    kind: "list",
    table: "tools",
    orders: [{ column: "sort_order", ascending: true }],
  },
  lectures: {
    kind: "list",
    table: "lectures",
    orders: [{ column: "sort_order", ascending: true }],
  },
};
