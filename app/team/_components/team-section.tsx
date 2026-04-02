import { MemberCard } from "./member-card";

interface Member {
  name: string;
  nameKr: string;
  role: string;
  badges?: string[];
}

interface TeamSectionProps {
  title: string;
  members: Member[];
  isPi?: boolean;
  columns?: number;
}

export function TeamSection({ title, members, isPi, columns = 5 }: TeamSectionProps) {
  const gridClass = isPi
    ? "flex flex-wrap gap-4"
    : columns === 3
    ? "grid gap-4 grid-cols-2 sm:grid-cols-3"
    : "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-red-400">{title}</h2>
      <div className={gridClass}>
        {members.map((m) => (
          <MemberCard key={m.name} {...m} isPi={isPi} />
        ))}
      </div>
    </div>
  );
}
