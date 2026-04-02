import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newsItems = [
  {
    date: "Mar 30th 2026",
    text: "Our breakthrough research on quantum error correction has been published in Nature Physics, demonstrating a new approach to fault-tolerant quantum computing",
    link: "#",
  },
  {
    date: "Mar 24th 2026",
    text: "New discovery in topological superconductors published in Physical Review Letters! We identified novel Majorana zero modes with potential applications in quantum computing",
    link: "#",
  },
  {
    date: "Feb 25th 2026",
    text: "Congratulations to Dr. Sarah Chen and Dr. Michael Rodriguez on completing their Ph.D.! They will be joining MIT and Stanford as postdoctoral researchers.",
  },
  {
    date: "Feb 5th 2026",
    text: "Congrats to Emma Thompson for the Best Poster Award and David Kim for the Outstanding Research Award at the APS March Meeting 2026! 🎉",
  },
  {
    date: "Jan 8th 2026",
    text: "Congratulations to Prof. James Mitchell for receiving the Stellar University Excellence in Research Award in Physics! 🎉",
  },
];

export function LatestNews() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
        <Link href="/news" className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300 transition-colors">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-5">
        {newsItems.map((item, i) => (
          <div key={i} className="border-l-2 border-border pl-4">
            <p className="text-xs text-red-400 mb-1">{item.date}</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.text}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline ml-1"
                >
                  (link)
                </a>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
