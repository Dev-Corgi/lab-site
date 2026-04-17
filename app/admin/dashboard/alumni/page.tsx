"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X, User } from "lucide-react";
import { ImageUpload } from "../_components/image-upload";

const TYPES = [
  { value: "graduate", label: "졸업생" },
  { value: "staff", label: "전 연구원" },
  { value: "intern", label: "전 인턴" },
];
const TYPE_LABELS: Record<string, string> = { graduate: "졸업생", staff: "전 연구원", intern: "전 인턴" };

const empty = { name: "", type: "graduate", year: "", degree: "", current_position: "", photo_url: "", sort_order: 0 };

export default function AlumniManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("alumni").select("*").order("year", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const filtered = filterType === "all" ? items : items.filter(a => a.type === filterType);

  const showMsg = (ok: boolean) => { setMsg(ok ? "저장되었습니다 ✓" : "저장 실패"); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = edit;
    if (id) {
      await supabase.from("alumni").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("alumni").insert({ ...rest, sort_order: items.length });
    }
    setSaving(false); setEdit(null); load(); showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("alumni").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">동문 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}명 등록됨</p>
        </div>
        <button onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <Plus className="h-4 w-4" /> 동문 추가
        </button>
      </div>

      {msg && <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">{msg}</div>}

      <div className="flex gap-1.5 mb-5">
        {[{ value: "all", label: "전체" }, ...TYPES].map(t => (
          <button key={t.value} onClick={() => setFilterType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filterType === t.value ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-gray-500 border border-white/5 hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {filtered.map(a => (
          <div key={a.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-3.5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 shrink-0">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{a.name}</p>
              <p className="text-xs text-gray-500">{TYPE_LABELS[a.type]} · {a.year}{a.degree ? ` · ${a.degree}` : ""}</p>
              {a.current_position && <p className="text-xs text-blue-400 mt-0.5">{a.current_position}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEdit(a)} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 동문이 없습니다</p>}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{edit.id ? "동문 편집" : "동문 추가"}</h2>
              <button onClick={() => setEdit(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이름 <span className="text-red-400">*</span></label>
              <input type="text" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">유형</label>
                <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0d0d16] px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors [&>option]:bg-[#0d0d16] [&>option]:text-white">
                  {TYPES.map(t => <option key={t.value} value={t.value} className="bg-[#0d0d16] text-white">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">연도</label>
                <input type="text" value={edit.year} onChange={e => setEdit({ ...edit, year: e.target.value })} placeholder="2025"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">학위</label>
              <input type="text" value={edit.degree} onChange={e => setEdit({ ...edit, degree: e.target.value })} placeholder="Ph.D. / M.Sc."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">현재 소속/직책</label>
              <input type="text" value={edit.current_position} onChange={e => setEdit({ ...edit, current_position: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Photo</label>
              <ImageUpload
                value={edit.photo_url || ""}
                onChange={(url) => setEdit({ ...edit, photo_url: url })}
                folder="alumni"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEdit(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !edit.name}
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
