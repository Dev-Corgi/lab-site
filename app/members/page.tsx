"use client";

import { PageHeader } from "@/components/page-header";
import { TeamSection } from "./_components/team-section";
import { LinkButton } from "@/components/link-button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

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
    photoUrl: m.photo_url || "",
    currentPosition: m.current_position || ""
  };
}

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { t } = useI18n();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [{ data: membersData }, { data: alumniData }] = await Promise.all([
      supabase.from("team_members").select("*").order("sort_order"),
      supabase.from("alumni").select("*").order("year", { ascending: false })
    ]);
    
    if (membersData) setMembers(membersData);
    if (alumniData) setAlumni(alumniData);
    setLoading(false);
  };

  const hasDb = members.length > 0;
  const pi = hasDb ? members.filter((m: any) => m.role === "pi").map(toMember) : defaultPi;
  const phd = hasDb ? members.filter((m: any) => m.role === "phd").map(toMember) : [];
  const grad = hasDb ? members.filter((m: any) => m.role === "graduate").map(toMember) : defaultGrad;
  const staff = hasDb ? members.filter((m: any) => m.role === "staff").map(toMember) : defaultStaff;
  const undergrad = hasDb ? members.filter((m: any) => m.role === "intern").map(toMember) : defaultInterns;

  // Filter by category if specified
  const showProfessor = !category || category === "professor";
  const showPhd = !category || category === "phd";
  const showGraduate = !category || category === "graduate";
  const showUndergrad = !category || category === "undergrad";
  const showAlumni = category === "alumni";

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-4" />
        <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse mb-8" />
        <div className="space-y-12">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse mb-4" />
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/5 overflow-hidden animate-pulse">
                    <div className="aspect-3/4 bg-white/5" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-white/10 rounded" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title={t("구성원", "Members")}
        breadcrumb={t("구성원", "Members")}
        description={t(
          "Quantum Dynamics Lab의 구성원을 소개합니다.",
          "Meet the members of Quantum Dynamics Lab at Stellar University."
        )}
      />
      
      {showAlumni ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">{t("동문", "Alumni")}</h2>
          {alumni.length > 0 ? (
            <div className="space-y-3">
              {alumni.map((a) => (
                <div key={a.id} className="rounded-lg border border-white/5 bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-sm text-gray-500">{a.year} · {a.degree}</p>
                      {a.current_position && (
                        <p className="text-sm text-blue-400 mt-1">{a.current_position}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">{t("등록된 동문이 없습니다", "No alumni records")}</p>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {showProfessor && pi.length > 0 && (
            <TeamSection title={t("교수", "Professor")} members={pi} />
          )}
          {showPhd && phd.length > 0 && (
            <TeamSection title={t("박사과정", "Ph.D. Students")} members={phd} />
          )}
          {showGraduate && grad.length > 0 && (
            <TeamSection title={t("석사과정", "Graduate Students")} members={grad} />
          )}
          {showUndergrad && undergrad.length > 0 && (
            <TeamSection title={t("학부연구생", "Undergraduate Researchers")} members={undergrad} />
          )}
        </div>
      )}
    </div>
  );
}
