import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const hashed = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@ascend.app" },
    update: {},
    create: {
      name: "Radhika",
      email: "demo@ascend.app",
      password: hashed,
      pillars: {
        create: [
          { name: "Coding / Projects", emoji: "💻", color: "coral", weeklyGoal: 7 },
          { name: "GATE Preparation", emoji: "📐", color: "gold", weeklyGoal: 10 },
          { name: "MS Germany Prep", emoji: "🎓", color: "sage", weeklyGoal: 5 },
          { name: "Research / Papers", emoji: "📄", color: "blue", weeklyGoal: 3 },
          { name: "Job Applications", emoji: "💼", color: "purple", weeklyGoal: 5 },
          { name: "Mental Health / Life", emoji: "🌿", color: "pink", weeklyGoal: 7 },
        ],
      },
      identities: {
        create: [
          {
            title: "Future Software Engineer",
            description: "Someone who writes clean code daily and learns consistently",
            linkedPillars: [],
            consistencyScore: 60,
          },
          {
            title: "GATE Topper",
            description: "Disciplined, focused, solving problems every day without fail",
            linkedPillars: [],
            consistencyScore: 45,
          },
          {
            title: "Disciplined Me",
            description: "Shows up even when it's hard. Keeps promises to myself.",
            linkedPillars: [],
            consistencyScore: 70,
          },
        ],
      },
    },
    include: { pillars: true },
  });

  // Add sample tasks
  const pillars = user.pillars;
  const findPillar = (name: string) => pillars.find((p) => p.name === name)!;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 6);

  await prisma.task.createMany({
    data: [
      {
        title: "Complete DSA problem set – Arrays",
        pillarId: findPillar("Coding / Projects").id,
        userId: user.id,
        priority: "CRITICAL",
        estimatedMins: 90,
        deadline: tomorrow,
      },
      {
        title: "Solve 10 GATE PYQs – Engineering Maths",
        pillarId: findPillar("GATE Preparation").id,
        userId: user.id,
        priority: "CRITICAL",
        estimatedMins: 60,
        deadline: tomorrow,
      },
      {
        title: "Draft SOP introduction paragraph",
        pillarId: findPillar("MS Germany Prep").id,
        userId: user.id,
        priority: "GROWTH",
        estimatedMins: 45,
        deadline: nextWeek,
      },
      {
        title: "Read one research paper on ML",
        pillarId: findPillar("Research / Papers").id,
        userId: user.id,
        priority: "GROWTH",
        estimatedMins: 60,
      },
      {
        title: "Update LinkedIn and resume",
        pillarId: findPillar("Job Applications").id,
        userId: user.id,
        priority: "GROWTH",
        estimatedMins: 30,
      },
      {
        title: "20-minute walk + no-phone time",
        pillarId: findPillar("Mental Health / Life").id,
        userId: user.id,
        priority: "LIGHT",
        estimatedMins: 25,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed complete. Demo login: demo@ascend.app / demo1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
