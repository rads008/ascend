"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

const MOODS = ["😴", "😔", "😐", "🙂", "😊", "🤩"];
const MOOD_LABELS = ["Exhausted", "Low", "Neutral", "Good", "Great", "Amazing"];
const ENERGY_OPTIONS = [
  { value: "LOW", label: "Low", color: "bg-blue-100 text-blue-600 border-blue-200" },
  { value: "MEDIUM", label: "Medium", color: "bg-amber-100 text-amber-600 border-amber-200" },
  { value: "HIGH", label: "High", color: "bg-coral-50 text-coral-600 border-coral-200" },
];

export function MoodWidget({
  currentMood,
  onUpdate,
}: {
  currentMood: { mood: string; energy: string } | null;
  onUpdate: (m: { mood: string; energy: "LOW" | "MEDIUM" | "HIGH" }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>(currentMood?.mood || "");
  const [selectedEnergy, setSelectedEnergy] = useState<string>(currentMood?.energy || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!selectedMood || !selectedEnergy) return;
    setSaving(true);
    const res = await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: selectedMood, energy: selectedEnergy }),
    });
    const data = await res.json();
    onUpdate(data);
    setSaving(false);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="card p-4 w-full flex items-center gap-3 hover:shadow-card transition-all text-left"
      >
        {currentMood ? (
          <>
            <span className="text-2xl">{currentMood.mood}</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mood</p>
              <p className="text-sm font-medium text-gray-700">
                {MOOD_LABELS[MOODS.indexOf(currentMood.mood)] || "Set"}
              </p>
            </div>
          </>
        ) : (
          <>
            <Smile size={22} className="text-gray-300" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Mood</p>
              <p className="text-gray-400 text-sm">How are you feeling?</p>
            </div>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-20 bg-white rounded-3xl shadow-card border border-cream-200 p-5 w-72"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">How are you feeling?</p>
            <div className="flex gap-1.5 mb-4 justify-between">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`text-xl p-2 rounded-xl transition-all hover:scale-110 ${
                    selectedMood === m ? "bg-coral-50 ring-2 ring-coral-400 scale-110" : "hover:bg-cream-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Energy level</p>
            <div className="flex gap-2 mb-4">
              {ENERGY_OPTIONS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setSelectedEnergy(e.value)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedEnergy === e.value ? e.color + " ring-1 ring-offset-1" : "bg-cream-50 text-gray-500 border-cream-200 hover:bg-cream-100"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>

            <button
              onClick={save}
              disabled={!selectedMood || !selectedEnergy || saving}
              className="w-full py-2.5 rounded-xl bg-coral-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-coral-600 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
