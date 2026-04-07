"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Settings, Home, Users, FlaskConical, BookOpen, Wrench,
  GraduationCap, Newspaper, Briefcase, MapPin, UserCheck, Globe, LogOut, ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: Home },
  { href: "/admin/dashboard/basic", label: "기본 정보", icon: Settings },
  { href: "/admin/dashboard/homepage", label: "홈페이지", icon: Home },
  { href: "/admin/dashboard/team", label: "팀", icon: Users },
  { href: "/admin/dashboard/research", label: "연구", icon: FlaskConical },
  { href: "/admin/dashboard/publications", label: "출판물", icon: BookOpen },
  { href: "/admin/dashboard/tools", label: "도구", icon: Wrench },
  { href: "/admin/dashboard/lectures", label: "강의", icon: GraduationCap },
  { href: "/admin/dashboard/news", label: "뉴스", icon: Newspaper },
  { href: "/admin/dashboard/join", label: "채용", icon: Briefcase },
  { href: "/admin/dashboard/contact", label: "연락처", icon: MapPin },
  { href: "/admin/dashboard/alumni", label: "동문", icon: UserCheck },
];

export function Sidebar({ onLogout, onNav }: { onLogout: () => void; onNav?: () => void }) {
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single();
      if (adminUser?.is_super_admin && adminUser?.is_approved) {
        setIsSuperAdmin(true);
      }
    };
    checkSuperAdmin();
  }, []);

  return (
    <>
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" className="shrink-0">
            <circle cx="20" cy="20" r="3" fill="#ef4444" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-white">QD Lab</p>
            <p className="text-[10px] text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNav}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active ? "bg-red-500/10 text-red-400 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        {isSuperAdmin && (
          <>
            <div className="h-px bg-white/5 my-2" />
            <Link href="/admin/dashboard/approvals" onClick={onNav}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                pathname === "/admin/dashboard/approvals" ? "bg-yellow-500/10 text-yellow-400 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}>
              <ShieldCheck className="h-4 w-4 shrink-0" />
              관리자 승인
            </Link>
          </>
        )}
      </nav>
      <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
          <Globe className="h-4 w-4 shrink-0" />사이트 보기
        </Link>
        <button onClick={onLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full">
          <LogOut className="h-4 w-4 shrink-0" />로그아웃
        </button>
      </div>
    </>
  );
}
