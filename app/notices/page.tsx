"use client";

import { PageHeader } from "@/components/page-header";
import { Calendar, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

interface Notice {
  id: string;
  title_en: string;
  title_kr: string;
  content_en: string;
  content_kr: string;
  notice_type: "conference" | "seminar" | "general";
  event_date: string | null;
  is_pinned: boolean;
  created_at: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { language, t } = useI18n();
  const supabase = createClient();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("event_date", { ascending: false });
    
    if (data) setNotices(data);
    setLoading(false);
  };

  const filtered = filter === "all" 
    ? notices 
    : notices.filter(n => n.notice_type === filter);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ko: string; en: string }> = {
      conference: { ko: "학회", en: "Conference" },
      seminar: { ko: "세미나", en: "Seminar" },
      general: { ko: "일반", en: "General" }
    };
    return labels[type]?.[language] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      conference: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      seminar: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      general: "bg-gray-500/10 text-gray-400 border-gray-500/20"
    };
    return colors[type] || colors.general;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title={t("공지사항", "Notice")}
        breadcrumb={t("공지", "Notice")}
        description={t(
          "학회 일정 및 특별 세미나 공지",
          "Conference schedules and special seminar announcements"
        )}
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "conference", "seminar", "general"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === type
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "text-gray-500 border border-white/5 hover:text-gray-300"
            }`}
          >
            {type === "all" ? t("전체", "All") : getTypeLabel(type)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((notice) => (
            <div
              key={notice.id}
              className="rounded-lg border border-white/5 bg-card p-6 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {notice.is_pinned && (
                      <Pin className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs border ${getTypeColor(notice.notice_type)}`}>
                      {getTypeLabel(notice.notice_type)}
                    </span>
                    {notice.event_date && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {notice.event_date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {language === "ko" ? notice.title_kr : notice.title_en}
                  </h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">
                    {language === "ko" ? notice.content_kr : notice.content_en}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-12">
            {t("등록된 공지사항이 없습니다", "No notices available")}
          </p>
        )}
      </div>
    </div>
  );
}
