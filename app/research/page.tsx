"use client";

import { PageHeader } from "@/components/page-header";
import { ResearchAreaCard } from "./_components/research-area-card";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchCmsListWithAnonFallback } from "@/lib/cms-browser";

type ResearchAreaListItem = {
  id?: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  imageUrl?: string;
  slug?: string;
};

const DEFAULT_AREA_SEEDS = [
  { title: "Quantum Error Correction & Fault Tolerance", title_kr: "양자 오류 수정 및 내결함성", category: "QUANTUM COMPUTING", category_kr: "양자 컴퓨팅", categoryColor: "text-primary", description: "Developing novel quantum error correction codes and fault-tolerant quantum computing architectures for scalable quantum systems.", description_kr: "확장 가능한 양자 시스템을 위한 새로운 양자 오류 수정 코드와 내결함성 양자 컴퓨팅 아키텍처를 개발합니다." },
  { title: "Topological Quantum Materials", title_kr: "위상 양자 물질", category: "CONDENSED MATTER", category_kr: "응집 물질", categoryColor: "text-sky-700", description: "Investigating exotic quantum phases in topological insulators and superconductors with applications in quantum information.", description_kr: "양자 정보에 응용 가능한 위상 절연체와 초전도체의 특이한 양자 상을 연구합니다." },
  { title: "High-Temperature Superconductivity", title_kr: "고온 초전도", category: "SUPERCONDUCTIVITY", category_kr: "초전도", categoryColor: "text-primary", description: "Exploring mechanisms of high-temperature superconductivity and developing new materials for room-temperature applications.", description_kr: "고온 초전도의 메커니즘을 탐구하고 실온 응용을 위한 새로운 물질을 개발합니다." },
  { title: "Quantum Optics & Photonic Systems", title_kr: "양자 광학 및 광자 시스템", category: "QUANTUM OPTICS", category_kr: "양자 광학", categoryColor: "text-indigo-600", description: "Studying light-matter interactions at quantum scales and developing photonic quantum technologies for communication and computing.", description_kr: "양자 스케일에서의 빛-물질 상호작용을 연구하고 통신 및 컴퓨팅을 위한 광자 양자 기술을 개발합니다." },
] as const;

function fallbackAreasFromSeeds(language: string): ResearchAreaListItem[] {
  return DEFAULT_AREA_SEEDS.map((a) => ({
    title: language === "ko" ? a.title_kr : a.title,
    category: language === "ko" ? a.category_kr : a.category,
    categoryColor: a.categoryColor,
    description: language === "ko" ? a.description_kr : a.description,
  }));
}

function ResearchSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-32 bg-muted rounded-lg animate-pulse mb-8" />
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-lg border border-border bg-muted/60 p-6 animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mb-4" />
            <div className="h-6 bg-muted rounded mb-3" />
            <div className="h-4 bg-muted/60 rounded w-full mb-2" />
            <div className="h-4 bg-muted/60 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const { language, t } = useI18n();
  const [researchAreas, setResearchAreas] = useState<ResearchAreaListItem[]>(() => fallbackAreasFromSeeds("en"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAreas = async () => {
      const rows = await fetchCmsListWithAnonFallback("research-areas", async () => {
        const supabase = createClient();
        const { data: fallbackRows, error } = await supabase
          .from("research_areas")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) {
          console.error("[research_areas] anon 폴백 조회 실패:", error.message);
        }
        return fallbackRows ?? [];
      });
      if (Array.isArray(rows) && rows.length > 0) {
        setResearchAreas(
          rows.map((raw) => {
            const a = raw as Record<string, unknown>;
            return {
              ...a,
              categoryColor: "text-primary",
              imageUrl: typeof a.image_url === "string" ? a.image_url : undefined,
              slug: typeof a.slug === "string" && a.slug ? a.slug : undefined,
              title:
                language === "ko" && typeof a.title_kr === "string" && a.title_kr
                  ? a.title_kr
                  : String(a.title ?? ""),
              category:
                language === "ko" && typeof a.category_kr === "string" && a.category_kr
                  ? a.category_kr
                  : String(a.category ?? ""),
              description:
                language === "ko" && typeof a.description_kr === "string" && a.description_kr
                  ? a.description_kr
                  : String(a.description ?? ""),
            };
          }) as ResearchAreaListItem[],
        );
      } else {
        // Use default with language
        setResearchAreas(fallbackAreasFromSeeds(language));
      }
      setLoading(false);
    };
    loadAreas();
  }, [language]);

  if (loading) {
    return <ResearchSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title={t("연구", "Research")} breadcrumb={t("연구", "Research")} />
      <div className="grid gap-6 md:grid-cols-2">
        {researchAreas.map((area, i) => (
          <ResearchAreaCard key={area.id ?? `fallback-${area.title}-${i}`} {...area} slug={area.slug} />
        ))}
      </div>
    </div>
  );
}
