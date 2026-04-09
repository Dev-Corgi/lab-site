"use client";

import { PageHeader } from "@/components/page-header";
import { PublicationItem } from "./_components/publication-item";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultPubs = [
  { title: "Quantum error correction in topological qubits using machine learning algorithms", authors: "Mitchell JA, Chen S, Rodriguez M, Thompson E", journal: "Nature Physics", year: "2026", volume: "22: 145-152", linkUrl: "#", doiUrl: "#" },
  { title: "Novel Majorana zero modes in hybrid superconductor-topological insulator heterostructures", authors: "Chen S, Kim D, Anderson L, Mitchell JA", journal: "Physical Review Letters", year: "2026", volume: "126: 087001", linkUrl: "#", doiUrl: "#" },
  { title: "Room-temperature quantum coherence in diamond nitrogen-vacancy centers", authors: "Rodriguez M, Garcia M, Wu D, Mitchell JA", journal: "Science", year: "2025", volume: "378: 1234-1238", linkUrl: "#", doiUrl: "#" },
];

function toPub(p: any) {
  return { title: p.title, authors: p.authors, journal: p.journal, year: p.year, volume: p.volume_page || p.volume || "", linkUrl: p.link_url || p.linkUrl || "", doiUrl: p.doi_url || p.doiUrl || "" };
}

function PublicationsSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-40 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="space-y-10">
        {[1, 2, 3].map((year) => (
          <div key={year}>
            <div className="h-6 w-20 bg-white/10 rounded-lg animate-pulse mb-2 border-b border-white/5 pb-2" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-3 animate-pulse">
                  <div className="h-5 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicationsPage() {
  const { t } = useI18n();
  const [publications, setPublications] = useState(defaultPubs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("publications").select("*");
      if (data && data.length > 0) {
        setPublications(data.map(toPub));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <PublicationsSkeleton />;
  }

  const years = [...new Set(publications.map((p) => p.year))];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title={t("논문", "Publications")} breadcrumb={t("논문", "Publications")} />
      <div className="space-y-10">
        {years.map((year) => (
          <div key={year}>
            <h2 className="text-xl font-bold text-white mb-2 border-b border-border/50 pb-2">{year}</h2>
            <div>
              {publications
                .filter((p) => p.year === year)
                .map((pub, i) => (
                  <PublicationItem key={i} {...pub} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
