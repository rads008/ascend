"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, CheckCircle2, Circle, Zap, Heart, Brain } from "lucide-react";
import { getGreeting } from "@/lib/engine";
import { formatDate, cn } from "@/lib/utils";
import { MoodWidget } from "./MoodWidget";
import { OverwhelmButton } from "./OverwhelmButton";

type Task = {
  id: string;
  title: string;
  estimatedMins: number;
  completed: boolean;
  priority: "CRITICAL" | "GROWTH" | "LIGHT";
  pillar: { name: string; emoji: string; color: string };
};

type MoodEntry = { mood: string; energy: "LOW" | "MEDIUM" | "HIGH" } | null;

const PRIORITY_STYLES = {
  CRITICAL: "bg-red-50 text-red-500 border-red-100",
  GROWTH: "bg-amber-50 text-amber-600 border-amber-100",
  LIGHT: "bg-sage-50 text-emerald-600 border-emerald-100",
};

const ENERGY_CONFIG = {
  LOW: { label: "Low energy", icon: Heart, color: "text-blue-400" },
  MEDIUM: { label: "Medium energy", icon: Brain, color: "text-amber-500" },
  HIGH: { label: "High energy", icon: Zap, color: "text-coral-500" },
};

export function DashboardClient({ userName, quote }: { userName: string; quote: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mood, setMood] = useState<MoodEntry>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, moodRes, momentumRes] = await Promise.all([
        fetch("/api/top-three"),
        fetch("/api/mood"),
        fetch("/api/momentum"),
      ]);
      const [tasksData, moodData, momentumData] = await Promise.all([
        tasksRes.json(),
        moodRes.json(),
        momentumRes.json(),
      ]);
      setTasks(tasksData);
      setMood(moodData);
      setStreak(momentumData.currentStreak || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function toggleTask(id: string, completed: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const focusScore = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800">
              {getGreeting(userName)} ✦
            </h1>
            <p className="text-gray-400 text-sm mt-1">{formatDate(today)}</p>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl"
            >
              <Flame size={18} className="text-amber-500" />
              <span className="font-mono font-semibold text-amber-600">{streak}</span>
              <span className="text-amber-500 text-sm">day streak</span>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-gradient-to-r from-coral-50 to-amber-50 border border-cream-300 rounded-2xl px-5 py-3"
        >
          <p className="text-gray-600 text-sm italic font-display">&ldquo;{quote}&rdquo;</p>
        </motion.div>
      </motion.div>

      {/* State row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <MoodWidget currentMood={mood} onUpdate={(m) => setMood(m)} />

        {/* Energy */}
        <div className="card p-4 flex items-center gap-3">
          {mood?.energy ? (
            <>
              {(() => {
                const cfg = ENERGY_CONFIG[mood.energy];
                const Icon = cfg.icon;
                return (
                  <>
                    <Icon size={22} className={cfg.color} />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Energy</p>
                      <p className={cn("font-semibold text-sm", cfg.color)}>{cfg.label}</p>
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              <Zap size={22} className="text-gray-300" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Energy</p>
                <p className="text-gray-400 text-sm">Set your mood first</p>
              </div>
            </>
          )}
        </div>

        {/* Focus score */}
        <div className="card p-4">
          <p className="text-xs text-gray-400 font-medium mb-2">Focus Score</p>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFF3D6" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#F45C43"
                  strokeWidth="3"
                  strokeDasharray={`${focusScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-coral-500">
                {focusScore}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">{completedCount}/{tasks.length} done</p>
              <p className="text-xs text-gray-400">today&apos;s tasks</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Moves */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-800">Today&apos;s Moves</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your 3 highest-leverage tasks right now</p>
          </div>
          <span className="pill bg-coral-50 text-coral-500 border border-coral-100">
            {completedCount}/{tasks.length} complete
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-cream-200 rounded-full w-3/4 mb-2" />
                <div className="h-3 bg-cream-200 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-display text-lg font-semibold text-gray-700">All clear!</p>
            <p className="text-gray-400 text-sm mt-1">No pending tasks. Add some from the Tasks page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={cn(
                  "card p-5 flex items-start gap-4 card-hover cursor-pointer group",
                  task.completed && "opacity-60"
                )}
                onClick={() => toggleTask(task.id, !task.completed)}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 size={22} className="text-coral-500" />
                  ) : (
                    <Circle size={22} className="text-gray-300 group-hover:text-coral-300 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-gray-800 text-sm leading-snug", task.completed && "line-through text-gray-400")}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-base">{task.pillar.emoji}</span>
                    <span className="text-xs text-gray-400">{task.pillar.name}</span>
                    <span className="text-gray-200">·</span>
                    <Clock size={11} className="text-gray-300" />
                    <span className="text-xs text-gray-400">{task.estimatedMins}m</span>
                    <span className={cn("pill text-[10px] border px-2 py-0.5", PRIORITY_STYLES[task.priority])}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Overwhelm reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <OverwhelmButton onReset={fetchData} />
      </motion.div>
    </div>
  );
}
