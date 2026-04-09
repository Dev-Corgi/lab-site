"use client";

import { PageHeader } from "@/components/page-header";
import { ResearchAreaCard } from "./_components/research-area-card";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultAreas = [
  { title: "Quantum Error Correction & Fault Tolerance", title_kr: "양자 오류 수정 및 내결함성", category: "QUANTUM COMPUTING", category_kr: "양자 컴퓨팅", categoryColor: "text-red-400", description: "Developing novel quantum error correction codes and fault-tolerant quantum computing architectures for scalable quantum systems.", description_kr: "확장 가능한 양자 시스템을 위한 새로운 양자 오류 수정 코드와 내결함성 양자 컴퓨팅 아키텍처를 개발합니다." },
  { title: "Topological Quantum Materials", title_kr: "위상 양자 물질", category: "CONDENSED MATTER", category_kr: "응집 물질", categoryColor: "text-blue-400", description: "Investigating exotic quantum phases in topological insulators and superconductors with applications in quantum information.", description_kr: "양자 정보에 응용 가능한 위상 절연체와 초전도체의 특이한 양자 상을 연구합니다." },
  { title: "High-Temperature Superconductivity", title_kr: "고온 초전도", category: "SUPERCONDUCTIVITY", category_kr: "초전도", categoryColor: "text-red-400", description: "Exploring mechanisms of high-temperature superconductivity and developing new materials for room-temperature applications.", description_kr: "고온 초전도의 메커니즘을 탐구하고 실온 응용을 위한 새로운 물질을 개발합니다." },
  { title: "Quantum Optics & Photonic Systems", title_kr: "양자 광학 및 광자 시스템", category: "QUANTUM OPTICS", category_kr: "양자 광학", categoryColor: "text-purple-400", description: "Studying light-matter interactions at quantum scales and developing photonic quantum technologies for communication and computing.", description_kr: "양자 스케일에서의 빛-물질 상호작용을 연구하고 통신 및 컴퓨팅을 위한 광자 양자 기술을 개발합니다." },
];

function ResearchSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-lg border border-white/5 bg-white/5 p-6 animate-pulse">
            <div className="h-4 w-32 bg-white/10 rounded mb-4" />
            <div className="h-6 bg-white/10 rounded mb-3" />
            <div className="h-4 bg-white/5 rounded w-full mb-2" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const { language, t } = useI18n();
  const [researchAreas, setResearchAreas] = useState(defaultAreas);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAreas = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("research_areas").select("*");
      if (data && data.length > 0) {
        setResearchAreas(data.map((a: any) => ({ 
          ...a, 
          categoryColor: "text-red-400", 
          imageUrl: a.image_url,
          title: language === "ko" && a.title_kr ? a.title_kr : a.title,
          category: language === "ko" && a.category_kr ? a.category_kr : a.category,
          description: language === "ko" && a.description_kr ? a.description_kr : a.description
        })));
      } else {
        // Use default with language
        setResearchAreas(defaultAreas.map(a => ({
          ...a,
          title: language === "ko" ? a.title_kr : a.title,
          category: language === "ko" ? a.category_kr : a.category,
          description: language === "ko" ? a.description_kr : a.description
        })));
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
        {researchAreas.map((area) => (
          <ResearchAreaCard key={area.title} {...area} />
        ))}
      </div>
    </div>
  );
}
