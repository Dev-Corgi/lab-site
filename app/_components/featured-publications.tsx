import Link from "next/link";
import { ArrowRight } from "lucide-react";

const publications = [
  {
    title: "Quantum error correction in topological qubits using machine learning...",
    authors: "Mitchell et al., (2026), Nature Physics",
    link: "#",
  },
  {
    title: "Novel Majorana zero modes in hybrid superconductor-topological...",
    authors: "Chen et al., (2025), Physical Review Letters",
    link: "#",
  },
  {
    title: "Room-temperature quantum coherence in diamond nitrogen-vacancy...",
    authors: "Rodriguez et al., (2025), Science",
    link: "#",
  },
  {
    title: "Topological phase transitions in two-dimensional quantum materials...",
    authors: "Thompson et al., (2024), Nature Materials",
    link: "#",
  },
];

export function FeaturedPublications() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Publications</h2>
        <Link href="/publications" className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300 transition-colors">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-2">
        {publications.map((pub) => (
          <a
            key={pub.title}
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="rounded-lg border border-border overflow-hidden bg-card hover:bg-accent/50 transition-colors">
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-[#1a1a2e] flex items-center justify-center">
                <span className="text-gray-600 text-xs">Publication Image</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white leading-snug line-clamp-2">
                  {pub.title}
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  {pub.authors}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
