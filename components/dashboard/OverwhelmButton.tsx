"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Clock } from "lucide-react";

type Task = {
  id: string;
  title: string;
  estimatedMins: number;
  pillar: { name: string; emoji: string };
};

export function OverwhelmButton({ onReset }: { onReset?: () => void }) {
  const [open, setOpen] = useState(false);
  const [feeling, setFeeling] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    tasks: Task[];
    message: string;
    action: string;
  } | null>(null);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeling }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  function handleClose() {
    setOpen(false);
    setFeeling("");
    setResult(null);
    onReset?.();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-dashed border-coral-200 text-coral-400 text-sm font-medium hover:border-coral-400 hover:text-coral-500 hover:bg-coral-50 transition-all group"
      >
        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
        I feel lost / overwhelmed
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-card p-7"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-800">Overwhelm Reset</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Let&apos;s get you back on track.</p>
                </div>
                <button onClick={handleClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {!result ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">What are you feeling right now?</p>
                  <textarea
                    value={feeling}
                    onChange={(e) => setFeeling(e.target.value)}
                    placeholder="I feel overwhelmed with too many things..."
                    className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-700 placeholder-gray-400 resize-none h-24 focus:outline-none focus:border-coral-400 transition-colors"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-400 text-white font-medium text-sm hover:shadow-glow transition-all disabled:opacity-50"
                  >
                    {loading ? "Finding your focus..." : "Show me what to do →"}
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Calming message */}
                  <div className="bg-gradient-to-br from-coral-50 to-amber-50 rounded-2xl p-4 border border-coral-100">
                    <p className="font-display text-base font-semibold text-gray-800 mb-1.5">
                      {result.message}
                    </p>
                    <p className="text-sm text-coral-600 font-medium">→ {result.action}</p>
                  </div>

                  {/* Top 3 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                      Your 3 tasks right now
                    </p>
                    <div className="space-y-2">
                      {result.tasks.map((task, i) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-cream-200">
                          <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{task.title}</p>
                            <p className="text-xs text-gray-400">{task.pillar.emoji} {task.pillar.name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                            <Clock size={11} />
                            <span className="text-xs">{task.estimatedMins}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 transition-colors"
                  >
                    Got it, let&apos;s go ✦
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
