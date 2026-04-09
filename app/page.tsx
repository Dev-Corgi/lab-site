"use client";

import { HeroSection } from "./_components/hero-section";
import { ResearchHighlights } from "./_components/research-highlights";
import { LatestNews } from "./_components/latest-news";
import { FeaturedPublications } from "./_components/featured-publications";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultSupporters = [
  { name: "NSF" },
  { name: "DOE" },
  { name: "STELLAR U" },
];

export default function Home() {
  const { t } = useI18n();
  const [supporters, setSupporters] = useState(defaultSupporters);

  useEffect(() => {
    const loadSupporters = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("supporters").select("*");
      if (data && data.length > 0) {
        setSupporters(data);
      }
    };
    loadSupporters();
  }, []);

  return (
    <>
      <HeroSection />
      <ResearchHighlights />
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <LatestNews />
            <FeaturedPublications />
          </div>
        </div>
      </section>
      {/* Supported By section */}
      <section className="py-10 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-xs text-gray-600 text-center tracking-widest uppercase mb-4">{t("후원", "Supported by")}</p>
          <div className="flex items-center justify-center gap-8 opacity-40">
            {supporters.map((s: any) => (
              <div key={s.name} className="h-8 w-20 bg-gray-700 rounded flex items-center justify-center text-[10px] text-gray-400">
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
