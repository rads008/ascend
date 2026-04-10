import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 7) return `${diffDays}d left`;
  return `${Math.floor(diffDays / 7)}w left`;
}

export function getPillarColor(color: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    coral: { bg: "bg-coral-100", text: "text-coral-600", border: "border-coral-200" },
    gold: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    sage: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    blue: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
    purple: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  };
  return map[color] || map["coral"];
}

export const DEFAULT_PILLARS = [
  { name: "Coding / Projects", emoji: "💻", color: "coral" },
  { name: "GATE Preparation", emoji: "📐", color: "gold" },
  { name: "MS Germany Prep", emoji: "🎓", color: "sage" },
  { name: "Research / Papers", emoji: "📄", color: "blue" },
  { name: "Job Applications", emoji: "💼", color: "purple" },
  { name: "Mental Health / Life", emoji: "🌿", color: "pink" },
];
