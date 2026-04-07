import { PageHeader } from "@/components/page-header";
import { PublicationItem } from "./_components/publication-item";
import { getPublications } from "@/lib/supabase/queries";

const defaultPubs = [
  { title: "Quantum error correction in topological qubits using machine learning algorithms", authors: "Mitchell JA, Chen S, Rodriguez M, Thompson E", journal: "Nature Physics", year: "2026", volume: "22: 145-152", linkUrl: "#", doiUrl: "#" },
  { title: "Novel Majorana zero modes in hybrid superconductor-topological insulator heterostructures", authors: "Chen S, Kim D, Anderson L, Mitchell JA", journal: "Physical Review Letters", year: "2026", volume: "126: 087001", linkUrl: "#", doiUrl: "#" },
  { title: "Room-temperature quantum coherence in diamond nitrogen-vacancy centers", authors: "Rodriguez M, Garcia M, Wu D, Mitchell JA", journal: "Science", year: "2025", volume: "378: 1234-1238", linkUrl: "#", doiUrl: "#" },
];

function toPub(p: any) {
  return { title: p.title, authors: p.authors, journal: p.journal, year: p.year, volume: p.volume_page || p.volume || "", linkUrl: p.link_url || p.linkUrl || "", doiUrl: p.doi_url || p.doiUrl || "" };
}

export default async function PublicationsPage() {
  const dbPubs = await getPublications();
  const publications = dbPubs.length > 0 ? dbPubs.map(toPub) : defaultPubs;
  const years = [...new Set(publications.map((p) => p.year))];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Publications" breadcrumb="Publications" />
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
