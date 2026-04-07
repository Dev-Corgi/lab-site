import { PageHeader } from "@/components/page-header";
import { TeamSection } from "./_components/team-section";
import { LinkButton } from "@/components/link-button";
import { ArrowRight } from "lucide-react";
import { getTeamMembers, getSiteSettings } from "@/lib/supabase/queries";

const defaultPi = [{ name: "Dr. James Mitchell", nameKr: "제임스 미첼", role: "Principal Investigator", badges: ["Department of Physics"] }];
const defaultGrad = [
  { name: "Sarah Chen", nameKr: "사라 첸", role: "PhD Student", badges: ["NSF", "Quantum"] },
  { name: "Michael Rodriguez", nameKr: "마이클 로드리게스", role: "PhD Student", badges: ["DOE", "Theory"] },
  { name: "Emma Thompson", nameKr: "엠마 톰슨", role: "Masters Student", badges: ["Quantum"] },
];
const defaultStaff = [{ name: "Dr. Patricia Williams", nameKr: "패트리샤 윌리엄스", role: "Research Scientist" }];
const defaultInterns = [{ name: "Alex Turner", nameKr: "알렉스 터너", role: "Undergraduate intern" }];

function toMember(m: any) {
  return { 
    name: m.name_en || m.name, 
    nameKr: m.name_kr || m.nameKr || "", 
    role: m.title || m.role || "", 
    badges: m.badges || [],
    photoUrl: m.photo_url || ""
  };
}

export default async function TeamPage() {
  const [dbMembers, settings] = await Promise.all([getTeamMembers(), getSiteSettings()]);
  const hasDb = dbMembers.length > 0;

  const pi = hasDb ? dbMembers.filter((m: any) => m.role === "pi").map(toMember) : defaultPi;
  const grad = hasDb ? dbMembers.filter((m: any) => m.role === "graduate").map(toMember) : defaultGrad;
  const staff = hasDb ? dbMembers.filter((m: any) => m.role === "staff").map(toMember) : defaultStaff;
  const interns = hasDb ? dbMembers.filter((m: any) => m.role === "intern").map(toMember) : defaultInterns;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title="Our Team"
        breadcrumb="Team"
        description={`Meet the members of ${settings?.lab_name_en || "Quantum Dynamics Lab"} at ${settings?.university || "Stellar University"}.`}
      />
      <div className="space-y-12">
        <TeamSection title="Principal Investigator" members={pi} isPi />
        <TeamSection title="Graduate Students" members={grad} />
        <TeamSection title="Staff" members={staff} columns={3} />
        <TeamSection title="Undergraduate Interns" members={interns} />
      </div>
      <div className="mt-10">
        <LinkButton href="/alumni" variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/5">
          View Alumni <ArrowRight className="ml-1 h-4 w-4" />
        </LinkButton>
      </div>
    </div>
  );
}
