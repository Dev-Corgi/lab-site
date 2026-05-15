/** URL 슬러그용: 영숫자·하이픈 위주 (한글 등은 제거되므로 필요 시 수동 입력) */
export function slugifyTitle(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/['']+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "research";
}

export function uniqueSlugCandidate(base: string): string {
  const tail = Math.random().toString(36).slice(2, 8);
  return `${base}-${tail}`;
}
