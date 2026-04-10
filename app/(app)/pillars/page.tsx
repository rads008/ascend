"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Clock, TrendingUp, Plus } from "lucide-react";
import { cn, getPillarColor } from "@/lib/utils";

type Pillar = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  weeklyGoal: number;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  weeklyCompleted: number;
  lastActivity: string | null;
};

function timeAgo(date: string | null): string {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function PillarsPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pillars")
      .then((r) => r.json())
      .then((d) => { setPillars(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-800">Life Pillars</h1>
        <p className="text-gray-400 text-sm mt-1">Track progress across every dimension of your life.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => {
            const colors = getPillarColor(pillar.color);
            const weeklyPct = Math.min(Math.round((pillar.weeklyCompleted / pillar.weeklyGoal) * 100), 100);

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card card-hover p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-xl", colors.bg)}>
                      {pillar.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">{pillar.name}</h3>
                      <p className={cn("text-xs mt-0.5 flex items-center gap-1", colors.text)}>
                        <Clock size={10} /> Last: {timeAgo(pillar.lastActivity)}
                      </p>
                    </div>
                  </div>
                  <span className={cn("font-mono text-lg font-bold", colors.text)}>{pillar.progress}%</span>
                </div>

                {/* Overall progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">Overall</span>
                    <span className="text-xs text-gray-500">{pillar.completedTasks}/{pillar.totalTasks} tasks</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pillar.progress}%` }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: "easeOut" }}
                      className="progress-fill"
                      style={{ background: `linear-gradient(90deg, #F45C43, #EEC84A)` }}
                    />
                  </div>
                </div>

                {/* Weekly progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <TrendingUp size={10} /> This week
                    </span>
                    <span className="text-xs text-gray-500">{pillar.weeklyCompleted}/{pillar.weeklyGoal} goal</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${weeklyPct}%` }}
                      transition={{ delay: 0.4 + i * 0.07, duration: 0.6 }}
                      className={cn("progress-fill", colors.bg.replace("bg-", "bg-"))}
                      style={{ background: weeklyPct >= 100 ? "#8DB485" : "#EEC84A" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
