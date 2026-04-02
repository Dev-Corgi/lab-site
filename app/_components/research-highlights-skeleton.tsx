import { Skeleton } from "@/components/ui/skeleton";

export function ResearchHighlightsSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-60 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <Skeleton className="h-8 w-8 mb-4 rounded" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
