import { HeroSectionSkeleton } from "./_components/hero-section-skeleton";
import { ResearchHighlightsSkeleton } from "./_components/research-highlights-skeleton";
import { LatestNewsSkeleton } from "./_components/latest-news-skeleton";
import { FeaturedPublicationsSkeleton } from "./_components/featured-publications-skeleton";

export default function Loading() {
  return (
    <>
      <HeroSectionSkeleton />
      <ResearchHighlightsSkeleton />
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <LatestNewsSkeleton />
            <FeaturedPublicationsSkeleton />
          </div>
        </div>
      </section>
    </>
  );
}
