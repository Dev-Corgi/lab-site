import { User } from "lucide-react";

interface MemberCardProps {
  name: string;
  nameKr: string;
  role: string;
  badges?: string[];
  isPi?: boolean;
}

export function MemberCard({ name, nameKr, role, badges, isPi }: MemberCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-colors hover:bg-accent/50">
      {/* Photo placeholder */}
      <div className={`${isPi ? "h-40 w-40" : "aspect-[3/4]"} bg-[#1a1a2e] flex items-center justify-center`}>
        <User className={`${isPi ? "h-16 w-16" : "h-10 w-10"} text-gray-600`} />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-gray-500">{nameKr}</p>
        <p className="text-xs text-gray-400 mt-0.5">{role}</p>
        {badges && badges.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {badges.map((b) => (
              <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800/50">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
