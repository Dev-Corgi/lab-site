"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const empty = { date: "", date_display: "", content: "", link_url: "" };

export default function NewsManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [filterYear, setFilterYear] = useState("all");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("news").select("*").order("date", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const years = [...new Set(items.map(n => n.year))].sort((a, b) => b.localeCompare(a));
  const filtered = filterYear === "all" ? items : items.filter(n => n.year === filterYear);

  const showMsg = (ok: boolean) => { setMsg(ok ? "저장되었습니다 ✓" : "저장 실패"); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, year, ...rest } = edit;
    if (id) {
      await supabase.from("news").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("news").insert(rest);
    }
    setSaving(false); setEdit(null); load(); showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${months[d.getMonth()]} ${day}${suffix} ${d.getFullYear()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">뉴스 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}개 소식</p>
        </div>
        <button onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors">
          <Plus className="h-4 w-4" /> 뉴스 추가
        </button>
      </div>

      {msg && <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-700 border border-green-500/30">{msg}</div>}

      <div className="flex gap-3 mb-5">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className="rounded-lg border border-border bg-sidebar px-3 py-2 text-sm text-foreground outline-none [&>option]:bg-sidebar \[\&>option\]:text-foreground">
          <option value="all" className="bg-sidebar text-foreground">전체 연도</option>
          {years.map(y => <option key={y} value={y} className="bg-sidebar text-foreground">{y}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(n => (
          <div key={n.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-primary mb-1">{n.date_display}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{n.content}</p>
              {n.link_url && <p className="text-xs text-blue-400 mt-1 truncate">{n.link_url}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEdit(n)} className="text-gray-500 hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(n.id)} className="text-gray-500 hover:text-primary"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 뉴스가 없습니다</p>}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">{edit.id ? "뉴스 편집" : "뉴스 추가"}</h2>
              <button onClick={() => setEdit(null)} className="text-gray-500 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">날짜 <span className="text-primary">*</span></label>
              <input type="date" value={edit.date} onChange={e => setEdit({ ...edit, date: e.target.value, date_display: formatDateDisplay(e.target.value) })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
              {edit.date_display && <p className="text-xs text-gray-500 mt-1">표시: {edit.date_display}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">내용 <span className="text-primary">*</span></label>
              <textarea rows={3} value={edit.content} onChange={e => setEdit({ ...edit, content: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">관련 링크 (선택)</label>
              <input type="url" value={edit.link_url} onChange={e => setEdit({ ...edit, link_url: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEdit(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-gray-400 hover:text-foreground transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !edit.date || !edit.content}
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
