import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedPublicationsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid gap-4 grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden bg-card">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-1.5" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
