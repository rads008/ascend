import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const identities = await prisma.identity.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(identities);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { title, description, linkedPillars } = await req.json();

  const identity = await prisma.identity.create({
    data: { userId, title, description, linkedPillars: linkedPillars || [] },
  });

  return NextResponse.json(identity, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { id, actedToday } = await req.json();

  const identity = await prisma.identity.findFirst({ where: { id, userId } });
  if (!identity) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Recalculate consistency score (running average)
  const newScore = identity.consistencyScore * 0.9 + (actedToday ? 10 : 0);

  const updated = await prisma.identity.update({
    where: { id },
    data: { actedToday, consistencyScore: Math.min(newScore, 100) },
  });

  return NextResponse.json(updated);
}
