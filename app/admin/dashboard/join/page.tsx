"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function JoinManagePage() {
  const [form, setForm] = useState<any>({
    id: "", intro_text: "",
    postdoc_recruiting: true, postdoc_requirements: "", postdoc_benefits: "", postdoc_how_to_apply: "",
    graduate_recruiting: true, graduate_requirements: "", graduate_benefits: "", graduate_how_to_apply: "",
    intern_recruiting: true, intern_requirements: "", intern_how_to_apply: "",
  });
  const [openSection, setOpenSection] = useState<string | null>("postdoc");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("job_openings").select("*").single().then(({ data }) => {
      if (data) setForm(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, external_links, ...rest } = form;
    const { error } = await supabase.from("job_openings").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    setSaving(false);
    setMsg(error ? "저장 실패" : "저장되었습니다 ✓");
    setTimeout(() => setMsg(""), 3000);
  };

  const toggle = (s: string) => setOpenSection(openSection === s ? null : s);

  const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors resize-none";

  const Section = ({ id, label, recruitingKey, reqKey, benefitsKey, applyKey }: {
    id: string; label: string; recruitingKey: string; reqKey: string; benefitsKey?: string; applyKey: string;
  }) => (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0d0d18] hover:bg-[#0f0f1c] transition-colors">
        <span className="text-sm font-medium text-white">{openSection === id ? "▼" : "▶"} {label}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${form[recruitingKey] ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-500"}`}>
          {form[recruitingKey] ? "모집중" : "모집마감"}
        </span>
      </button>
      {openSection === id && (
        <div className="px-5 py-4 space-y-4 bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-300">모집 여부:</label>
            <select value={form[recruitingKey] ? "true" : "false"} onChange={e => setForm({ ...form, [recruitingKey]: e.target.value === "true" })}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none">
              <option value="true">모집중</option>
              <option value="false">모집마감</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">자격 요건</label>
            <textarea rows={3} value={form[reqKey]} onChange={e => setForm({ ...form, [reqKey]: e.target.value })} className={inputCls} />
          </div>
          {benefitsKey && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">제공 사항</label>
              <textarea rows={3} value={form[benefitsKey]} onChange={e => setForm({ ...form, [benefitsKey]: e.target.value })} className={inputCls} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">지원 방법</label>
            <textarea rows={3} value={form[applyKey]} onChange={e => setForm({ ...form, [applyKey]: e.target.value })} className={inputCls} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">채용 정보</h1>
          <p className="text-sm text-gray-500 mt-1">채용 및 모집 정보를 수정합니다</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition-colors">
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {msg && <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes("실패") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>{msg}</div>}

      <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-1.5">연구실 소개문</label>
        <textarea rows={2} value={form.intro_text} onChange={e => setForm({ ...form, intro_text: e.target.value })} className={inputCls} />
      </div>

      <div className="space-y-3">
        <Section id="postdoc" label="박사후 연구원" recruitingKey="postdoc_recruiting" reqKey="postdoc_requirements" benefitsKey="postdoc_benefits" applyKey="postdoc_how_to_apply" />
        <Section id="graduate" label="대학원생" recruitingKey="graduate_recruiting" reqKey="graduate_requirements" benefitsKey="graduate_benefits" applyKey="graduate_how_to_apply" />
        <Section id="intern" label="학부 인턴" recruitingKey="intern_recruiting" reqKey="intern_requirements" applyKey="intern_how_to_apply" />
      </div>
    </div>
  );
}
