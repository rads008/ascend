import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { completed, title, priority, estimatedMins, deadline, pillarId } = body;

  const task = await prisma.task.findFirst({ where: { id: params.id, userId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(completed !== undefined && {
        completed,
        completedAt: completed ? new Date() : null,
      }),
      ...(title && { title }),
      ...(priority && { priority }),
      ...(estimatedMins && { estimatedMins }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(pillarId && { pillarId }),
    },
    include: { pillar: true },
  });

  // Update streak if completing a task
  if (completed) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.streak.upsert({
      where: { userId_date: { userId, date: today } },
      update: { tasksCompleted: { increment: 1 } },
      create: { userId, date: today, tasksCompleted: 1 },
    });

    // Update pillar last activity
    await prisma.pillar.update({
      where: { id: task.pillarId },
      data: { lastActivity: new Date() },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const task = await prisma.task.findFirst({ where: { id: params.id, userId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
