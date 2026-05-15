"use client";

import { LinkButton } from "@/components/link-button";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchCmsSingleWithAnonFallback } from "@/lib/cms-browser";

const defaultHero = {
  main_title: "Welcome to Fiber Optics Labratory",
  main_title_kr: "양자역학 연구실에 오신 것을 환영합니다",
  subtitle: "Exploring the Quantum Realm, Shaping Tomorrow",
  subtitle_kr: "양자 세계를 탐구하고 미래를 형성합니다",
  background_keywords: ["QUANTUM COMPUTING", "CONDENSED MATTER PHYSICS"],
};

function HeroSkeleton() {
  return (
    <section className="relative min-h-88 md:min-h-104 py-24 md:py-36 overflow-hidden bg-sky-50">
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className="h-12 md:h-16 bg-muted rounded-lg animate-pulse mx-auto max-w-2xl mb-4" />
        <div className="h-6 md:h-8 bg-muted rounded-lg animate-pulse mx-auto max-w-xl mb-2" />
        <div className="h-4 bg-muted/80 rounded-lg animate-pulse mx-auto max-w-md mb-10" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 w-40 bg-muted rounded-full animate-pulse" />
          <div className="h-12 w-48 bg-muted/80 rounded-full animate-pulse" />
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
      const [heroData, settingsData] = await Promise.all([
        fetchCmsSingleWithAnonFallback("homepage-hero", async () => {
          const { data } = await supabase.from("homepage_hero").select("*").maybeSingle();
          return data ?? null;
        }),
        fetchCmsSingleWithAnonFallback("site-settings", async () => {
          const { data } = await supabase.from("site_settings").select("*").maybeSingle();
          return data ?? null;
        }),
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

  const mainTitle = language === "ko" && h.main_title_kr ? h.main_title_kr : h.main_title;
  const subtitle = language === "ko" && h.subtitle_kr ? h.subtitle_kr : h.subtitle;

  return (
    <section className="relative isolate min-h-88 md:min-h-104 py-24 md:py-36 overflow-hidden bg-sky-50">
      {/* Photo: bundle sits center-right — bias position so headline area stays calmer */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-position-[62%_48%] sm:bg-position-[72%_42%] md:bg-position-[78%_40%] lg:bg-position-[82%_38%]"
        style={{ backgroundImage: "url(/philip-oroni-sZjF5GR_ZVI-unsplash.jpg)" }}
      />
      {/* Readability: stronger wash on the left (text block), open to the photo on the right */}
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-background from-[-5%] via-background/88 via-38% to-transparent to-92%" />
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-b from-background/15 via-transparent to-background" />

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          {mainTitle}
        </h1>
        <p className="text-lg md:text-xl text-primary font-medium mb-2">
          {subtitle}
        </p>
        <p className="text-muted-foreground mb-10">{t("물리학과", "Department of Physics")}, {uni}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/members" size="lg" className="rounded-full px-8 shadow-md shadow-sky-200/60">
            {t("구성원 보기", "Meet Our Team")}
          </LinkButton>
          <LinkButton href="/publications" variant="outline" size="lg" className="rounded-full px-8 border-border bg-background/80 hover:bg-muted">
            {t("논문 보기", "View Publications")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
