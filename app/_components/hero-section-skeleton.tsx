import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center">
        <Skeleton className="h-12 w-[500px] max-w-full mb-4" />
        <Skeleton className="h-5 w-[280px] max-w-full mb-2" />
        <Skeleton className="h-4 w-[200px] max-w-full mb-10" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-44 rounded-full" />
        </div>
      </div>
    </section>
  );
}
