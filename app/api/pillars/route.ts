import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const pillars = await prisma.pillar.findMany({
    where: { userId },
    include: {
      tasks: true,
    },
    orderBy: { name: "asc" },
  });

  const enriched = pillars.map((p) => {
    const total = p.tasks.length;
    const completed = p.tasks.filter((t) => t.completed).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate weekly completed tasks
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyCompleted = p.tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt > weekAgo
    ).length;

    return {
      ...p,
      tasks: undefined,
      totalTasks: total,
      completedTasks: completed,
      progress,
      weeklyCompleted,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { name, emoji, color, weeklyGoal } = await req.json();

  const pillar = await prisma.pillar.create({
    data: { name, emoji, color, weeklyGoal: weeklyGoal || 5, userId },
  });

  return NextResponse.json(pillar, { status: 201 });
}
