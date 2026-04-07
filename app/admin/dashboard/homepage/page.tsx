"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function HomepageEditPage() {
  const [tab, setTab] = useState<"hero" | "highlights" | "supporters">("hero");
  const [hero, setHero] = useState({ id: "", main_title: "", subtitle: "", background_keywords: [] as string[] });
  const [kwText, setKwText] = useState("");
  const [highlights, setHighlights] = useState<any[]>([]);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<"highlight" | "supporter" | null>(null);

  const supabase = createClient();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const { data: h } = await supabase.from("homepage_hero").select("*").single();
    if (h) { setHero(h); setKwText((h.background_keywords || []).join("\n")); }
    const { data: hl } = await supabase.from("research_highlights").select("*").order("sort_order");
    if (hl) setHighlights(hl);
    const { data: s } = await supabase.from("supporters").select("*").order("sort_order");
    if (s) setSupporters(s);
  };

  const showMsg = (ok: boolean) => {
    setMsg(ok ? "저장되었습니다 ✓" : "저장 실패");
    setTimeout(() => setMsg(""), 3000);
  };

  const saveHero = async () => {
    setSaving(true);
    const keywords = kwText.split("\n").map(k => k.trim()).filter(Boolean);
    const { error } = await supabase.from("homepage_hero")
      .update({ main_title: hero.main_title, subtitle: hero.subtitle, background_keywords: keywords, updated_at: new Date().toISOString() })
      .eq("id", hero.id);
    setSaving(false);
    showMsg(!error);
  };

  const saveHighlight = async () => {
    setSaving(true);
    if (editItem.id) {
      await supabase.from("research_highlights").update({ title: editItem.title, description: editItem.description, sort_order: editItem.sort_order }).eq("id", editItem.id);
    } else {
      await supabase.from("research_highlights").insert({ title: editItem.title, description: editItem.description, sort_order: highlights.length });
    }
    setSaving(false);
    setEditItem(null);
    setEditType(null);
    loadAll();
    showMsg(true);
  };

  const deleteHighlight = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("research_highlights").delete().eq("id", id);
    loadAll();
  };

  const saveSupporter = async () => {
    setSaving(true);
    if (editItem.id) {
      await supabase.from("supporters").update({ name: editItem.name, sort_order: editItem.sort_order }).eq("id", editItem.id);
    } else {
      await supabase.from("supporters").insert({ name: editItem.name, sort_order: supporters.length });
    }
    setSaving(false);
    setEditItem(null);
    setEditType(null);
    loadAll();
    showMsg(true);
  };

  const deleteSupporter = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("supporters").delete().eq("id", id);
    loadAll();
  };

  const tabs = [
    { key: "hero" as const, label: "히어로 섹션" },
    { key: "highlights" as const, label: "연구 하이라이트" },
    { key: "supporters" as const, label: "지원 기관" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">홈페이지</h1>
          <p className="text-sm text-gray-500 mt-1">홈페이지 콘텐츠를 편집합니다</p>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes("실패") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
          {msg}
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-white/5">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${tab === t.key ? "border-red-500 text-red-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">메인 타이틀 <span className="text-red-400">*</span></label>
            <input type="text" value={hero.main_title} onChange={e => setHero({ ...hero, main_title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">서브타이틀</label>
            <textarea rows={2} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">배경 키워드 (줄바꿈으로 구분)</label>
            <textarea rows={5} value={kwText} onChange={e => setKwText(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors resize-none font-mono"
              placeholder={"QUANTUM COMPUTING\nCONDENSED MATTER PHYSICS"} />
            <p className="text-[11px] text-gray-600 mt-1">한 줄에 하나씩 입력하세요</p>
          </div>
          <div className="flex justify-end">
            <button onClick={saveHero} disabled={saving}
              className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition-colors">
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      )}

      {tab === "highlights" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditItem({ title: "", description: "", sort_order: highlights.length }); setEditType("highlight"); }}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
              <Plus className="h-4 w-4" /> 하이라이트 추가
            </button>
          </div>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={h.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{i + 1}. {h.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{h.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditItem(h); setEditType("highlight"); }} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteHighlight(h.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "supporters" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditItem({ name: "", sort_order: supporters.length }); setEditType("supporter"); }}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
              <Plus className="h-4 w-4" /> 지원 기관 추가
            </button>
          </div>
          <div className="space-y-2">
            {supporters.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4 flex items-center justify-between">
                <p className="text-sm text-white">{s.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditItem(s); setEditType("supporter"); }} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteSupporter(s.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {editItem && editType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">
              {editType === "highlight" ? (editItem.id ? "하이라이트 편집" : "하이라이트 추가") : (editItem.id ? "기관 편집" : "기관 추가")}
            </h2>
            {editType === "highlight" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">제목</label>
                  <input type="text" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">설명</label>
                  <textarea rows={3} value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors resize-none" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">기관명</label>
                <input type="text" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setEditItem(null); setEditType(null); }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={editType === "highlight" ? saveHighlight : saveSupporter} disabled={saving}
                className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 text-sm font-medium text-white transition-colors">
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
