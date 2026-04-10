"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Star, ChevronDown, ChevronUp, Trophy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Reflection = {
  id: string;
  win: string;
  difficulty: string;
  mood: string;
  tasksCompleted: number;
  date: string;
};

const MOODS = ["😴", "😔", "😐", "🙂", "😊", "🤩"];

export default function ReflectPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form
  const [win, setWin] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mood, setMood] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    fetch("/api/reflections")
      .then((r) => r.json())
      .then((d) => { setReflections(d); setLoading(false); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!win.trim() || !difficulty.trim() || !mood) return;
    setSaving(true);

    const res = await fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ win, difficulty, mood, tasksCompleted }),
    });
    const ref = await res.json();
    setReflections((prev) => [ref, ...prev]);
    setSaved(true);
    setWin("");
    setDifficulty("");
    setMood("");
    setTasksCompleted(0);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayReflection = reflections.find(
    (r) => new Date(r.date).toISOString().split("T")[0] === todayStr
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-800">Night Reflection</h1>
        <p className="text-gray-400 text-sm mt-1">End each day with intention. Find clarity in retrospect.</p>
      </motion.div>

      {/* Tonight's reflection form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Moon size={18} className="text-violet-400" />
          <h2 className="font-display text-lg font-semibold text-gray-800">Tonight&apos;s Reflection</h2>
          {todayReflection && (
            <span className="pill bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] ml-auto">
              ✓ Already logged today
            </span>
          )}
        </div>

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm flex items-center gap-2"
            >
              <Star size={14} /> Reflection saved. Great job today. 🌙
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">How did today feel?</label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={cn(
                    "text-2xl p-2.5 rounded-xl transition-all hover:scale-110",
                    mood === m ? "bg-coral-50 ring-2 ring-coral-400 scale-110" : "hover:bg-cream-100"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks completed */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Tasks completed today</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTasksCompleted(Math.max(0, tasksCompleted - 1))}
                className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-600 font-bold transition-colors"
              >
                −
              </button>
              <span className="font-mono text-2xl font-bold text-gray-800 w-8 text-center">{tasksCompleted}</span>
              <button
                type="button"
                onClick={() => setTasksCompleted(tasksCompleted + 1)}
                className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-600 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Win */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
              <Trophy size={14} className="text-gold-500" /> One win today
            </label>
            <textarea
              value={win}
              onChange={(e) => setWin(e.target.value)}
              placeholder="Something you accomplished, no matter how small..."
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-700 placeholder-gray-400 resize-none h-20 focus:outline-none focus:border-coral-400 transition-colors"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
              <AlertCircle size={14} className="text-coral-400" /> What felt difficult?
            </label>
            <textarea
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              placeholder="What was hard today? What drained you?"
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-700 placeholder-gray-400 resize-none h-20 focus:outline-none focus:border-coral-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !win.trim() || !difficulty.trim() || !mood}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-coral-500 text-white font-medium text-sm hover:shadow-glow transition-all disabled:opacity-40"
          >
            {saving ? "Saving reflection..." : "Save tonight's reflection ✦"}
          </button>
        </form>
      </motion.div>

      {/* Past reflections */}
      {reflections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-semibold text-gray-800 mb-4">Past Reflections</h2>
          <div className="space-y-3">
            {reflections.map((ref, i) => {
              const isExpanded = expandedId === ref.id;
              const date = new Date(ref.date);
              return (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ref.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{ref.mood}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </p>
                        <p className="text-xs text-gray-400">{ref.tasksCompleted} tasks completed</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-cream-100 pt-3">
                          <div className="bg-amber-50 rounded-2xl p-3">
                            <p className="text-xs font-semibold text-amber-600 mb-1 flex items-center gap-1">
                              <Trophy size={11} /> Win
                            </p>
                            <p className="text-sm text-gray-700">{ref.win}</p>
                          </div>
                          <div className="bg-cream-50 rounded-2xl p-3">
                            <p className="text-xs font-semibold text-coral-500 mb-1 flex items-center gap-1">
                              <AlertCircle size={11} /> Difficulty
                            </p>
                            <p className="text-sm text-gray-700">{ref.difficulty}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {!loading && reflections.length === 0 && (
        <div className="card p-10 text-center">
          <Moon size={32} className="text-violet-300 mx-auto mb-3" />
          <p className="font-display text-lg font-semibold text-gray-700">No reflections yet</p>
          <p className="text-gray-400 text-sm mt-1">Log your first reflection above.</p>
        </div>
      )}
    </div>
  );
}
