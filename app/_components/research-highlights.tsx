"use client";

import Link from "next/link";
import { Brain, Microscope, Dna, FlaskConical } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchCmsListWithAnonFallback } from "@/lib/cms-browser";

const defaultHighlights = [
  { title: "Quantum Computing & Algorithms", title_kr: "양자 컴퓨팅 및 알고리즘", description: "Developing novel quantum algorithms for optimization problems and exploring quantum machine learning applications.", description_kr: "최적화 문제를 위한 새로운 양자 알고리즘을 개발하고 양자 머신러닝 응용을 탐구합니다." },
  { title: "Topological Quantum Matter", title_kr: "위상 양자 물질", description: "Investigating exotic quantum states in topological materials and their potential for quantum information processing.", description_kr: "위상 물질의 특이한 양자 상태와 양자 정보 처리에의 잠재력을 연구합니다." },
  { title: "Superconductivity Research", title_kr: "초전도 연구", description: "Studying high-temperature superconductors and exploring mechanisms for room-temperature superconductivity.", description_kr: "고온 초전도체를 연구하고 실온 초전도의 메커니즘을 탐구합니다." },
  { title: "Quantum Optics & Photonics", title_kr: "양자 광학 및 광자학", description: "Exploring light-matter interactions at the quantum level and developing photonic quantum technologies.", description_kr: "양자 수준에서의 빛-물질 상호작용을 탐구하고 광자 양자 기술을 개발합니다." },
];

const icons = [Brain, Microscope, Dna, FlaskConical];

const HOME_HIGHLIGHT_LIMIT = 4;

function ResearchSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mx-auto max-w-xs mb-4" />
          <div className="h-4 bg-muted/60 rounded-lg animate-pulse mx-auto max-w-md" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-lg border border-border bg-muted/60 p-6 animate-pulse">
              <div className="h-8 w-8 bg-white/10 rounded mb-4" />
              <div className="h-5 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-muted/60 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 메인 연구 카드는 DB의 research_areas 상위 N개와 동일 소스(관리자「연구」메뉴) */
export function ResearchHighlights() {
  const { t, language } = useI18n();
  const [highlights, setHighlights] = useState(defaultHighlights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const rows = await fetchCmsListWithAnonFallback("research-areas", async () => {
        const supabase = createClient();
        const { data: fallbackRows, error } = await supabase
          .from("research_areas")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) console.error("[research_areas] 홈 하이라이트 anon 폴백 조회 실패:", error.message);
        return fallbackRows ?? [];
      });
      const top = Array.isArray(rows) ? rows.slice(0, HOME_HIGHLIGHT_LIMIT) : [];
      if (top.length > 0) {
        setHighlights(
          top.map((raw) => {
            const h = raw as Record<string, unknown>;
            return {
              ...h,
              title:
                language === "ko" && typeof h.title_kr === "string" && h.title_kr ? h.title_kr : String(h.title ?? ""),
              description:
                language === "ko" && typeof h.description_kr === "string" && h.description_kr
                  ? h.description_kr
                  : String(h.description ?? ""),
            };
          }) as typeof defaultHighlights,
        );
      } else {
        setHighlights(
          defaultHighlights.map((h) => ({
            ...h,
            title: language === "ko" ? h.title_kr : h.title,
            description: language === "ko" ? h.description_kr : h.description,
          })),
        );
      }
      setLoading(false);
    };
    loadData();
  }, [language]);

  if (loading) {
    return <ResearchSkeleton />;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            {t("연구 하이라이트", "Research Highlights")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("우리 연구실을 이끄는 4가지 핵심 연구 주제", "Four core research themes driving our lab")}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const raw = item as Record<string, unknown>;
            const href =
              typeof raw.slug === "string" && raw.slug ? `/research/${encodeURIComponent(raw.slug)}` : "/research";
            return (
              <Link
                key={raw.id != null ? String(raw.id) : `${item.title}-${i}`}
                href={href}
                className={i === 0 ? "lg:row-span-2" : ""}
              >
                <div className="h-full rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50 flex flex-col">
                  {(() => {
                    const Icon = icons[i % icons.length];
                    return <Icon className="h-8 w-8 text-primary/70 mb-4" />;
                  })()}
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
