import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // In production, you would send an actual email here
    console.log(`[Admin Approval] Admin account approved: ${email}`);
    console.log(`[Admin Approval] Notification should be sent to songky@cau.ac.kr`);

    // TODO: Implement actual email sending
    // Example email content:
    // To: songky@cau.ac.kr
    // Subject: 관리자 계정 승인 완료
    // Body: ${email} 계정이 승인되었습니다.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in notify-approval:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
