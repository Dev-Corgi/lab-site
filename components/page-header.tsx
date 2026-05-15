import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="pb-8">
      <div className="text-sm text-muted-foreground mb-2">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        {breadcrumb && (
          <>
            <span className="mx-1.5">/</span>
            <span className="text-foreground/80">{breadcrumb}</span>
          </>
        )}
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
