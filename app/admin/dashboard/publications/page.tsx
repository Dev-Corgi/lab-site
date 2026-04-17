"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { ImageUpload } from "../_components/image-upload";

const empty = { title: "", authors: "", journal: "", year: new Date().getFullYear().toString(), volume_page: "", link_url: "", doi_url: "", image_url: "", is_featured: false };

export default function PublicationsManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [filterYear, setFilterYear] = useState("all");
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("publications").select("*").order("year", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const years = [...new Set(items.map(p => p.year))].sort((a, b) => b.localeCompare(a));
  const filtered = items
    .filter(p => filterYear === "all" || p.year === filterYear)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.authors.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (ok: boolean) => { setMsg(ok ? "저장되었습니다 ✓" : "저장 실패"); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = edit;
    if (id) {
      await supabase.from("publications").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("publications").insert(rest);
    }
    setSaving(false); setEdit(null); load(); showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("publications").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">출판물 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}편 등록됨</p>
        </div>
        <button onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <Plus className="h-4 w-4" /> 논문 추가
        </button>
      </div>

      {msg && <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">{msg}</div>}

      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0d0d16] px-3 py-2 text-sm text-white outline-none [&>option]:bg-[#0d0d16] [&>option]:text-white">
          <option value="all" className="bg-[#0d0d16] text-white">전체 연도</option>
          {years.map(y => <option key={y} value={y} className="bg-[#0d0d16] text-white">{y}</option>)}
        </select>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="논문 제목 검색..."
          className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white leading-snug">{p.title}</p>
                <p className="text-xs text-gray-500 mt-1">{p.authors}</p>
                <p className="text-xs text-gray-600 mt-0.5">{p.journal} · {p.year}{p.volume_page ? ` · ${p.volume_page}` : ""}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {p.is_featured && <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-400">Featured</span>}
                <button onClick={() => setEdit(p)} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 출판물이 없습니다</p>}
      </div>

      {/* Modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d0d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{edit.id ? "논문 편집" : "논문 추가"}</h2>
              <button onClick={() => setEdit(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">논문 제목 <span className="text-red-400">*</span></label>
              <textarea rows={2} value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">저자 목록 <span className="text-red-400">*</span></label>
              <input type="text" value={edit.authors} onChange={e => setEdit({ ...edit, authors: e.target.value })} placeholder="Kim A, Lee B, Park C"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
              <p className="text-[11px] text-gray-600 mt-1">쉼표로 구분하여 입력</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">저널명</label>
                <input type="text" value={edit.journal} onChange={e => setEdit({ ...edit, journal: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">연도 <span className="text-red-400">*</span></label>
                <input type="text" value={edit.year} onChange={e => setEdit({ ...edit, year: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Volume/Page</label>
              <input type="text" value={edit.volume_page} onChange={e => setEdit({ ...edit, volume_page: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">논문 링크 (URL)</label>
              <input type="url" value={edit.link_url} onChange={e => setEdit({ ...edit, link_url: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">DOI link</label>
              <input type="url" value={edit.doi_url} onChange={e => setEdit({ ...edit, doi_url: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Image</label>
              <ImageUpload
                value={edit.image_url || ""}
                onChange={(url) => setEdit({ ...edit, image_url: url })}
                folder="publications"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={edit.is_featured} onChange={e => setEdit({ ...edit, is_featured: e.target.checked })}
                className="rounded border-white/10 bg-white/5 text-red-500" />
              <label className="text-sm text-gray-300">홈페이지 Featured 출판물로 표시</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEdit(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !edit.title || !edit.authors || !edit.year}
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
