import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // In production, you would send an actual email here
    // For now, we'll just log it
    console.log(`[Admin Signup] New admin signup request: ${email}`);
    console.log(`[Admin Signup] Super admin (songky@cau.ac.kr) should be notified`);

    // TODO: Implement actual email sending using a service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Supabase Edge Functions with email service

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in notify-signup:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
