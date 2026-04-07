"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, User } from "lucide-react";

export default function ApprovalsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/admin/login";
      return;
    }

    // Check if current user is super admin
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single();
    
    if (!adminUser || !adminUser.is_super_admin || !adminUser.is_approved) {
      window.location.href = "/admin/dashboard";
      return;
    }

    setCurrentUser(adminUser);

    // Load pending users
    const { data: pending } = await supabase.from("admin_users").select("*").eq("is_approved", false).order("created_at", { ascending: false });
    if (pending) setPendingUsers(pending);

    // Load all users
    const { data: all } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    if (all) setAllUsers(all);

    setLoading(false);
  };

  const handleApprove = async (userId: string, email: string) => {
    if (!confirm(`${email} 계정을 승인하시겠습니까?`)) return;

    const { error } = await supabase.from("admin_users")
      .update({ 
        is_approved: true, 
        approved_by: currentUser.id, 
        approved_at: new Date().toISOString() 
      })
      .eq("id", userId);

    if (error) {
      setMsg("승인 실패: " + error.message);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    // Send approval notification
    await fetch("/api/admin/notify-approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});

    setMsg(`${email} 계정이 승인되었습니다.`);
    setTimeout(() => setMsg(""), 3000);
    loadData();
  };

  const handleReject = async (userId: string, email: string) => {
    if (!confirm(`${email} 계정을 거부하시겠습니까? (계정이 삭제됩니다)`)) return;

    const { error } = await supabase.from("admin_users").delete().eq("id", userId);

    if (error) {
      setMsg("거부 실패: " + error.message);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    setMsg(`${email} 계정이 거부되었습니다.`);
    setTimeout(() => setMsg(""), 3000);
    loadData();
  };

  const toggleSuperAdmin = async (userId: string, email: string, currentStatus: boolean) => {
    if (!confirm(`${email}의 슈퍼 관리자 권한을 ${currentStatus ? "제거" : "부여"}하시겠습니까?`)) return;

    const { error } = await supabase.from("admin_users")
      .update({ is_super_admin: !currentStatus })
      .eq("id", userId);

    if (error) {
      setMsg("권한 변경 실패: " + error.message);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    setMsg(`${email}의 권한이 변경되었습니다.`);
    setTimeout(() => setMsg(""), 3000);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">관리자 승인</h1>
        <p className="text-sm text-gray-500 mt-1">슈퍼 관리자 전용 페이지</p>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">
          {msg}
        </div>
      )}

      {/* Pending Approvals */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-red-400 mb-4">승인 대기 중 ({pendingUsers.length})</h2>
        {pendingUsers.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6 text-center text-gray-500 text-sm">
            승인 대기 중인 계정이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingUsers.map((user) => (
              <div key={user.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <User className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      요청일: {new Date(user.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(user.id, user.email)}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-medium text-white transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> 승인
                  </button>
                  <button
                    onClick={() => handleReject(user.id, user.email)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-medium text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> 거부
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Users */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">전체 관리자 목록 ({allUsers.length})</h2>
        <div className="space-y-2">
          {allUsers.map((user) => (
            <div key={user.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.is_super_admin ? "bg-yellow-500/10" : "bg-blue-500/10"}`}>
                    <User className={`h-5 w-5 ${user.is_super_admin ? "text-yellow-400" : "text-blue-400"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{user.email}</p>
                      {user.is_super_admin && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-medium">
                          슈퍼 관리자
                        </span>
                      )}
                      {user.is_approved ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                          승인됨
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-500/10 text-gray-500">
                          대기중
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      가입: {new Date(user.created_at).toLocaleDateString("ko-KR")}
                      {user.approved_at && ` · 승인: ${new Date(user.approved_at).toLocaleDateString("ko-KR")}`}
                    </p>
                  </div>
                </div>
                {user.email !== currentUser.email && user.is_approved && (
                  <button
                    onClick={() => toggleSuperAdmin(user.id, user.email, user.is_super_admin)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
                  >
                    {user.is_super_admin ? "슈퍼 관리자 해제" : "슈퍼 관리자 지정"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
