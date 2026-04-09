"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultPubs = [
  { title: "Quantum error correction in topological qubits using machine learning...", authors: "Mitchell et al.", journal: "Nature Physics", year: "2026", link_url: "#" },
  { title: "Novel Majorana zero modes in hybrid superconductor-topological...", authors: "Chen et al.", journal: "Physical Review Letters", year: "2025", link_url: "#" },
  { title: "Room-temperature quantum coherence in diamond nitrogen-vacancy...", authors: "Rodriguez et al.", journal: "Science", year: "2025", link_url: "#" },
  { title: "Topological phase transitions in two-dimensional quantum materials...", authors: "Thompson et al.", journal: "Nature Materials", year: "2024", link_url: "#" },
];

function PubsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-40 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid gap-4 grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-white/5 overflow-hidden animate-pulse">
            <div className="aspect-4/3 bg-white/5" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedPublications() {
  const { t } = useI18n();
  const [publications, setPublications] = useState(defaultPubs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("publications").select("*").eq("is_featured", true).limit(4);
      if (data && data.length > 0) {
        setPublications(data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <PubsSkeleton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("주요 논문", "Featured Publications")}</h2>
        <Link href="/publications" className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300 transition-colors">
          {t("전체 보기", "View All")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-2">
        {publications.map((pub) => (
          <a
            key={pub.title}
            href={pub.link_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="rounded-lg border border-border overflow-hidden bg-card hover:bg-accent/50 transition-colors">
              <div className="aspect-4/3 bg-[#1a1a2e] flex items-center justify-center">
                {pub.image_url ? (
                  <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 text-xs">{t("논문 이미지", "Publication Image")}</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white leading-snug line-clamp-2">
                  {pub.title}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  {pub.authors}{pub.journal ? `, (${pub.year}), ${pub.journal}` : ""}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
