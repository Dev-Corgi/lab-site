"use client";

import { LinkButton } from "@/components/link-button";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultHero = {
  main_title: "Welcome to Quantum Dynamics Lab",
  main_title_kr: "양자역학 연구실에 오신 것을 환영합니다",
  subtitle: "Exploring the Quantum Realm, Shaping Tomorrow",
  subtitle_kr: "양자 세계를 탐구하고 미래를 형성합니다",
  background_keywords: ["QUANTUM COMPUTING", "CONDENSED MATTER PHYSICS"],
};

function HeroSkeleton() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className="h-12 md:h-16 bg-white/10 rounded-lg animate-pulse mx-auto max-w-2xl mb-4" />
        <div className="h-6 md:h-8 bg-white/10 rounded-lg animate-pulse mx-auto max-w-xl mb-2" />
        <div className="h-4 bg-white/5 rounded-lg animate-pulse mx-auto max-w-md mb-10" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 w-40 bg-white/10 rounded-full animate-pulse" />
          <div className="h-12 w-48 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  const { t, language } = useI18n();
  const [hero, setHero] = useState(defaultHero);
  const [uni, setUni] = useState("Stellar University");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const [{ data: heroData }, { data: settingsData }] = await Promise.all([
        supabase.from("homepage_hero").select("*").single(),
        supabase.from("site_settings").select("*").single()
      ]);
      
      if (heroData) {
        setHero({ ...defaultHero, ...heroData });
      }
      if (settingsData) {
        setUni(settingsData.university ?? "Stellar University");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <HeroSkeleton />;
  }

  const h = hero;
  const kw = h.background_keywords ?? defaultHero.background_keywords;
  
  const mainTitle = language === "ko" && h.main_title_kr ? h.main_title_kr : h.main_title;
  const subtitle = language === "ko" && h.subtitle_kr ? h.subtitle_kr : h.subtitle;

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background with overlay text effect */}
      {kw[0] && (
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden opacity-[0.06]">
          <div className="text-[8rem] md:text-[14rem] font-black text-white whitespace-nowrap tracking-wider leading-none">
            {kw[0]}
          </div>
        </div>
      )}
      {kw[1] && (
        <div className="absolute inset-0 flex items-end justify-center select-none pointer-events-none overflow-hidden opacity-[0.06]">
          <div className="text-[6rem] md:text-[10rem] font-black text-white whitespace-nowrap tracking-wider leading-none translate-y-8">
            {kw[1]}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          {mainTitle}
        </h1>
        <p className="text-lg md:text-xl text-red-400 mb-2">
          {subtitle}
        </p>
        <p className="text-gray-400 mb-10">{t("물리학과", "Department of Physics")}, {uni}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/members" size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full px-8">
            {t("구성원 보기", "Meet Our Team")}
          </LinkButton>
          <LinkButton href="/publications" variant="outline" size="lg" className="border-gray-500 text-gray-200 hover:bg-white/10 rounded-full px-8">
            {t("논문 보기", "View Publications")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
