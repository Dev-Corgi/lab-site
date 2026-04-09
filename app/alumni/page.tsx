"use client";

import { PageHeader } from "@/components/page-header";
import { User } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

function AlumniRow({ member, currentLabel }: { member: AlumniMember; currentLabel: string }) {
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
        <p className="text-xs text-blue-400 mt-0.5">{currentLabel}: {member.current}</p>
      </div>
    </div>
  );
}

function AlumniSection({ title, members, currentLabel }: { title: string; members: AlumniMember[]; currentLabel: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-red-400 mb-2">{title}</h2>
      <div>
        {members.map((m) => (
          <AlumniRow key={m.name} member={m} currentLabel={currentLabel} />
        ))}
      </div>
    </div>
  );
}

function AlumniSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="space-y-10">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse mb-2" />
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-white/5 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-48" />
                    <div className="h-3 bg-white/5 rounded w-32" />
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

export default function AlumniPage() {
  const { t } = useI18n();
  const [graduateAlumni, setGraduateAlumni] = useState(defaultGrad);
  const [formerStaff, setFormerStaff] = useState(defaultStaff);
  const [formerInterns, setFormerInterns] = useState(defaultInterns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("alumni").select("*");
      
      if (data && data.length > 0) {
        setGraduateAlumni(data.filter((a: any) => a.type === "graduate").map(toAlumni));
        setFormerStaff(data.filter((a: any) => a.type === "staff").map(toAlumni));
        setFormerInterns(data.filter((a: any) => a.type === "intern").map(toAlumni));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <AlumniSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title={t("동문", "Alumni")} breadcrumb={t("동문", "Alumni")} />
      <div className="space-y-10">
        {graduateAlumni.length > 0 && (
          <AlumniSection 
            title={t("졸업생 동문", "Graduate Alumni")} 
            members={graduateAlumni} 
            currentLabel={t("현재", "Current")}
          />
        )}
        {formerStaff.length > 0 && (
          <AlumniSection 
            title={t("전직 스태프", "Former Staff")} 
            members={formerStaff} 
            currentLabel={t("현재", "Current")}
          />
        )}
        {formerInterns.length > 0 && (
          <AlumniSection 
            title={t("전직 학부 인턴", "Former Undergraduate Interns")} 
            members={formerInterns} 
            currentLabel={t("현재", "Current")}
          />
        )}
      </div>
    </div>
  );
}
