"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Clock, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  estimatedMins: number;
  priority: string;
  pillar: { name: string; emoji: string };
};

const FEELING_PROMPTS = [
  "I have too many things to do",
  "I don't know where to start",
  "I feel behind on everything",
  "I'm exhausted but feel guilty resting",
  "Everything feels urgent",
];

export default function ResetPage() {
  const [feeling, setFeeling] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    tasks: Task[];
    message: string;
    action: string;
  } | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!feeling.trim()) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeling }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center">
            <Heart size={18} className="text-coral-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800">Overwhelm Reset</h1>
        </div>
        <p className="text-gray-400 text-sm">
          It&apos;s okay to feel lost. Let&apos;s find your footing together.
        </p>
      </motion.div>

      {/* Calming intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-50 via-coral-50 to-amber-50 rounded-3xl p-6 border border-violet-100"
      >
        <p className="font-display text-lg text-gray-700 leading-relaxed italic">
          &ldquo;You don&apos;t have to do everything. You just have to do the next right thing.&rdquo;
        </p>
        <p className="text-gray-400 text-xs mt-2">— A reminder from ASCEND</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-6"
      >
        <h2 className="font-semibold text-gray-700 mb-1">What are you feeling right now?</h2>
        <p className="text-xs text-gray-400 mb-4">Be honest. This is just for you.</p>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FEELING_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setFeeling(p)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                feeling === p
                  ? "bg-coral-50 border-coral-300 text-coral-600"
                  : "bg-cream-50 border-cream-300 text-gray-500 hover:border-coral-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <textarea
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="Or write what's on your mind..."
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-700 placeholder-gray-400 resize-none h-28 focus:outline-none focus:border-coral-400 transition-colors"
          />

          <button
            type="submit"
            disabled={!feeling.trim() || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-400 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-glow transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Finding your focus...
              </>
            ) : (
              <>
                Show me what to do <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="space-y-4"
          >
            {/* Calming message */}
            <div className="card p-6 bg-gradient-to-br from-coral-50 to-amber-50 border-coral-100">
              <p className="font-display text-xl font-semibold text-gray-800 leading-relaxed mb-3">
                {result.message}
              </p>
              <div className="flex items-start gap-2 bg-white/60 rounded-2xl p-3">
                <ArrowRight size={16} className="text-coral-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium">{result.action}</p>
              </div>
            </div>

            {/* Top 3 tasks */}
            {result.tasks.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-700 mb-1">Your 3 tasks for right now</h3>
                <p className="text-xs text-gray-400 mb-4">Start with #1. That&apos;s it. Nothing else matters yet.</p>

                <div className="space-y-3">
                  {result.tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        i === 0
                          ? "bg-coral-50 border-coral-200"
                          : "bg-cream-50 border-cream-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          i === 0 ? "bg-coral-500 text-white" : "bg-cream-200 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${i === 0 ? "text-coral-700" : "text-gray-700"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {task.pillar.emoji} {task.pillar.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                        <Clock size={12} />
                        <span className="text-xs">{task.estimatedMins}m</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 rounded-2xl bg-coral-500 text-white text-sm font-medium text-center hover:bg-coral-600 transition-colors"
                  >
                    Go to Today&apos;s dashboard ✦
                  </Link>
                </div>
              </div>
            )}

            {result.tasks.length === 0 && (
              <div className="card p-6 text-center">
                <p className="text-3xl mb-3">✨</p>
                <p className="font-display font-semibold text-gray-700">No pending tasks!</p>
                <p className="text-gray-400 text-sm mt-1">You&apos;re all clear. Add tasks in the Tasks section.</p>
                <Link href="/tasks" className="mt-4 inline-block text-coral-500 text-sm font-medium hover:text-coral-600">
                  Add tasks →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
