"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { ImageUpload } from "../_components/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { slugifyTitle, uniqueSlugCandidate } from "@/lib/slugify";

type ResearchAreaRow = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
  slug: string;
  body_html?: string | null;
  body_html_kr?: string | null;
};

const emptyDraft: Omit<ResearchAreaRow, "id"> = {
  title: "",
  description: "",
  category: "",
  image_url: "",
  sort_order: 0,
  slug: "",
  body_html: "",
  body_html_kr: "",
};

type EditState = { id?: string } & Omit<ResearchAreaRow, "id">;

type BodyTab = "en" | "kr";

export default function ResearchManagePage() {
  const [items, setItems] = useState<ResearchAreaRow[]>([]);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [bodyTab, setBodyTab] = useState<BodyTab>("en");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const sb = createClient();
    const { data } = await sb.from("research_areas").select("*").order("sort_order");
    if (data) {
      setItems(
        (data as ResearchAreaRow[]).map((r) => ({
          ...r,
          slug: r.slug ?? "",
          body_html: r.body_html ?? "",
          body_html_kr: r.body_html_kr ?? "",
        })),
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sb = createClient();
      const { data } = await sb.from("research_areas").select("*").order("sort_order");
      if (cancelled || !data) return;
      setItems(
        (data as ResearchAreaRow[]).map((r) => ({
          ...r,
          slug: r.slug ?? "",
          body_html: r.body_html ?? "",
          body_html_kr: r.body_html_kr ?? "",
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showMsg = (ok: boolean, text?: string) => {
    setMsg(text ?? (ok ? "저장되었습니다 ✓" : "저장 실패"));
    setTimeout(() => setMsg(""), text ? 5000 : 3000);
  };

  const openNew = () => {
    setBodyTab("en");
    setEdit({ ...emptyDraft });
  };

  const openEdit = (item: ResearchAreaRow) => {
    setBodyTab("en");
    setEdit({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      category: item.category ?? "",
      image_url: item.image_url ?? "",
      sort_order: item.sort_order ?? 0,
      slug: item.slug ?? "",
      body_html: item.body_html ?? "",
      body_html_kr: item.body_html_kr ?? "",
    });
  };

  const fillSlugFromTitle = () => {
    if (!edit) return;
    const tit = String(edit.title ?? "").trim();
    if (!tit) {
      showMsg(false, "먼저 제목을 입력하세요.");
      return;
    }
    setEdit({ ...edit, slug: uniqueSlugCandidate(slugifyTitle(tit)) });
  };

  const handleSave = async () => {
    if (!edit?.title?.trim()) return;
    const sb = createClient();
    setSaving(true);
    const { id, ...raw } = edit;
    let slug = String(raw.slug ?? "").trim();
    if (!slug) {
      slug = uniqueSlugCandidate(slugifyTitle(String(raw.title ?? "")));
    }

    const rest = {
      title: raw.title,
      description: raw.description ?? "",
      category: raw.category ?? "",
      image_url: raw.image_url ?? "",
      sort_order: raw.sort_order ?? 0,
      slug,
      body_html: raw.body_html ?? "",
      body_html_kr: raw.body_html_kr ?? "",
    };

    let saveError = null as { message: string } | null;
    if (id) {
      const { error } = await sb
        .from("research_areas")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id);
      saveError = error;
    } else {
      const { error } = await sb.from("research_areas").insert({ ...rest, sort_order: items.length });
      saveError = error;
    }
    setSaving(false);
    if (saveError) {
      showMsg(false, `저장 실패: ${saveError.message}`);
      return;
    }
    setEdit(null);
    await load();
    showMsg(true);
  };

  const handleDelete = async (idToDrop: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const sb = createClient();
    await sb.from("research_areas").delete().eq("id", idToDrop);
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">연구 분야 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {items.length}개 연구 분야 · 목록 클릭 시 상세 페이지로 연결됩니다</p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors">
          <Plus className="h-4 w-4" /> 연구 분야 추가
        </button>
      </div>

      {msg && (
        <div
          className={`mb-4 rounded-lg px-4 py-2.5 text-sm border ${
            msg.includes("실패") || msg.includes("먼저")
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-green-500/10 text-green-400 border-green-500/20"
          }`}
        >
          {msg}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {item.category && <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary uppercase">{item.category}</span>}
                {item.slug && (
                  <span className="text-[10px] text-gray-600 font-mono">/{item.slug}</span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{i + 1}. {item.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button type="button" onClick={() => openEdit(item)} className="text-gray-500 hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 연구 분야가 없습니다</p>}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[min(92vh,880px)] overflow-y-auto rounded-xl border border-border bg-card p-6 space-y-4 my-auto">
            <div className="flex justify-between items-center sticky top-0 bg-card pb-2 z-10 border-b border-border -mt-2 pt-2">
              <h2 className="text-lg font-bold text-foreground">{edit.id ? "연구 분야 편집" : "연구 분야 추가"}</h2>
              <button type="button" onClick={() => setEdit(null)} className="text-gray-500 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">URL 슬러그 <span className="text-primary">*</span></label>
              <div className="flex gap-2">
                <input type="text" value={edit.slug} onChange={e => setEdit({ ...edit, slug: e.target.value })}
                  placeholder="fiber-sensing"
                  className="flex-1 rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground font-mono outline-none focus:border-primary/50 transition-colors" />
                <button type="button" onClick={fillSlugFromTitle}
                  className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs text-gray-400 hover:text-foreground hover:bg-muted/60 transition-colors">
                  제목으로 생성
                </button>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">공개 주소: /research/<span className="text-gray-500">{edit.slug || "…"}</span></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">제목 <span className="text-primary">*</span></label>
              <input type="text" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">카테고리/태그</label>
              <input type="text" value={edit.category ?? ""} onChange={e => setEdit({ ...edit, category: e.target.value })} placeholder="PHOTONICS"
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">목록용 요약</label>
              <textarea rows={4} value={edit.description ?? ""} onChange={e => setEdit({ ...edit, description: e.target.value })}
                className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">상세 본문 (리치 텍스트)</label>
              <div className="flex gap-1 mb-2 p-0.5 rounded-lg bg-muted/60 w-fit">
                <button type="button" onClick={() => setBodyTab("en")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${bodyTab === "en" ? "bg-primary text-primary-foreground" : "text-gray-500 hover:text-muted-foreground"}`}>
                  English
                </button>
                <button type="button" onClick={() => setBodyTab("kr")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${bodyTab === "kr" ? "bg-primary text-primary-foreground" : "text-gray-500 hover:text-muted-foreground"}`}>
                  한국어
                </button>
              </div>
              <RichTextEditor
                editorKey={`${edit.id ?? "new"}-${bodyTab}`}
                value={bodyTab === "en" ? (edit.body_html || "") : (edit.body_html_kr || "")}
                onChange={(html) =>
                  setEdit({
                    ...edit,
                    ...(bodyTab === "en" ? { body_html: html } : { body_html_kr: html }),
                  })
                }
                placeholder={bodyTab === "en" ? "Detailed content (optional)…" : "상세 본문 (선택)…"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">이미지</label>
              <ImageUpload
                value={edit.image_url ?? ""}
                onChange={(url) => setEdit({ ...edit, image_url: url })}
                folder="research-areas"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-card pb-1">
              <button type="button" onClick={() => setEdit(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-gray-400 hover:text-foreground transition-colors">취소</button>
              <button type="button" onClick={handleSave} disabled={saving || !edit.title}
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
