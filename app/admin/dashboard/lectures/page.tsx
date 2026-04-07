"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const empty = { title_en: "", title_kr: "", description: "", links: [] as { label: string; url: string }[], sort_order: 0 };

export default function LecturesManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("lectures").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const showMsg = (ok: boolean) => { setMsg(ok ? "저장되었습니다 ✓" : "저장 실패"); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = edit;
    if (id) {
      await supabase.from("lectures").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("lectures").insert({ ...rest, sort_order: items.length });
    }
    setSaving(false); setEdit(null); load(); showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("lectures").delete().eq("id", id);
    load();
  };

  const addLink = () => {
    if (edit) setEdit({ ...edit, links: [...(edit.links || []), { label: "", url: "" }] });
  };
  const updateLink = (i: number, field: string, value: string) => {
    if (edit) {
      const links = [...edit.links];
      links[i] = { ...links[i], [field]: value };
      setEdit({ ...edit, links });
    }
  };
  const removeLink = (i: number) => {
    if (edit) setEdit({ ...edit, links: edit.links.filter((_: any, idx: number) => idx !== i) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">강의 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}개 강의</p>
        </div>
        <button onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <Plus className="h-4 w-4" /> 강의 추가
        </button>
      </div>

      {msg && <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">{msg}</div>}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{item.title_en}</p>
              {item.title_kr && <p className="text-xs text-gray-500">{item.title_kr}</p>}
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              <div className="flex gap-2 mt-2">
                {(item.links || []).map((l: any, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400">{l.label}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEdit(item)} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 강의가 없습니다</p>}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{edit.id ? "강의 편집" : "강의 추가"}</h2>
              <button onClick={() => setEdit(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">강의명 (영문) <span className="text-red-400">*</span></label>
              <input type="text" value={edit.title_en} onChange={e => setEdit({ ...edit, title_en: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">강의명 (한글)</label>
              <input type="text" value={edit.title_kr} onChange={e => setEdit({ ...edit, title_kr: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">설명</label>
              <textarea rows={2} value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">관련 링크</label>
              <div className="space-y-2 mb-2">
                {(edit.links || []).map((l: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={l.label} onChange={e => updateLink(i, "label", e.target.value)} placeholder="라벨"
                      className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
                    <input type="url" value={l.url} onChange={e => updateLink(i, "url", e.target.value)} placeholder="https://..."
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
                    <button onClick={() => removeLink(i)} className="text-gray-500 hover:text-red-400 shrink-0"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={addLink} className="text-xs text-red-400 hover:text-red-300">+ 링크 추가</button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEdit(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !edit.title_en}
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
