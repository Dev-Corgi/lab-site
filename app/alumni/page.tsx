import { PageHeader } from "@/components/page-header";
import { User } from "lucide-react";
import { getAlumni } from "@/lib/supabase/queries";

interface AlumniMember {
  name: string;
  year: string;
  degree: string;
  current: string;
}

const defaultGrad: AlumniMember[] = [
  { name: "Dr. Elizabeth Moore", year: "2025", degree: "Ph.D. Graduate", current: "Postdoc at Princeton University" },
  { name: "Dr. James Wilson", year: "2025", degree: "Ph.D. Graduate", current: "Research Scientist at IBM Quantum" },
];
const defaultStaff: AlumniMember[] = [
  { name: "Dr. Robert Chang", year: "2023", degree: "Former Research Scientist", current: "Principal Scientist at Honeywell Quantum Solutions" },
];
const defaultInterns: AlumniMember[] = [
  { name: "Ethan Brooks", year: "2024", degree: "Former Undergraduate Intern", current: "PhD Student at Caltech" },
];

function toAlumni(a: any): AlumniMember {
  return { name: a.name, year: a.year || "", degree: a.degree || "", current: a.current_position || "" };
}

function AlumniRow({ member }: { member: AlumniMember }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a2e] shrink-0">
        <User className="h-6 w-6 text-gray-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">
          {member.name}
          <span className="text-xs text-yellow-500 ml-2">{member.year}</span>
        </p>
        <p className="text-xs text-gray-500">{member.degree}</p>
        <p className="text-xs text-blue-400 mt-0.5">Current: {member.current}</p>
      </div>
    </div>
  );
}

function AlumniSection({ title, members }: { title: string; members: AlumniMember[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-red-400 mb-2">{title}</h2>
      <div>
        {members.map((m) => (
          <AlumniRow key={m.name} member={m} />
        ))}
      </div>
    </div>
  );
}

export default async function AlumniPage() {
  const dbAlumni = await getAlumni();
  const hasDb = dbAlumni.length > 0;

  const graduateAlumni = hasDb ? dbAlumni.filter((a: any) => a.type === "graduate").map(toAlumni) : defaultGrad;
  const formerStaff = hasDb ? dbAlumni.filter((a: any) => a.type === "staff").map(toAlumni) : defaultStaff;
  const formerInterns = hasDb ? dbAlumni.filter((a: any) => a.type === "intern").map(toAlumni) : defaultInterns;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Alumni" breadcrumb="Alumni" />
      <div className="space-y-10">
        {graduateAlumni.length > 0 && <AlumniSection title="Graduate Alumni" members={graduateAlumni} />}
        {formerStaff.length > 0 && <AlumniSection title="Former Staff" members={formerStaff} />}
        {formerInterns.length > 0 && <AlumniSection title="Former Undergraduate Interns" members={formerInterns} />}
      </div>
    </div>
  );
}
