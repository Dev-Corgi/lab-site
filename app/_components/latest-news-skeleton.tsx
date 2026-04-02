import { Skeleton } from "@/components/ui/skeleton";

export function LatestNewsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-l-2 border-border pl-4">
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
