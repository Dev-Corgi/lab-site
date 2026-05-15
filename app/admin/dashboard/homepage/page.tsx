"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function HomepageEditPage() {
  const [tab, setTab] = useState<"hero" | "highlights" | "supporters">("hero");
  const [hero, setHero] = useState({ id: "", main_title: "", subtitle: "", background_keywords: [] as string[] });
  const [kwText, setKwText] = useState("");
  const [researchAreasPreview, setResearchAreasPreview] = useState<any[]>([]);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<"supporter" | null>(null);

  const supabase = createClient();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const { data: h } = await supabase.from("homepage_hero").select("*").single();
    if (h) { setHero(h); setKwText((h.background_keywords || []).join("\n")); }
    const { data: areas } = await supabase.from("research_areas").select("*").order("sort_order");
    if (areas) setResearchAreasPreview(areas);
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

  const previewTop = researchAreasPreview.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">홈페이지</h1>
          <p className="text-sm text-gray-500 mt-1">홈페이지 콘텐츠를 편집합니다</p>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes("실패") ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-green-500/10 text-green-700 border border-green-500/30"}`}>
          {msg}
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${tab === t.key ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-muted-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">메인 타이틀 <span className="text-primary">*</span></label>
            <input type="text" value={hero.main_title} onChange={e => setHero({ ...hero, main_title: e.target.value })}
              className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">서브타이틀</label>
            <textarea rows={2} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">배경 키워드 (줄바꿈으로 구분)</label>
            <textarea rows={5} value={kwText} onChange={e => setKwText(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none font-mono"
              placeholder={"QUANTUM COMPUTING\nCONDENSED MATTER PHYSICS"} />
            <p className="text-[11px] text-gray-600 mt-1">한 줄에 하나씩 입력하세요</p>
          </div>
          <div className="flex justify-end">
            <button onClick={saveHero} disabled={saving}
              className="rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 px-5 py-2 text-sm font-medium text-primary-foreground transition-colors">
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      )}

      {tab === "highlights" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="text-sm text-gray-400 leading-relaxed space-y-2">
            <p>
              메인 페이지의 <span className="text-foreground font-medium">연구 하이라이트</span> 카드는{" "}
              <span className="text-foreground font-medium">연구 분야</span>(<code className="text-xs text-muted-foreground">research_areas</code>) 목록에서{" "}
              <span className="text-foreground font-medium">정렬 순서 기준 앞에서 4개</span>가 자동으로 표시됩니다.
            </p>
            <p className="text-gray-500 text-xs">
              예전에는 별도 테이블로 편집하던 항목과 달라, 이제 「연구」메뉴에서 연구 분야만 수정하면 메인·연구 페이지가 함께 반영됩니다.
            </p>
          </div>
          <Link
            href="/admin/dashboard/research"
            className="inline-flex rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
          >
            연구 분야 관리로 이동
          </Link>

          <div className="border-t border-border pt-5 space-y-3">
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">메인에 노출되는 상위 4개 (미리보기)</p>
            {previewTop.length === 0 ? (
              <p className="text-sm text-gray-600">등록된 연구 분야가 없습니다. 「연구」에서 추가하세요.</p>
            ) : (
              <ul className="space-y-2">
                {previewTop.map((a, i) => (
                  <li key={a.id} className="rounded-lg border border-border bg-white/2 px-3 py-2.5">
                    <span className="text-[11px] text-gray-500 mr-2">{i + 1}.</span>
                    <span className="text-sm text-foreground">{a.title}</span>
                    {a.category ? <span className="ml-2 text-[10px] text-primary/90 uppercase">{a.category}</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "supporters" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditItem({ name: "", sort_order: supporters.length }); setEditType("supporter"); }}
              className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors">
              <Plus className="h-4 w-4" /> 지원 기관 추가
            </button>
          </div>
          <div className="space-y-2">
            {supporters.map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <p className="text-sm text-foreground">{s.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditItem(s); setEditType("supporter"); }} className="text-gray-500 hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteSupporter(s.id)} className="text-gray-500 hover:text-primary"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editItem && editType === "supporter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              {editItem.id ? "기관 편집" : "기관 추가"}
            </h2>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">기관명</label>
              <input type="text" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setEditItem(null); setEditType(null); }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-gray-400 hover:text-foreground transition-colors">취소</button>
              <button onClick={saveSupporter} disabled={saving}
                className="rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors">
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
