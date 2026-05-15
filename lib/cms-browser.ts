/**
 * 브라우저에서 공개 CMS 데이터 로드 — 서버 라우트(서비스 롤 RLS 우회) 우선,
 * 라우트 503 등일 때 anon Supabase로 폴백.
 */

export async function fetchCmsListWithAnonFallback(
  slug: string,
  fetchAnonRows: () => Promise<unknown[]>,
): Promise<unknown[]> {
  try {
    const res = await fetch(`/api/public/cms/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { data?: unknown };
      if (Array.isArray(json.data)) return json.data;
    }
  } catch {
    /* 폴백 */
  }
  return fetchAnonRows();
}

export async function fetchCmsSingleWithAnonFallback<T>(
  slug: string,
  fetchAnonSingle: () => Promise<T | null>,
): Promise<T | null> {
  try {
    const res = await fetch(`/api/public/cms/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { data?: T | null };
      if (json.data != null) return json.data;
    }
  } catch {
    /* 폴백 */
  }
  return fetchAnonSingle();
}
