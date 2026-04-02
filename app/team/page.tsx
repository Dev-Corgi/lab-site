import { PageHeader } from "@/components/page-header";
import { TeamSection } from "./_components/team-section";
import { LinkButton } from "@/components/link-button";
import { ArrowRight } from "lucide-react";

const pi = [
  {
    name: "Dr. James Mitchell",
    nameKr: "제임스 미첼",
    role: "Principal Investigator",
    badges: ["Department of Physics"],
  },
];

const graduateStudents = [
  { name: "Sarah Chen", nameKr: "사라 첸", role: "PhD Student", badges: ["NSF", "Quantum"] },
  { name: "Michael Rodriguez", nameKr: "마이클 로드리게스", role: "PhD Student", badges: ["DOE", "Theory"] },
  { name: "Emma Thompson", nameKr: "엠마 톰슨", role: "Masters Student", badges: ["Quantum"] },
  { name: "David Kim", nameKr: "데이비드 김", role: "Masters Student", badges: ["Condensed"] },
  { name: "Lisa Anderson", nameKr: "리사 앤더슨", role: "Masters Student", badges: ["Optics"] },
  { name: "Robert Zhang", nameKr: "로버트 장", role: "Masters Student", badges: ["NSF", "Theory"] },
  { name: "Jennifer Park", nameKr: "제니퍼 박", role: "Masters Student", badges: ["DOE", "Quantum"] },
  { name: "Thomas Lee", nameKr: "토마스 리", role: "Masters Student", badges: ["Condensed"] },
  { name: "Maria Garcia", nameKr: "마리아 가르시아", role: "PhD Student", badges: ["Optics"] },
  { name: "Daniel Wu", nameKr: "다니엘 우", role: "Masters Student", badges: ["Theory"] },
  { name: "Rachel Brown", nameKr: "레이첼 브라운", role: "Masters Student", badges: ["Quantum"] },
  { name: "Kevin Johnson", nameKr: "케빈 존슨", role: "Masters Student", badges: ["Condensed"] },
];

const staff = [
  { name: "Dr. Patricia Williams", nameKr: "패트리샤 윌리엄스", role: "Research Scientist" },
  { name: "Mark Davis", nameKr: "마크 데이비스", role: "Lab Manager" },
  { name: "Susan Martinez", nameKr: "수잔 마르티네스", role: "Administrative Coordinator" },
];

const interns = [
  { name: "Alex Turner", nameKr: "알렉스 터너", role: "Undergraduate intern" },
  { name: "Olivia Harris", nameKr: "올리비아 해리스", role: "Undergraduate intern" },
  { name: "Nathan Clark", nameKr: "네이선 클라크", role: "Undergraduate intern" },
  { name: "Sophia Lewis", nameKr: "소피아 루이스", role: "Undergraduate intern" },
  { name: "Ryan Walker", nameKr: "라이언 워커", role: "Undergraduate intern" },
  { name: "Emily Hall", nameKr: "에밀리 홀", role: "Undergraduate intern" },
  { name: "Christopher Allen", nameKr: "크리스토퍼 앨런", role: "Undergraduate intern" },
  { name: "Jessica Young", nameKr: "제시카 영", role: "Undergraduate intern" },
  { name: "Matthew King", nameKr: "매튜 킹", role: "Undergraduate intern" },
  { name: "Ashley Wright", nameKr: "애슐리 라이트", role: "Undergraduate intern" },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title="Our Team"
        breadcrumb="Team"
        description="Meet the members of Quantum Dynamics Lab at Stellar University."
      />
      <div className="space-y-12">
        <TeamSection title="Principal Investigator" members={pi} isPi />
        <TeamSection title="Graduate Students" members={graduateStudents} />
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
