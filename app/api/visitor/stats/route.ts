import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const today = new Date();
    
    // Get daily stats (today)
    const { data: dailyData } = await supabase
      .from('visitor_stats')
      .select('visitor_count')
      .eq('visit_date', today.toISOString().split('T')[0])
      .single();

    // Get weekly stats (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weeklyData } = await supabase
      .from('visitor_stats')
      .select('visitor_count')
      .gte('visit_date', weekAgo.toISOString().split('T')[0])
      .lte('visit_date', today.toISOString().split('T')[0]);

    // Get monthly stats (last 30 days)
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const { data: monthlyData } = await supabase
      .from('visitor_stats')
      .select('visitor_count')
      .gte('visit_date', monthAgo.toISOString().split('T')[0])
      .lte('visit_date', today.toISOString().split('T')[0]);

    const dailyCount = dailyData?.visitor_count || 0;
    const weeklyCount = weeklyData?.reduce((sum, row) => sum + (row.visitor_count || 0), 0) || 0;
    const monthlyCount = monthlyData?.reduce((sum, row) => sum + (row.visitor_count || 0), 0) || 0;

    return NextResponse.json({
      daily: dailyCount,
      weekly: weeklyCount,
      monthly: monthlyCount,
      chartData: monthlyData || []
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json({ daily: 0, weekly: 0, monthly: 0, chartData: [] }, { status: 500 });
  }
}
