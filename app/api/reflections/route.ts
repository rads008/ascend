import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { win, difficulty, mood, tasksCompleted } = await req.json();

  const reflection = await prisma.reflection.create({
    data: { userId, win, difficulty, mood, tasksCompleted: tasksCompleted || 0 },
  });

  return NextResponse.json(reflection, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const reflections = await prisma.reflection.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 30,
  });

  return NextResponse.json(reflections);
}
