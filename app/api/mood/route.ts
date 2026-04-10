import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { mood, energy } = await req.json();

  const entry = await prisma.moodEntry.create({
    data: { userId, mood, energy },
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latest = await prisma.moodEntry.findFirst({
    where: { userId, date: { gte: today } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(latest);
}
