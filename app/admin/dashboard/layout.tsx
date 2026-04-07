"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "./_components/sidebar";
import { Menu, X } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/admin/login");
      else setChecking(false);
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-56 flex-col border-r border-white/5 bg-[#0d0d16] fixed inset-y-0 left-0 z-40">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-[#0d0d16] border-r border-white/5 flex flex-col">
            <Sidebar onLogout={handleLogout} onNav={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-12 bg-[#0d0d16] border-b border-white/5 flex items-center justify-between px-4">
        <span className="text-sm font-semibold text-white">Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400 hover:text-white">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-56 pt-12 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
