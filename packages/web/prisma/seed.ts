import { Priority } from "@/generated/prisma/enums";
import { Status } from "@/types";
import { prisma } from "@/lib/prisma";

async function main() {
  // Clear existing data so the seed stays idempotent
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.label.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@devboard.dev",
      name: "Demo User",
      emailVerified: new Date(),
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      email: "contributor@devboard.dev",
      name: "Contributor",
      emailVerified: new Date(),
    },
  });

  const labelsData = [
    { name: "bug", color: "#EF4444" },
    { name: "feature", color: "#10B981" },
    { name: "documentation", color: "#3B82F6" },
    { name: "enhancement", color: "#8B5CF6" },
    { name: "help wanted", color: "#F59E0B" },
    { name: "urgent", color: "#DC2626" },
  ];

  await prisma.label.createMany({ data: labelsData, skipDuplicates: true });
  const labels = await prisma.label.findMany();
  const labelByName = Object.fromEntries(
    labels.map((label) => [label.name, label]),
  );

  const tasksData = [
    {
      title: "Set up project repository",
      description: "Initialize the monorepo structure with npm workspaces",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(),
      userId: demoUser.id,
      labelNames: ["feature"],
    },
    {
      title: "Design database schema",
      description: "Create Prisma schema for tasks and labels",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      userId: demoUser.id,
      labelNames: ["feature", "documentation"],
    },
    {
      title: "Implement task CRUD operations",
      description:
        "Build API routes for creating, reading, updating, and deleting tasks",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      userId: demoUser.id,
      labelNames: ["feature"],
    },
    {
      title: "Add keyboard shortcuts",
      description: "Implement vim-style navigation and quick actions",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      userId: demoUser.id,
      labelNames: ["enhancement"],
    },
    {
      title: "Fix label color picker",
      description: "The color picker dropdown closes unexpectedly on mobile",
      status: "TODO",
      priority: "LOW",
      dueDate: null,
      userId: demoUser.id,
      labelNames: ["bug"],
    },
    {
      title: "Improve onboarding docs",
      description: "Document setup steps and architecture decisions",
      status: "IN_REVIEW",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      userId: otherUser.id,
      labelNames: ["documentation", "help wanted"],
    },
    {
      title: "Stabilize auth callbacks",
      description: "Harden NextAuth configuration and error handling",
      status: "IN_PROGRESS",
      priority: "URGENT",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
      userId: otherUser.id,
      labelNames: ["bug", "urgent"],
    },
  ];

  for (const task of tasksData) {
    const connectLabels = task.labelNames
      .map((name) => labelByName[name])
      .filter(Boolean)
      .map((label) => ({ id: label.id }));

    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status as Status,
        priority: task.priority as Priority,
        dueDate: task.dueDate,
        userId: task.userId,
        labels: { connect: connectLabels },
      },
    });
  }

  console.log(
    `Seeded ${tasksData.length} tasks across ${labels.length} labels for ${
      [demoUser, otherUser].length
    } users.`,
  );
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
