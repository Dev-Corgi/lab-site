"use client";

import { PageHeader } from "@/components/page-header";
import { newsData } from "./_data/news-data";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function NewsItemRow({ item, linkText }: { item: { date_display: string; content: string; link_url?: string }; linkText: string }) {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
      <p className="text-xs text-red-400 mb-1">{item.date_display}</p>
      <p className="text-sm text-gray-300 leading-relaxed">
        {item.content}
        {item.link_url && (
          <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
            ({linkText})
          </a>
        )}
      </p>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="space-y-10">
        {[1, 2, 3].map((year) => (
          <div key={year}>
            <div className="h-7 w-24 bg-white/10 rounded-lg animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-l-2 border-white/5 pl-4 py-2 animate-pulse">
                  <div className="h-3 w-20 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { t, language } = useI18n();
  const [news, setNews] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<Map<string, any[]>>(new Map());
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("news").select("*");
      
      if (data && data.length > 0) {
        setNews(data);
        const g = new Map<string, any[]>();
        for (const n of data) {
          const y = n.year || new Date(n.date).getFullYear().toString();
          if (!g.has(y)) g.set(y, []);
          g.get(y)!.push(n);
        }
        setGrouped(g);
        setYears([...g.keys()].sort((a, b) => b.localeCompare(a)));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <NewsSkeleton />;
  }

  if (news.length > 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <PageHeader title={t("뉴스", "News")} breadcrumb={t("뉴스", "News")} />
        <div className="space-y-10">
          {years.map((year) => (
            <div key={year}>
              <h2 className="text-2xl font-bold text-white mb-4">{year}</h2>
              <div className="space-y-3">
                {grouped.get(year)!.map((item: any, i: number) => (
                  <NewsItemRow 
                    key={i} 
                    item={{
                      date_display: item.date_display,
                      content: language === "ko" && item.content_kr ? item.content_kr : item.content,
                      link_url: item.link_url
                    }} 
                    linkText={t("링크", "link")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to static data
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title={t("뉴스", "News")} breadcrumb={t("뉴스", "News")} />
      <div className="space-y-10">
        {newsData.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h2 className="text-2xl font-bold text-white mb-4">{yearGroup.year}</h2>
            <div className="space-y-3">
              {yearGroup.items.map((item, i) => (
                <NewsItemRow 
                  key={i} 
                  item={{ date_display: item.date, content: item.text, link_url: item.link }} 
                  linkText={t("링크", "link")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
