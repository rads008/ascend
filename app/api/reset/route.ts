import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { selectTopThreeTasks, getCalmingMessage } from "@/lib/engine";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { feeling } = await req.json();

  const tasks = await prisma.task.findMany({
    where: { userId, completed: false },
    include: { pillar: true },
  });

  const top3 = selectTopThreeTasks(tasks as any);
  const { message, action } = getCalmingMessage(feeling || "lost");

  return NextResponse.json({ tasks: top3, message, action });
}
