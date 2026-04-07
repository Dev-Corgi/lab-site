"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const supabase = createClient();

    if (mode === "signup") {
      // Check if user already exists in admin_users
      const { data: existing } = await supabase.from("admin_users").select("*").eq("email", email).single();
      
      if (existing) {
        setError("이미 등록된 이메일입니다.");
        setLoading(false);
        return;
      }

      // Create auth account
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Add to admin_users as pending approval
      const { error: insertError } = await supabase.from("admin_users").insert({
        email,
        is_super_admin: false,
        is_approved: false,
      });

      if (insertError) {
        setError("계정 생성 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      // Send notification email to super admins
      await fetch("/api/admin/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});

      setInfo("계정 생성 요청이 완료되었습니다. 슈퍼 관리자의 승인을 기다려주세요. 승인 후 songky@cau.ac.kr로 알림이 전송됩니다.");
      setMode("login");
      setLoading(false);
      return;
    }

    // Login mode
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    // Check if user is approved
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", email).single();

    if (!adminUser) {
      await supabase.auth.signOut();
      setError("관리자 권한이 없습니다.");
      setLoading(false);
      return;
    }

    if (!adminUser.is_approved) {
      await supabase.auth.signOut();
      setError("계정이 아직 승인되지 않았습니다. 슈퍼 관리자의 승인을 기다려주세요.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="3" fill="#ef4444" />
              <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" />
              <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
              <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Quantum Dynamics Lab</h1>
          <p className="text-sm text-gray-500 mt-1">관리자 로그인</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              {info}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            {loading ? (mode === "signup" ? "생성 중..." : "로그인 중...") : (mode === "signup" ? "계정 생성" : "로그인")}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}
            className="text-red-400/70 hover:text-red-400 transition-colors">
            {mode === "login" ? "관리자 계정 생성" : "로그인으로 돌아가기"}
          </button>
        </p>

        <p className="text-center text-xs text-gray-600 mt-4">
          © 2026 Quantum Dynamics Lab. Admin Panel.
        </p>
      </div>
    </div>
  );
}
