"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactManagePage() {
  const [form, setForm] = useState<any>({
    id: "", building: "", office_room: "", lab_room: "", address: "", google_maps_url: "", email: "", phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("contact_info").select("*").single().then(({ data }) => {
      if (data) setForm(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = form;
    const { error } = await supabase.from("contact_info").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    setSaving(false);
    setMsg(error ? "저장 실패" : "저장되었습니다 ✓");
    setTimeout(() => setMsg(""), 3000);
  };

  const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">연락처</h1>
          <p className="text-sm text-gray-500 mt-1">연구실 위치와 연락처를 수정합니다</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition-colors">
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {msg && <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes("실패") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>{msg}</div>}

      <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide">위치 정보</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">건물명</label>
          <input type="text" value={form.building} onChange={e => setForm({ ...form, building: e.target.value })} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">사무실 호수</label>
            <input type="text" value={form.office_room} onChange={e => setForm({ ...form, office_room: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">연구실 호수</label>
            <input type="text" value={form.lab_room} onChange={e => setForm({ ...form, lab_room: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">전체 주소</label>
          <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Google Maps 임베드 URL</label>
          <input type="url" value={form.google_maps_url} onChange={e => setForm({ ...form, google_maps_url: e.target.value })} className={inputCls}
            placeholder="https://www.google.com/maps/embed?pb=..." />
          <p className="text-[11px] text-gray-600 mt-1">Google Maps → 공유 → 지도 퍼가기 → src URL을 복사하세요</p>
        </div>

        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide pt-4">연락 정보</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">대표 이메일 <span className="text-red-400">*</span></label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">전화번호 (선택)</label>
          <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} />
        </div>
      </div>
    </div>
  );
}
