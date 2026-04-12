import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const hashedPassword = await bcrypt.hash("defaultpassword", 10);
  const defaultUser = await prisma.user.upsert({
    where: { email: "default@example.com" },
    update: {},
    create: {
      email: "default@example.com",
      password: hashedPassword,
    },
  });

  // Update existing transactions to use default user
  await prisma.transaction.updateMany({
    where: { userId: "default-user" },
    data: { userId: defaultUser.id },
  });

  console.log("Migration completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
