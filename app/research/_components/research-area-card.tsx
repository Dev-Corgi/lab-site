import { ChevronDown } from "lucide-react";

interface ResearchAreaCardProps {
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  imageUrl?: string;
}

export function ResearchAreaCard({
  title,
  category,
  categoryColor,
  description,
  imageUrl,
}: ResearchAreaCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:bg-accent/50 transition-colors">
      {/* Image */}
      <div className="h-48 bg-[#1a1a2e] flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 text-xs">Research Image</span>
        )}
      </div>
      <div className="p-6">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${categoryColor}`}>
          {category}
        </p>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        <div className="mt-4 flex justify-center">
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
