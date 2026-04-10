import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const pillarId = searchParams.get("pillarId");
  const completed = searchParams.get("completed");

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(pillarId ? { pillarId } : {}),
      ...(completed !== null ? { completed: completed === "true" } : {}),
    },
    include: { pillar: true },
    orderBy: [{ priority: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { title, pillarId, priority, estimatedMins, deadline } = await req.json();

  if (!title || !pillarId) {
    return NextResponse.json({ error: "Title and pillar required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      pillarId,
      userId,
      priority: priority || "GROWTH",
      estimatedMins: estimatedMins || 30,
      deadline: deadline ? new Date(deadline) : null,
    },
    include: { pillar: true },
  });

  return NextResponse.json(task, { status: 201 });
}
