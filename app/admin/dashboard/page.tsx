"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Settings, Home, Users, FlaskConical, BookOpen,
  Newspaper, MapPin, UserCheck, BarChart3, Bell,
} from "lucide-react";

const sections = [
  { href: "/admin/dashboard/analytics", label: "방문자 통계", desc: "일간/주간/월간 통계", icon: BarChart3, table: "analytics" },
  { href: "/admin/dashboard/basic", label: "기본 정보", desc: "사이트명, 설명 등", icon: Settings, table: "site_settings" },
  { href: "/admin/dashboard/homepage", label: "홈페이지", desc: "히어로, 지원 기관", icon: Home, table: "homepage_hero" },
  { href: "/admin/dashboard/team", label: "구성원", desc: "", icon: Users, table: "team_members" },
  { href: "/admin/dashboard/research", label: "연구", desc: "", icon: FlaskConical, table: "research_areas" },
  { href: "/admin/dashboard/publications", label: "출판물", desc: "", icon: BookOpen, table: "publications" },
  { href: "/admin/dashboard/news", label: "뉴스", desc: "", icon: Newspaper, table: "news" },
  { href: "/admin/dashboard/notices", label: "공지사항", desc: "학회, 세미나 공지", icon: Bell, table: "notices" },
  { href: "/admin/dashboard/contact", label: "연락처", desc: "위치, 이메일", icon: MapPin, table: "contact_info" },
  { href: "/admin/dashboard/alumni", label: "동문", desc: "", icon: UserCheck, table: "alumni" },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();
    const tables = ["team_members", "research_areas", "publications", "news", "alumni", "notices"];
    tables.forEach(async (t) => {
      const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
      setCounts((prev) => ({ ...prev, [t]: count ?? 0 }));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-8">웹사이트 콘텐츠를 관리하세요</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sections.map((s) => {
          const Icon = s.icon;
          const count = counts[s.table];
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-border bg-card hover:border-primary/25 hover:bg-muted p-4 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  {count !== undefined && (
                    <p className="text-[11px] text-gray-500">{count}개 항목</p>
                  )}
                </div>
              </div>
              {s.desc && <p className="text-[11px] text-gray-600">{s.desc}</p>}
              <div className="mt-3 text-[11px] text-primary/80 group-hover:text-primary transition-colors">
                {["site_settings", "job_openings", "contact_info"].includes(s.table) ? "편집 →" : "관리 →"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
