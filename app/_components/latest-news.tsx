"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultNews = [
  { date_display: "Mar 30th 2026", content: "Our breakthrough research on quantum error correction has been published in Nature Physics.", content_kr: "양자 오류 수정에 대한 우리의 획기적인 연구가 Nature Physics에 게재되었습니다.", link_url: "#" },
  { date_display: "Mar 24th 2026", content: "New discovery in topological superconductors published in Physical Review Letters!", content_kr: "위상 초전도체의 새로운 발견이 Physical Review Letters에 게재되었습니다!", link_url: "#" },
  { date_display: "Feb 25th 2026", content: "Congratulations to Dr. Sarah Chen and Dr. Michael Rodriguez on completing their Ph.D.!", content_kr: "Sarah Chen 박사와 Michael Rodriguez 박사의 박사 학위 수여를 축하합니다!", link_url: "" },
  { date_display: "Feb 5th 2026", content: "Congrats to Emma Thompson for the Best Poster Award at the APS March Meeting 2026! 🎉", content_kr: "Emma Thompson의 APS March Meeting 2026 최우수 포스터상 수상을 축하합니다! 🎉", link_url: "" },
  { date_display: "Jan 8th 2026", content: "Congratulations to Prof. James Mitchell for receiving the Stellar University Excellence in Research Award! 🎉", content_kr: "James Mitchell 교수의 스텔라 대학 연구 우수상 수상을 축하합니다! 🎉", link_url: "" },
];

function NewsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-l-2 border-white/5 pl-4 animate-pulse">
            <div className="h-3 w-20 bg-white/10 rounded mb-2" />
            <div className="h-4 bg-white/5 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LatestNews() {
  const { t, language } = useI18n();
  const [newsItems, setNewsItems] = useState(defaultNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("news").select("*").order("date", { ascending: false }).limit(5);
      if (data && data.length > 0) {
        setNewsItems(data.map((n: any) => ({
          ...n,
          content: language === "ko" && n.content_kr ? n.content_kr : n.content
        })));
      } else {
        setNewsItems(defaultNews.map(n => ({
          ...n,
          content: language === "ko" ? n.content_kr : n.content
        })));
      }
      setLoading(false);
    };
    loadData();
  }, [language]);

  if (loading) {
    return <NewsSkeleton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("최신 뉴스", "Latest News")}</h2>
        <Link href="/news" className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300 transition-colors">
          {t("전체 보기", "View All")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-5">
        {newsItems.map((item, i) => (
          <div key={i} className="border-l-2 border-border pl-4">
            <p className="text-xs text-red-400 mb-1">{item.date_display}</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.content}
              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline ml-1"
                >
                  ({t("링크", "link")})
                </a>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
