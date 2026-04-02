import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function MemberCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-2 pb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Separator />
      </div>
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-4 mb-10">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
