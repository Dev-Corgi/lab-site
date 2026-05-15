import { createServiceRoleClient } from "@/lib/supabase/service-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!slug || decodeURIComponent(slug).trim() === "") {
    return NextResponse.json({ error: "Missing slug", data: null }, { status: 400 });
  }

  const decoded = decodeURIComponent(slug).trim();
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role unavailable", data: null }, { status: 503 });
  }

  const { data, error } = await supabase.from("research_areas").select("*").eq("slug", decoded).maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message, data: null }, { status: 502 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found", data: null }, { status: 404 });
  }

  return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
}
