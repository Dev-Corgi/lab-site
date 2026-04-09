import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const today = new Date().toISOString().split('T')[0];

    // Increment visitor count for today
    const { data, error } = await supabase.rpc('increment_visitor_count', {
      p_visit_date: today
    });

    if (error) {
      // If function doesn't exist, use upsert
      const { error: upsertError } = await supabase
        .from('visitor_stats')
        .upsert(
          { visit_date: today, visitor_count: 1 },
          { 
            onConflict: 'visit_date',
            ignoreDuplicates: false 
          }
        );

      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
