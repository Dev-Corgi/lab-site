"use client";

import Link from "next/link";
import { Brain, Microscope, Dna, FlaskConical } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultHighlights = [
  { title: "Quantum Computing & Algorithms", title_kr: "양자 컴퓨팅 및 알고리즘", description: "Developing novel quantum algorithms for optimization problems and exploring quantum machine learning applications.", description_kr: "최적화 문제를 위한 새로운 양자 알고리즘을 개발하고 양자 머신러닝 응용을 탐구합니다." },
  { title: "Topological Quantum Matter", title_kr: "위상 양자 물질", description: "Investigating exotic quantum states in topological materials and their potential for quantum information processing.", description_kr: "위상 물질의 특이한 양자 상태와 양자 정보 처리에의 잠재력을 연구합니다." },
  { title: "Superconductivity Research", title_kr: "초전도 연구", description: "Studying high-temperature superconductors and exploring mechanisms for room-temperature superconductivity.", description_kr: "고온 초전도체를 연구하고 실온 초전도의 메커니즘을 탐구합니다." },
  { title: "Quantum Optics & Photonics", title_kr: "양자 광학 및 광자학", description: "Exploring light-matter interactions at the quantum level and developing photonic quantum technologies.", description_kr: "양자 수준에서의 빛-물질 상호작용을 탐구하고 광자 양자 기술을 개발합니다." },
];

const icons = [Brain, Microscope, Dna, FlaskConical];

function ResearchSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mx-auto max-w-xs mb-4" />
          <div className="h-4 bg-white/5 rounded-lg animate-pulse mx-auto max-w-md" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-lg border border-white/5 bg-white/5 p-6 animate-pulse">
              <div className="h-8 w-8 bg-white/10 rounded mb-4" />
              <div className="h-5 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchHighlights() {
  const { t, language } = useI18n();
  const [highlights, setHighlights] = useState(defaultHighlights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("research_highlights").select("*");
      if (data && data.length > 0) {
        setHighlights(data.map((h: any) => ({
          ...h,
          title: language === "ko" && h.title_kr ? h.title_kr : h.title,
          description: language === "ko" && h.description_kr ? h.description_kr : h.description
        })));
      } else {
        setHighlights(defaultHighlights.map(h => ({
          ...h,
          title: language === "ko" ? h.title_kr : h.title,
          description: language === "ko" ? h.description_kr : h.description
        })));
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
          <h2 className="text-3xl font-bold text-white">
            {t("연구 하이라이트", "Research Highlights")}
          </h2>
          <p className="text-gray-400 mt-2">
            {t("우리 연구실을 이끄는 4가지 핵심 연구 주제", "Four core research themes driving our lab")}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <Link key={item.title} href="/research" className={i === 0 ? "lg:row-span-2" : ""}>
              <div className="h-full rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50 flex flex-col">
                {(() => { const Icon = icons[i % icons.length]; return <Icon className="h-8 w-8 text-gray-500 mb-4" />; })()}
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 flex-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
