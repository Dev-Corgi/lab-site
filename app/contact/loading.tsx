import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-2 pb-8">
        <Skeleton className="h-8 w-32" />
        <Separator />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Skeleton className="h-6 w-20 mb-4" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
}
