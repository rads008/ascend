"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Check, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Identity = {
  id: string;
  title: string;
  description: string;
  linkedPillars: string[];
  actedToday: boolean;
  consistencyScore: number;
};

type Pillar = { id: string; name: string; emoji: string };

const IDENTITY_EXAMPLES = [
  "Future Software Engineer",
  "GATE Topper",
  "Disciplined Me",
  "MS Germany Aspirant",
  "Research Scholar",
];

export default function IdentityPage() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkedPillars, setLinkedPillars] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/identities"), fetch("/api/pillars")])
      .then(([a, b]) => Promise.all([a.json(), b.json()]))
      .then(([ids, pils]) => {
        setIdentities(ids);
        setPillars(pils);
        setLoading(false);
      });
  }, []);

  async function addIdentity(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);

    const res = await fetch("/api/identities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, linkedPillars }),
    });
    const id = await res.json();
    setIdentities((prev) => [...prev, id]);
    setTitle("");
    setDescription("");
    setLinkedPillars([]);
    setShowAdd(false);
    setAdding(false);
  }

  async function toggleActed(id: string, actedToday: boolean) {
    setIdentities((prev) =>
      prev.map((i) => (i.id === id ? { ...i, actedToday } : i))
    );
    await fetch("/api/identities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, actedToday }),
    });
  }

  const togglePillar = (id: string) => {
    setLinkedPillars((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-800">Identity</h1>
          <p className="text-gray-400 text-sm mt-1">Who are you becoming? Show up as that person daily.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 transition-all"
        >
          <Plus size={16} /> Add Identity
        </button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addIdentity}
            className="card p-6 space-y-4 overflow-hidden"
          >
            <h3 className="font-semibold text-gray-700 text-sm">Define an Identity</h3>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Identity title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={IDENTITY_EXAMPLES[Math.floor(Math.random() * IDENTITY_EXAMPLES.length)]}
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-coral-400"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Who does this version of you show up as?"
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-700 placeholder-gray-400 resize-none h-20 focus:outline-none focus:border-coral-400"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block">Linked Pillars</label>
              <div className="flex flex-wrap gap-2">
                {pillars.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePillar(p.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      linkedPillars.includes(p.id)
                        ? "bg-coral-50 border-coral-300 text-coral-600"
                        : "bg-cream-50 border-cream-300 text-gray-500 hover:border-coral-200"
                    )}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={adding} className="px-6 py-2.5 rounded-xl bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 transition-colors disabled:opacity-50">
                {adding ? "Adding..." : "Add Identity"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl bg-cream-100 text-gray-500 text-sm font-medium hover:bg-cream-200 transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Daily check-in banner */}
      {identities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-violet-50 to-coral-50 border border-violet-100 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-violet-400" />
            <p className="font-semibold text-gray-700 text-sm">Daily Identity Check-In</p>
          </div>
          <p className="text-gray-500 text-sm">Did you act like these versions of yourself today?</p>
        </motion.div>
      )}

      {/* Identities list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}
        </div>
      ) : identities.length === 0 ? (
        <div className="card p-10 text-center">
          <Sparkles size={32} className="text-coral-300 mx-auto mb-3" />
          <p className="font-display text-lg font-semibold text-gray-700">No identities yet</p>
          <p className="text-gray-400 text-sm mt-1">Define who you&apos;re becoming and show up as them daily.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {identities.map((identity, i) => (
            <motion.div
              key={identity.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn("card p-6 transition-all", identity.actedToday && "ring-2 ring-coral-200")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-coral-400 flex-shrink-0" />
                    <h3 className="font-display font-semibold text-gray-800">{identity.title}</h3>
                    {identity.actedToday && (
                      <span className="pill bg-coral-50 text-coral-500 border border-coral-100 text-[10px]">
                        ✓ Done today
                      </span>
                    )}
                  </div>
                  {identity.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{identity.description}</p>
                  )}

                  {/* Consistency score */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 max-w-32 progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${identity.consistencyScore}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.7 }}
                        className="progress-fill bg-gradient-to-r from-coral-400 to-gold-400"
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {Math.round(identity.consistencyScore)}% consistency
                    </span>
                  </div>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => toggleActed(identity.id, !identity.actedToday)}
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    identity.actedToday
                      ? "bg-coral-500 text-white shadow-glow"
                      : "bg-cream-100 text-gray-400 hover:bg-coral-50 hover:text-coral-400"
                  )}
                  title={identity.actedToday ? "Mark as not done" : "I acted like this today"}
                >
                  {identity.actedToday ? <Check size={18} /> : <Check size={18} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
