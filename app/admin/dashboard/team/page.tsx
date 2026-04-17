"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, User, X } from "lucide-react";
import { ImageUpload } from "../_components/image-upload";

const ROLES = [
  { value: "pi", label: "PI (Principal Investigator)" },
  { value: "phd", label: "박사과정" },
  { value: "graduate", label: "석사과정" },
  { value: "staff", label: "연구원/스태프" },
  { value: "intern", label: "학부연구생" },
];

const ROLE_LABELS: Record<string, string> = { 
  pi: "PI", 
  phd: "박사과정",
  graduate: "석사과정", 
  staff: "스태프", 
  intern: "학부연구생" 
};

const emptyMember = { 
  name_en: "", 
  name_kr: "", 
  role: "graduate", 
  title: "", 
  field: "", 
  email: "", 
  current_position: "",
  badges: [] as string[], 
  photo_url: "",
  sort_order: 0 
};

export default function TeamManagePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [panel, setPanel] = useState<any>(null);
  const [badgeInput, setBadgeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    if (data) setMembers(data);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? members : members.filter(m => m.role === filter);

  const showMsg = (text: string) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = panel;
    if (id) {
      await supabase.from("team_members").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      await supabase.from("team_members").insert({ ...rest, sort_order: members.length });
    }
    setSaving(false);
    setPanel(null);
    load();
    showMsg("Saved successfully");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
    showMsg("삭제되었습니다");
  };

  const addBadge = () => {
    if (badgeInput.trim() && panel) {
      setPanel({ ...panel, badges: [...(panel.badges || []), badgeInput.trim()] });
      setBadgeInput("");
    }
  };

  const removeBadge = (i: number) => {
    if (panel) setPanel({ ...panel, badges: panel.badges.filter((_: any, idx: number) => idx !== i) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">팀 관리</h1>
          <p className="text-sm text-gray-500 mt-1">현재 {members.length}명의 팀원이 등록되어 있습니다</p>
        </div>
        <button onClick={() => setPanel({ ...emptyMember })}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          <Plus className="h-4 w-4" /> 팀원 추가
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg px-4 py-2.5 text-sm bg-green-500/10 text-green-400 border border-green-500/20">{msg}</div>
      )}

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[{ value: "all", label: "전체" }, ...ROLES].map(r => (
          <button key={r.value} onClick={() => setFilter(r.value)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filter === r.value ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-gray-500 border border-white/5 hover:text-gray-300"}`}>
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {filtered.map(m => (
          <div key={m.id} className="rounded-xl border border-white/5 bg-[#0d0d18] p-3.5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 shrink-0">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{m.name_en} {m.name_kr && <span className="text-gray-500">({m.name_kr})</span>}</p>
              <p className="text-xs text-gray-500">{ROLE_LABELS[m.role]} · {m.field || m.title}</p>
            </div>
            <div className="flex gap-1.5">
              {(m.badges || []).map((b: string, i: number) => (
                <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">{b}</span>
              ))}
            </div>
            <div className="flex gap-1.5 ml-2">
              <button onClick={() => { setPanel(m); setBadgeInput(""); }} className="text-gray-500 hover:text-white"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(m.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-600 text-center py-8">등록된 팀원이 없습니다</p>}
      </div>

      {/* Slide Panel */}
      {panel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="flex-1 bg-black/60" onClick={() => setPanel(null)} />
          <div className="w-full max-w-sm bg-[#0d0d16] border-l border-white/5 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{panel.id ? "팀원 편집" : "팀원 추가"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이름 (영문) <span className="text-red-400">*</span></label>
              <input type="text" value={panel.name_en} onChange={e => setPanel({ ...panel, name_en: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이름 (한글)</label>
              <input type="text" value={panel.name_kr} onChange={e => setPanel({ ...panel, name_kr: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">역할 <span className="text-red-400">*</span></label>
              <select value={panel.role} onChange={e => setPanel({ ...panel, role: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0d0d16] px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors [&>option]:bg-[#0d0d16] [&>option]:text-white">
                {ROLES.map(r => <option key={r.value} value={r.value} className="bg-[#0d0d16] text-white">{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">직책</label>
              <input type="text" value={panel.title} onChange={e => setPanel({ ...panel, title: e.target.value })} placeholder="Ph.D. Student"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">연구 분야</label>
              <input type="text" value={panel.field} onChange={e => setPanel({ ...panel, field: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">email</label>
              <input type="email" value={panel.email} onChange={e => setPanel({ ...panel, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">현재 직장/소속 (졸업 후)</label>
              <input type="text" value={panel.current_position || ""} onChange={e => setPanel({ ...panel, current_position: e.target.value })}
                placeholder="예: Assistant Professor at Stanford University"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Photo</label>
              <ImageUpload
                value={panel.photo_url || ""}
                onChange={(url) => setPanel({ ...panel, photo_url: url })}
                folder="team-members"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">배지/태그</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(panel.badges || []).map((b: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400 flex items-center gap-1">
                    {b} <button onClick={() => removeBadge(i)} className="hover:text-white"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input type="text" value={badgeInput} onChange={e => setBadgeInput(e.target.value)} placeholder="태그명"
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addBadge())}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 transition-colors" />
                <button onClick={addBadge} className="px-3 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white">추가</button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button onClick={() => setPanel(null)}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">취소</button>
              <button onClick={handleSave} disabled={saving || !panel.name_en}
                className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2.5 text-sm font-medium text-white transition-colors">
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
