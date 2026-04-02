interface ToolLink {
  label: string;
  url: string;
}

interface ToolCardProps {
  title: string;
  description: string;
  links: ToolLink[];
}

export function ToolCard({ title, description, links }: ToolCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:bg-accent/50 transition-colors">
      {/* Image placeholder */}
      <div className="h-44 bg-[#1a1a2e] flex items-center justify-center">
        <span className="text-gray-600 text-xs">Tool Image</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{description}</p>
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
      </div>
    </div>
  );
}
