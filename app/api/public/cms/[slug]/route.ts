import { CMS_PUBLIC_SPEC } from "@/lib/cms-public-spec";
import { createServiceRoleClient } from "@/lib/supabase/service-client";
import { NextRequest, NextResponse } from "next/server";

/** 공개 CMS는 항상 최신 DB를 반환 (플랫폼/브라우저 캐시로 구버전 노출 방지) */
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const spec = CMS_PUBLIC_SPEC[slug];
  if (!spec) {
    return NextResponse.json({ error: "Unknown slug", data: null }, { status: 404 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role unavailable", data: null }, { status: 503 });
  }

  if (spec.kind === "single") {
    const { data, error } = await supabase.from(spec.table).select("*").maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message, data: null }, { status: 502 });
    }
    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  }

  let q = supabase.from(spec.table).select("*");
  for (const f of spec.filters ?? []) {
    q = q.eq(f.column, f.value);
  }
  for (const o of spec.orders ?? []) {
    q = q.order(o.column, { ascending: o.ascending ?? true });
  }
  if (spec.limit != null) q = q.limit(spec.limit);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message, data: null }, { status: 502 });
  }
  return NextResponse.json({ data: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}
