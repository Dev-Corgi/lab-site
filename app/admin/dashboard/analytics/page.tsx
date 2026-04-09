"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Calendar } from "lucide-react";

interface VisitorStats {
  daily: number;
  weekly: number;
  monthly: number;
  chartData: Array<{ visit_date: string; visitor_count: number }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<VisitorStats>({ daily: 0, weekly: 0, monthly: 0, chartData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/visitor/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="rounded-xl border border-white/5 bg-[#0d0d18] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">방문자 통계</h1>
        <p className="text-sm text-gray-500 mt-1">웹사이트 방문자 현황을 확인하세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard icon={Users} label="오늘" value={stats.daily} color="blue" />
        <StatCard icon={TrendingUp} label="이번 주 (7일)" value={stats.weekly} color="green" />
        <StatCard icon={Calendar} label="이번 달 (30일)" value={stats.monthly} color="purple" />
      </div>

    </div>
  );
}
