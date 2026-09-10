import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      { name: "Admin User", email: "admin@clientops.dev", passwordHash: password, role: Role.ADMIN },
      { name: "Manager User", email: "manager@clientops.dev", passwordHash: password, role: Role.MANAGER },
      { name: "Viewer User", email: "viewer@clientops.dev", passwordHash: password, role: Role.VIEWER },
    ],
  });

  console.log("Seeded 3 users.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });