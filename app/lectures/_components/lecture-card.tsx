interface LectureLink {
  label: string;
  url: string;
}

interface LectureCardProps {
  title: string;
  description?: string;
  links: LectureLink[];
}

export function LectureCard({
  title,
  description,
  links,
}: LectureCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:bg-accent/50 transition-colors">
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      )}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
