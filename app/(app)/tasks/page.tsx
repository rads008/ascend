"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Circle, Trash2, Filter, Clock, Calendar, ChevronDown } from "lucide-react";
import { cn, formatRelativeTime, getPillarColor } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  priority: "CRITICAL" | "GROWTH" | "LIGHT";
  estimatedMins: number;
  deadline: string | null;
  completed: boolean;
  pillar: { id: string; name: string; emoji: string; color: string };
};

type Pillar = { id: string; name: string; emoji: string; color: string };

const PRIORITY_LABELS = { CRITICAL: "🔴 Critical", GROWTH: "🟡 Growth", LIGHT: "🟢 Light" };
const PRIORITY_ORDER = { CRITICAL: 0, GROWTH: 1, LIGHT: 2 };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("active");

  // Form state
  const [title, setTitle] = useState("");
  const [pillarId, setPillarId] = useState("");
  const [priority, setPriority] = useState<"CRITICAL" | "GROWTH" | "LIGHT">("GROWTH");
  const [estimatedMins, setEstimatedMins] = useState(30);
  const [deadline, setDeadline] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [tasksRes, pillarsRes] = await Promise.all([
      fetch("/api/tasks"),
      fetch("/api/pillars"),
    ]);
    const [tasksData, pillarsData] = await Promise.all([tasksRes.json(), pillarsRes.json()]);
    setTasks(tasksData);
    setPillars(pillarsData);
    if (pillarsData.length > 0 && !pillarId) setPillarId(pillarsData[0].id);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !pillarId) return;
    setAdding(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, pillarId, priority, estimatedMins, deadline: deadline || null }),
    });
    const task = await res.json();
    setTasks((prev) => [task, ...prev]);
    setTitle("");
    setDeadline("");
    setPriority("GROWTH");
    setEstimatedMins(30);
    setShowAdd(false);
    setAdding(false);
  }

  async function toggleTask(id: string, completed: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  const filtered = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "done") return t.completed;
      return true;
    })
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">{tasks.filter(t => !t.completed).length} active · {tasks.filter(t => t.completed).length} done</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 hover:shadow-glow transition-all"
        >
          <Plus size={16} /> Add Task
        </button>
      </motion.div>

      {/* Add task form */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={addTask}
            className="card p-6 space-y-4 overflow-hidden"
          >
            <h3 className="font-semibold text-gray-700 text-sm">New Task</h3>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-coral-400 transition-colors"
              required
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pillar</label>
                <select
                  value={pillarId}
                  onChange={(e) => setPillarId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-gray-700 focus:outline-none focus:border-coral-400"
                >
                  {pillars.map((p) => (
                    <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-gray-700 focus:outline-none focus:border-coral-400"
                >
                  <option value="CRITICAL">🔴 Critical</option>
                  <option value="GROWTH">🟡 Growth</option>
                  <option value="LIGHT">🟢 Light</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Est. time (min)</label>
                <input
                  type="number"
                  value={estimatedMins}
                  onChange={(e) => setEstimatedMins(parseInt(e.target.value) || 30)}
                  min={5}
                  max={480}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-gray-700 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Deadline (optional)</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-gray-700 focus:outline-none focus:border-coral-400"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={adding}
                className="px-6 py-2.5 rounded-xl bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 transition-colors disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Task"}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-6 py-2.5 rounded-xl bg-cream-100 text-gray-500 text-sm font-medium hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-cream-200 rounded-2xl w-fit">
        {(["active", "done", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-xl text-sm font-medium transition-all capitalize",
              filter === f ? "bg-white text-gray-800 shadow-soft" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {f === "active" ? `Active (${tasks.filter(t => !t.completed).length})` : f === "done" ? `Done (${tasks.filter(t => t.completed).length})` : "All"}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-gray-500">No tasks here yet.</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-coral-500 text-sm hover:text-coral-600 font-medium">
            + Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map((task) => {
              const colors = getPillarColor(task.pillar.color);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("card p-4 flex items-start gap-3 card-hover group", task.completed && "opacity-55")}
                >
                  <button
                    onClick={() => toggleTask(task.id, !task.completed)}
                    className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {task.completed
                      ? <CheckCircle2 size={20} className="text-coral-500" />
                      : <Circle size={20} className="text-gray-300 group-hover:text-coral-300 transition-colors" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium text-gray-800", task.completed && "line-through text-gray-400")}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={cn("pill border text-[10px] px-2 py-0.5", colors.bg, colors.text, colors.border)}>
                        {task.pillar.emoji} {task.pillar.name}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {task.estimatedMins}m
                      </span>
                      {task.deadline && (
                        <span className={cn(
                          "text-xs flex items-center gap-1",
                          new Date(task.deadline) < new Date() ? "text-red-400" : "text-gray-400"
                        )}>
                          <Calendar size={10} /> {formatRelativeTime(task.deadline)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{PRIORITY_LABELS[task.priority]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
