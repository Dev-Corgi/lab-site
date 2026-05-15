/**
 * 연구 분야 상세 — 서비스 롤 우선, 503 시 anon 폴백
 */
export async function fetchResearchAreaBySlug(
  slug: string,
  fetchAnon: () => Promise<Record<string, unknown> | null>,
): Promise<Record<string, unknown> | null> {
  const enc = encodeURIComponent(slug);
  try {
    const res = await fetch(`/api/public/research-area/${enc}`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { data?: Record<string, unknown> | null };
      if (json.data != null) return json.data;
    }
  } catch {
    /* 폴백 */
  }
  return fetchAnon();
}
