import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { selectTopThreeTasks } from "@/lib/engine";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const tasks = await prisma.task.findMany({
    where: { userId, completed: false },
    include: { pillar: true },
  });

  const top3 = selectTopThreeTasks(tasks as any);
  return NextResponse.json(top3);
}
