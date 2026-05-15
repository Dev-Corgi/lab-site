"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X, Pin } from "lucide-react";

const NOTICE_TYPES = [
  { value: "conference", label: "학회" },
  { value: "seminar", label: "세미나" },
  { value: "general", label: "일반" },
];

const empty = {
  title_en: "",
  title_kr: "",
  content_en: "",
  content_kr: "",
  notice_type: "general",
  event_date: "",
  is_pinned: false,
};

export default function NoticesManagePage() {
  const [items, setItems] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("event_date", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const showMsg = (ok: boolean) => {
    setMsg(ok ? "저장되었습니다 ✓" : "저장 실패");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = edit;
    if (id) {
      await supabase.from("notices").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("notices").insert(rest);
    }
    setSaving(false);
    setEdit(null);
    load();
    showMsg(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("notices").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">공지사항 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}개 공지</p>
        </div>
        <button
          onClick={() => setEdit({ ...empty })}
          className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
        >
          <Plus className="h-4 w-4" /> 공지 추가
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-700 border border-green-500/30">
          {msg}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {NOTICE_TYPES.find((t) => t.value === item.notice_type)?.label}
                </span>
                {item.event_date && (
                  <span className="text-xs text-gray-500">{item.event_date}</span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{item.title_kr}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content_kr}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => setEdit(item)}
                className="text-gray-500 hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-500 hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-8">등록된 공지가 없습니다</p>
        )}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">
                {edit.id ? "공지 편집" : "공지 추가"}
              </h2>
              <button
                onClick={() => setEdit(null)}
                className="text-gray-500 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  제목 (한글) <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={edit.title_kr}
                  onChange={(e) => setEdit({ ...edit, title_kr: e.target.value })}
                  className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  제목 (영문) <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={edit.title_en}
                  onChange={(e) => setEdit({ ...edit, title_en: e.target.value })}
                  className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                내용 (한글)
              </label>
              <textarea
                rows={5}
                value={edit.content_kr}
                onChange={(e) => setEdit({ ...edit, content_kr: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                내용 (영문)
              </label>
              <textarea
                rows={5}
                value={edit.content_en}
                onChange={(e) => setEdit({ ...edit, content_en: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  유형
                </label>
                <select
                  value={edit.notice_type}
                  onChange={(e) => setEdit({ ...edit, notice_type: e.target.value })}
                  className="w-full rounded-lg border border-border bg-sidebar px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 [&>option]:bg-sidebar \[\&>option\]:text-foreground"
                >
                  <option value="conference" className="bg-sidebar text-foreground">학회</option>
                  <option value="seminar" className="bg-sidebar text-foreground">세미나</option>
                  <option value="general" className="bg-sidebar text-foreground">일반</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  일정 날짜
                </label>
                <input
                  type="date"
                  value={edit.event_date || ""}
                  onChange={(e) => setEdit({ ...edit, event_date: e.target.value })}
                  className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={edit.is_pinned}
                onChange={(e) => setEdit({ ...edit, is_pinned: e.target.checked })}
                className="rounded border-border bg-muted/60 text-primary"
              />
              <label className="text-sm text-muted-foreground">상단 고정</label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-gray-400 hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !edit.title_kr || !edit.title_en}
                className="rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
