"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

type ChartPoint = { date: string; tasks: number };

type MomentumData = {
  currentStreak: number;
  weeklyTotal: number;
  weeklyActiveDays: number;
  chartData: ChartPoint[];
};

function MiniBar({ value, max, date }: { value: number; max: number; date: string }) {
  const h = max > 0 ? Math.round((value / max) * 100) : 0;
  const isToday = date === new Date().toISOString().split("T")[0];
  const d = new Date(date);
  const label = d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
  const dayNum = d.getDate();

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(h, value > 0 ? 8 : 0)}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className={`w-full max-w-[20px] rounded-t-md transition-colors ${
            value > 0
              ? isToday
                ? "bg-coral-500"
                : "bg-coral-300"
              : "bg-cream-300"
          }`}
          style={{ minHeight: value > 0 ? "4px" : "0" }}
        />
      </div>
      <span className="text-[9px] text-gray-400 font-mono">{label}</span>
      {value > 0 && <span className="text-[9px] text-coral-500 font-mono font-bold">{value}</span>}
    </div>
  );
}

export default function MomentumPage() {
  const [data, setData] = useState<MomentumData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/momentum")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-cream-200 rounded-full animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-28 animate-pulse" />)}
        </div>
        <div className="card h-48 animate-pulse" />
      </div>
    );
  }

  const maxTasks = data ? Math.max(...data.chartData.map((d) => d.tasks), 1) : 1;
  const consistencyPct = data ? Math.round((data.weeklyActiveDays / 7) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-800">Momentum</h1>
        <p className="text-gray-400 text-sm mt-1">Your consistency and progress over time.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: Flame,
            value: data?.currentStreak || 0,
            label: "Day streak",
            color: "text-amber-500",
            bg: "bg-amber-50",
            suffix: data?.currentStreak === 1 ? " day" : " days",
          },
          {
            icon: CheckCircle2,
            value: data?.weeklyTotal || 0,
            label: "This week",
            color: "text-coral-500",
            bg: "bg-coral-50",
            suffix: " tasks",
          },
          {
            icon: Calendar,
            value: consistencyPct,
            label: "Consistency",
            color: "text-sage-500",
            bg: "bg-emerald-50",
            suffix: "%",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-4 text-center"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <p className={`font-display text-2xl font-bold ${stat.color}`}>
              {stat.value}{stat.suffix}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-gray-800">14-Day Activity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Tasks completed per day</p>
          </div>
          <TrendingUp size={18} className="text-coral-300" />
        </div>

        <div className="flex items-end gap-1.5 h-28">
          {data?.chartData.map((point) => (
            <MiniBar key={point.date} value={point.tasks} max={maxTasks} date={point.date} />
          ))}
        </div>
      </motion.div>

      {/* Streak visualization */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="font-semibold text-gray-800 mb-1">Last 14 Days</h3>
        <p className="text-xs text-gray-400 mb-4">Filled = at least 1 task completed</p>
        <div className="flex gap-2 flex-wrap">
          {data?.chartData.map((point, i) => {
            const d = new Date(point.date);
            const isToday = point.date === new Date().toISOString().split("T")[0];
            return (
              <motion.div
                key={point.date}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                className="flex flex-col items-center gap-1"
                title={`${point.date}: ${point.tasks} tasks`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono transition-all ${
                    point.tasks > 0
                      ? "bg-coral-500 text-white shadow-glow"
                      : isToday
                      ? "bg-cream-200 border-2 border-coral-300 text-gray-400"
                      : "bg-cream-200 text-gray-400"
                  }`}
                >
                  {point.tasks > 0 ? "✓" : d.getDate()}
                </div>
                <span className="text-[9px] text-gray-400">
                  {d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
                </span>
              </motion.div>
            );
          })}
        </div>

        {data && data.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-coral-50 rounded-2xl border border-amber-100 text-center"
          >
            <p className="text-2xl mb-1">🔥</p>
            <p className="font-display font-semibold text-gray-800">
              {data.currentStreak} day{data.currentStreak !== 1 ? "s" : ""} in a row
            </p>
            <p className="text-xs text-gray-500 mt-1">Keep going. Momentum compounds.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
