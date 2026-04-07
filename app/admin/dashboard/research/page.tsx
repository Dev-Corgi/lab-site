"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { ImageUpload } from "../_components/image-upload";

const empty = { title: "", description: "", category: "", image_url: "", sort_order: 0 };

export default function ResearchManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("research_areas").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const showMsg = (ok: boolean) => { setMsg(ok ? "저장되었습니다 ✓" : "저장 실패"); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = edit;
    if (id) {
      await supabase.from("research_areas").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("research_areas").insert({ ...rest, sort_order: items.length });
    }
    setSaving(false); setEdit(null); load(); showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("research_areas").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">연구 분야 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}개 연구 분야</p>
        </div>
        <button onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <Plus className="h-4 w-4" /> 연구 분야 추가
        </button>
      </div>

      {msg && <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">{msg}</div>}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.category && <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 uppercase">{item.category}</span>}
              </div>
              <p className="text-sm font-medium text-white">{i + 1}. {item.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEdit(item)} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 연구 분야가 없습니다</p>}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{edit.id ? "연구 분야 편집" : "연구 분야 추가"}</h2>
              <button onClick={() => setEdit(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">제목 <span className="text-red-400">*</span></label>
              <input type="text" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">카테고리/태그</label>
              <input type="text" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })} placeholder="QUANTUM COMPUTING"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">상세 설명</label>
              <textarea rows={5} value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이미지</label>
              <ImageUpload
                value={edit.image_url || ""}
                onChange={(url) => setEdit({ ...edit, image_url: url })}
                folder="research-areas"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEdit(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !edit.title}
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
