import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Two Default Super User in Database
  const alice = await prisma.user.upsert({
    where: { email: "hradmin@test.com" }, // Admin
    update: {},
    create: {
      email: "hradmin@test.com",
      name: "Super Admin",
      password: "TestPass1234",
      role: "admin",
    },
  });
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
