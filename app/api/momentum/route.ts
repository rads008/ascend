import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const streaks = await prisma.streak.findMany({
    where: { userId, date: { gte: thirtyDaysAgo } },
    orderBy: { date: "desc" },
  });

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const found = streaks.find((s) => {
      const sDate = new Date(s.date);
      sDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === checkDate.getTime() && s.tasksCompleted > 0;
    });

    if (found) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  // Weekly stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const weeklyStreaks = streaks.filter((s) => new Date(s.date) >= weekAgo);
  const weeklyTotal = weeklyStreaks.reduce((sum, s) => sum + s.tasksCompleted, 0);
  const weeklyActiveDays = weeklyStreaks.filter((s) => s.tasksCompleted > 0).length;

  // Build chart data for last 14 days
  const chartData = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const found = streaks.find((s) => {
      const sDate = new Date(s.date);
      sDate.setHours(0, 0, 0, 0);
      return sDate.getTime() === d.getTime();
    });

    chartData.push({
      date: d.toISOString().split("T")[0],
      tasks: found?.tasksCompleted || 0,
    });
  }

  return NextResponse.json({
    currentStreak,
    weeklyTotal,
    weeklyActiveDays,
    chartData,
    streaks,
  });
}
