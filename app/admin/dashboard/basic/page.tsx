"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BasicSettingsPage() {
  const [form, setForm] = useState({
    id: "",
    lab_name_en: "",
    lab_name_kr: "",
    university: "",
    site_description: "",
    keywords: [] as string[],
  });
  const [keywordsText, setKeywordsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_settings").select("*").single().then(({ data }) => {
      if (data) {
        setForm(data);
        setKeywordsText((data.keywords || []).join(", "));
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    const supabase = createClient();
    const keywords = keywordsText.split(",").map((k: string) => k.trim()).filter(Boolean);
    const { error } = await supabase
      .from("site_settings")
      .update({ ...form, keywords, updated_at: new Date().toISOString() })
      .eq("id", form.id);
    setSaving(false);
    setMsg(error ? "저장 실패: " + error.message : "저장되었습니다 ✓");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">기본 정보</h1>
          <p className="text-sm text-gray-500 mt-1">사이트의 기본 정보를 수정합니다</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition-colors">
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {msg && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes("실패") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
          {msg}
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6 space-y-5">
        <Field label="연구실 명칭 (영문)" required value={form.lab_name_en}
          onChange={(v) => setForm({ ...form, lab_name_en: v })} />
        <Field label="연구실 명칭 (한글)" value={form.lab_name_kr}
          onChange={(v) => setForm({ ...form, lab_name_kr: v })} />
        <Field label="소속 대학교/기관" required value={form.university}
          onChange={(v) => setForm({ ...form, university: v })} />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            사이트 설명문 <span className="text-red-400">*</span>
          </label>
          <textarea rows={3} value={form.site_description}
            onChange={(e) => setForm({ ...form, site_description: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors resize-none" />
        </div>
        <Field label="주요 키워드 (쉼표로 구분)" value={keywordsText}
          onChange={setKeywordsText} placeholder="Quantum Computing, Condensed Matter, ..." />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors" />
    </div>
  );
}
