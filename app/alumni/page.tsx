import { PageHeader } from "@/components/page-header";
import { User } from "lucide-react";

interface AlumniMember {
  name: string;
  year: string;
  degree: string;
  current: string;
}

const graduateAlumni: AlumniMember[] = [
  { name: "Dr. Elizabeth Moore", year: "2025", degree: "Ph.D. Graduate", current: "Postdoc at Princeton University" },
  { name: "Dr. James Wilson", year: "2025", degree: "Ph.D. Graduate", current: "Research Scientist at IBM Quantum" },
  { name: "Anna Schmidt", year: "2024", degree: "M.Sc. Graduate", current: "PhD Student at ETH Zurich, Switzerland" },
  { name: "Carlos Mendez", year: "2024", degree: "M.Sc. Graduate", current: "Quantum Engineer at Google" },
  { name: "Sophie Laurent", year: "2023", degree: "Ph.D. Graduate", current: "Assistant Professor at University of Toronto" },
  { name: "Benjamin Taylor", year: "2023", degree: "M.Sc. Graduate", current: "Research Associate at NIST" },
  { name: "Maya Patel", year: "2022", degree: "M.Sc. Graduate", current: "PhD Student at University of Cambridge, UK" },
  { name: "Lucas Chen", year: "2022", degree: "Ph.D. Graduate", current: "Senior Scientist at Intel Labs" },
  { name: "Isabella Rossi", year: "2021", degree: "M.Sc. Graduate", current: "Quantum Software Developer at Rigetti Computing" },
  { name: "Noah Anderson", year: "2021", degree: "M.Sc. Graduate", current: "Research Engineer at Microsoft Quantum" },
];

const formerStaff: AlumniMember[] = [
  { name: "Dr. Robert Chang", year: "2023", degree: "Former Research Scientist", current: "Principal Scientist at Honeywell Quantum Solutions" },
  { name: "Dr. Linda Martinez", year: "2021", degree: "Former Postdoctoral Researcher", current: "Assistant Professor at UC Berkeley" },
];

const formerInterns: AlumniMember[] = [
  { name: "Ethan Brooks", year: "2024", degree: "Former Undergraduate Intern", current: "PhD Student at Caltech" },
  { name: "Mia Johnson", year: "2023", degree: "Former Undergraduate Intern", current: "Graduate Student at Harvard University" },
  { name: "Liam Foster", year: "2022", degree: "Former Undergraduate Intern", current: "Research Assistant at Fermilab" },
  { name: "Ava Thompson", year: "2021", degree: "Former Undergraduate Intern", current: "PhD Student at University of Chicago" },
];

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

export default function AlumniPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Alumni" breadcrumb="Alumni" />
      <div className="space-y-10">
        <AlumniSection title="Graduate Alumni" members={graduateAlumni} />
        <AlumniSection title="Former Staff" members={formerStaff} />
        <AlumniSection title="Former Undergraduate Interns" members={formerInterns} />
      </div>
    </div>
  );
}
