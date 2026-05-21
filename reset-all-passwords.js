const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "demo123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  const users = await prisma.user.findMany();

  console.log(`Resetting passwords for all ${users.length} users to "${defaultPassword}"...`);

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Reset password for: ${user.name} (${user.email})`);
  }

  console.log("Password reset completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
