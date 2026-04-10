import { Task, Priority } from "@prisma/client";

type TaskWithPillar = Task & { pillar: { name: string; emoji: string; color: string } };

const PRIORITY_SCORE: Record<Priority, number> = {
  CRITICAL: 100,
  GROWTH: 50,
  LIGHT: 10,
};

export function calculateTaskScore(task: TaskWithPillar, now: Date = new Date()): number {
  let score = PRIORITY_SCORE[task.priority];

  // Deadline urgency: tasks due within 24h get +80, within 3 days +40, within 7 days +20
  if (task.deadline) {
    const hoursUntilDeadline = (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDeadline < 0) score += 150; // overdue!
    else if (hoursUntilDeadline < 24) score += 80;
    else if (hoursUntilDeadline < 72) score += 40;
    else if (hoursUntilDeadline < 168) score += 20;
  }

  // Staleness: tasks not touched in a long time get a boost
  const daysSinceCreated = (now.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated > 7) score += 30;
  else if (daysSinceCreated > 3) score += 15;

  return score;
}

export function selectTopThreeTasks(tasks: TaskWithPillar[]): TaskWithPillar[] {
  const incomplete = tasks.filter((t) => !t.completed);
  const now = new Date();

  const scored = incomplete.map((task) => ({
    task,
    score: calculateTaskScore(task, now),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Deduplicate pillars if possible (show variety)
  const seen = new Set<string>();
  const result: TaskWithPillar[] = [];
  const overflow: TaskWithPillar[] = [];

  for (const { task } of scored) {
    if (!seen.has(task.pillarId) && result.length < 3) {
      result.push(task);
      seen.add(task.pillarId);
    } else {
      overflow.push(task);
    }
  }

  // Fill up to 3 if we have less due to pillar diversity
  for (const task of overflow) {
    if (result.length >= 3) break;
    result.push(task);
  }

  return result.slice(0, 3);
}

export function getCalmingMessage(feeling: string): { message: string; action: string } {
  const lower = feeling.toLowerCase();
  
  if (lower.includes("overwhelm") || lower.includes("too much") || lower.includes("stress")) {
    return {
      message: "You don't have to do everything. You just have to do one thing.",
      action: "Pick the smallest task below and start for just 10 minutes. That's it.",
    };
  }
  if (lower.includes("lost") || lower.includes("confused") || lower.includes("don't know")) {
    return {
      message: "Clarity comes from action, not from waiting. Movement creates direction.",
      action: "Take one breath, then open the first task. Just read it. Nothing more.",
    };
  }
  if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("fatigue")) {
    return {
      message: "Rest is not laziness. But a tiny step forward still counts as momentum.",
      action: "Do just 10 minutes on your lightest task. Then rest guilt-free.",
    };
  }
  if (lower.includes("anxious") || lower.includes("worried") || lower.includes("scared")) {
    return {
      message: "Anxiety shrinks when you move toward the thing that scares you.",
      action: "Write down one concrete next step. Then do only that step.",
    };
  }
  if (lower.includes("procrastinat") || lower.includes("avoid") || lower.includes("lazy")) {
    return {
      message: "You don't need motivation. You need a two-minute start.",
      action: "Set a timer for 10 minutes. Begin. You'll likely keep going.",
    };
  }

  return {
    message: "Every moment is a chance to begin again. Right now counts.",
    action: "Look at your top task. Start with just the first step. That's enough.",
  };
}

export function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const firstName = name?.split(" ")[0] || "friend";
  if (hour < 12) return `Good morning, ${firstName}`;
  if (hour < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
}

export const CALM_QUOTES = [
  "Progress, not perfection.",
  "One focused hour beats ten scattered ones.",
  "Your future self is watching. Make them proud.",
  "Small steps compound into enormous distances.",
  "Clarity is the antidote to overwhelm.",
  "Show up. That's already half the battle.",
  "Discipline is remembering what you want.",
  "You are always one decision away from a different life.",
  "Done is better than perfect. Start.",
  "Focus on the process. The results will follow.",
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return CALM_QUOTES[dayOfYear % CALM_QUOTES.length];
}
