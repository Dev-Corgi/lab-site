import { ExternalLink } from "lucide-react";

interface PublicationItemProps {
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume?: string;
  linkUrl?: string;
  doiUrl?: string;
}

export function PublicationItem({
  title,
  authors,
  journal,
  year,
  volume,
  linkUrl,
  doiUrl,
}: PublicationItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border/50">
      {/* Thumbnail placeholder */}
      <div className="hidden sm:flex shrink-0 w-16 h-16 rounded bg-[#1a1a2e] items-center justify-center">
        <span className="text-gray-700 text-[8px]">IMG</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white leading-snug">{title}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{authors}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="italic">{journal}</span>
          {" "}({year}){volume ? `, ${volume}` : ""}
        </p>
        {(linkUrl || doiUrl) && (
          <div className="flex gap-3 mt-1.5">
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Link
              </a>
            )}
            {doiUrl && (
              <a
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                DOI
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
