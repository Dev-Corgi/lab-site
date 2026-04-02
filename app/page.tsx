import { HeroSection } from "./_components/hero-section";
import { ResearchHighlights } from "./_components/research-highlights";
import { LatestNews } from "./_components/latest-news";
import { FeaturedPublications } from "./_components/featured-publications";

export default function Home() {
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
          <p className="text-xs text-gray-600 text-center tracking-widest uppercase mb-4">Supported by</p>
          <div className="flex items-center justify-center gap-8 opacity-40">
            <div className="h-8 w-20 bg-gray-700 rounded flex items-center justify-center text-[10px] text-gray-400">NSF</div>
            <div className="h-8 w-20 bg-gray-700 rounded flex items-center justify-center text-[10px] text-gray-400">DOE</div>
            <div className="h-8 w-24 bg-gray-700 rounded flex items-center justify-center text-[10px] text-gray-400">STELLAR U</div>
          </div>
        </div>
      </section>
    </>
  );
}
