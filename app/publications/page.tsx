import { PageHeader } from "@/components/page-header";
import { PublicationItem } from "./_components/publication-item";

const publications = [
  { title: "Quantum error correction in topological qubits using machine learning algorithms", authors: "Mitchell JA, Chen S, Rodriguez M, Thompson E", journal: "Nature Physics", year: "2026", volume: "22: 145-152", linkUrl: "#", doiUrl: "#" },
  { title: "Novel Majorana zero modes in hybrid superconductor-topological insulator heterostructures", authors: "Chen S, Kim D, Anderson L, Mitchell JA", journal: "Physical Review Letters", year: "2026", volume: "126: 087001", linkUrl: "#", doiUrl: "#" },
  { title: "Room-temperature quantum coherence in diamond nitrogen-vacancy centers", authors: "Rodriguez M, Garcia M, Wu D, Mitchell JA", journal: "Science", year: "2025", volume: "378: 1234-1238", linkUrl: "#", doiUrl: "#" },
  { title: "Topological phase transitions in two-dimensional quantum materials", authors: "Thompson E, Zhang R, Park J, Mitchell JA", journal: "Nature Materials", year: "2025", volume: "24: 567-573", linkUrl: "#", doiUrl: "#" },
  { title: "High-temperature superconductivity in cuprate-based heterostructures", authors: "Lee T, Brown R, Johnson K, Mitchell JA", journal: "Nature", year: "2025", volume: "615: 234-239", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum entanglement in photonic crystal cavities for quantum computing", authors: "Anderson L, Chen S, Rodriguez M", journal: "Physical Review X", year: "2024", volume: "14: 021045", linkUrl: "#", doiUrl: "#" },
  { title: "Spin-orbit coupling effects in topological insulators", authors: "Kim D, Thompson E, Garcia M, Mitchell JA", journal: "Physical Review B", year: "2024", volume: "109: 195401", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum simulation of many-body physics using ultracold atoms", authors: "Zhang R, Wu D, Brown R, Mitchell JA", journal: "Reviews of Modern Physics", year: "2024", volume: "96: 015001", linkUrl: "#", doiUrl: "#" },
  { title: "Topological superconductivity in semiconductor nanowires", authors: "Park J, Lee T, Johnson K, Mitchell JA", journal: "Nature Physics", year: "2023", volume: "19: 892-897", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum dots for single-photon sources in quantum communication", authors: "Garcia M, Anderson L, Chen S", journal: "Applied Physics Letters", year: "2023", volume: "122: 141102", linkUrl: "#", doiUrl: "#" },
  { title: "Fractional quantum Hall effect in graphene heterostructures", authors: "Rodriguez M, Kim D, Thompson E, Mitchell JA", journal: "Physical Review Letters", year: "2023", volume: "130: 126801", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum algorithms for optimization problems in condensed matter physics", authors: "Chen S, Zhang R, Wu D, Mitchell JA", journal: "Quantum", year: "2022", volume: "6: 745", linkUrl: "#", doiUrl: "#" },
  { title: "Superconducting qubits with enhanced coherence times", authors: "Thompson E, Park J, Lee T, Mitchell JA", journal: "npj Quantum Information", year: "2022", volume: "8: 89", linkUrl: "#", doiUrl: "#" },
  { title: "Topological photonics for robust quantum information processing", authors: "Anderson L, Brown R, Johnson K, Mitchell JA", journal: "Nature Photonics", year: "2022", volume: "16: 789-795", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum phase transitions in strongly correlated electron systems", authors: "Kim D, Garcia M, Rodriguez M, Mitchell JA", journal: "Physical Review B", year: "2021", volume: "104: 245123", linkUrl: "#", doiUrl: "#" },
  { title: "Majorana fermions in topological superconductors: theory and experiment", authors: "Mitchell JA, Chen S, Thompson E", journal: "Reports on Progress in Physics", year: "2021", volume: "84: 106501", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum computing with trapped ions: recent advances", authors: "Zhang R, Anderson L, Wu D, Mitchell JA", journal: "Reviews of Modern Physics", year: "2020", volume: "92: 025001", linkUrl: "#", doiUrl: "#" },
  { title: "Topological insulators and topological superconductors", authors: "Rodriguez M, Park J, Lee T, Mitchell JA", journal: "Reviews of Modern Physics", year: "2020", volume: "92: 015006", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum optics with artificial atoms in photonic crystals", authors: "Thompson E, Kim D, Brown R, Mitchell JA", journal: "Nature Physics", year: "2019", volume: "15: 1168-1174", linkUrl: "#", doiUrl: "#" },
  { title: "Quantum many-body physics in ultracold atomic gases", authors: "Garcia M, Chen S, Johnson K, Mitchell JA", journal: "Reviews of Modern Physics", year: "2019", volume: "91: 041001", linkUrl: "#", doiUrl: "#" },
];

export default function PublicationsPage() {
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
