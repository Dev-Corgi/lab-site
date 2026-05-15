import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ResearchAreaCardProps {
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  imageUrl?: string;
  slug?: string;
}

export function ResearchAreaCard({
  title,
  category,
  categoryColor,
  description,
  imageUrl,
  slug,
}: ResearchAreaCardProps) {
  const inner = (
    <>
      <div className="h-48 bg-sky-50 flex items-center justify-center">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted-foreground text-xs">Research Image</span>
        )}
      </div>
      <div className="p-6">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${categoryColor}`}>
          {category}
        </p>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
        <div className="mt-4 flex justify-center items-center gap-1 text-muted-foreground text-xs">
          {slug ? (
            <>
              <span className="text-primary font-medium">자세히</span>
              <ChevronRight className="h-4 w-4 text-primary" />
            </>
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
          )}
        </div>
      </div>
    </>
  );

  const className =
    "rounded-lg border border-border bg-card overflow-hidden transition-colors block shadow-sm shadow-slate-200/50 " +
    (slug ? "hover:bg-accent/30 hover:border-primary/25 cursor-pointer" : "hover:bg-muted/40");

  if (slug) {
    return (
      <Link href={`/research/${encodeURIComponent(slug)}`} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
