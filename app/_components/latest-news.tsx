import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestNews } from "@/lib/supabase/queries";

const defaultNews = [
  { date_display: "Mar 30th 2026", content: "Our breakthrough research on quantum error correction has been published in Nature Physics.", link_url: "#" },
  { date_display: "Mar 24th 2026", content: "New discovery in topological superconductors published in Physical Review Letters!", link_url: "#" },
  { date_display: "Feb 25th 2026", content: "Congratulations to Dr. Sarah Chen and Dr. Michael Rodriguez on completing their Ph.D.!", link_url: "" },
  { date_display: "Feb 5th 2026", content: "Congrats to Emma Thompson for the Best Poster Award at the APS March Meeting 2026! 🎉", link_url: "" },
  { date_display: "Jan 8th 2026", content: "Congratulations to Prof. James Mitchell for receiving the Stellar University Excellence in Research Award! 🎉", link_url: "" },
];

export async function LatestNews() {
  const dbNews = await getLatestNews(5);
  const newsItems = dbNews.length > 0 ? dbNews : defaultNews;
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
            <p className="text-xs text-red-400 mb-1">{item.date_display}</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.content}
              {item.link_url && (
                <a
                  href={item.link_url}
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
