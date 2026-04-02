import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-2 pb-8">
        <Skeleton className="h-8 w-44" />
        <Separator />
      </div>
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-60 mb-1" />
              <Skeleton className="h-3 w-44" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
