import { prisma } from "@/lib/prisma";

async function main() {
  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@devboard.dev" },
    update: {},
    create: {
      email: "demo@devboard.dev",
      name: "Demo User",
      emailVerified: new Date(),
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create labels
  const labels = await Promise.all([
    prisma.label.upsert({
      where: { name: "bug" },
      update: {},
      create: { name: "bug", color: "#EF4444" },
    }),
    prisma.label.upsert({
      where: { name: "feature" },
      update: {},
      create: { name: "feature", color: "#10B981" },
    }),
    prisma.label.upsert({
      where: { name: "documentation" },
      update: {},
      create: { name: "documentation", color: "#3B82F6" },
    }),
    prisma.label.upsert({
      where: { name: "enhancement" },
      update: {},
      create: { name: "enhancement", color: "#8B5CF6" },
    }),
    prisma.label.upsert({
      where: { name: "help wanted" },
      update: {},
      create: { name: "help wanted", color: "#F59E0B" },
    }),
  ]);

  console.log(`Created ${labels.length} labels`);

  // Create sample tasks for demo user
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Set up project repository",
        description: "Initialize the monorepo structure with npm workspaces",
        status: "DONE",
        priority: "HIGH",
        userId: demoUser.id,
        labels: {
          connect: [{ name: "feature" }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: "Design database schema",
        description: "Create Prisma schema for tasks and labels",
        status: "DONE",
        priority: "HIGH",
        userId: demoUser.id,
        labels: {
          connect: [{ name: "feature" }, { name: "documentation" }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement task CRUD operations",
        description:
          "Build API routes for creating, reading, updating, and deleting tasks",
        status: "IN_PROGRESS",
        priority: "HIGH",
        userId: demoUser.id,
        labels: {
          connect: [{ name: "feature" }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: "Add keyboard shortcuts",
        description: "Implement vim-style navigation and quick actions",
        status: "TODO",
        priority: "MEDIUM",
        userId: demoUser.id,
        labels: {
          connect: [{ name: "enhancement" }],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: "Fix label color picker",
        description: "The color picker dropdown closes unexpectedly on mobile",
        status: "TODO",
        priority: "LOW",
        userId: demoUser.id,
        labels: {
          connect: [{ name: "bug" }],
        },
      },
    }),
  ]);

  console.log(`Created ${tasks.length} tasks for demo user`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
