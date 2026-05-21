const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@truckbilty.com' } });
  if (user) {
    console.log("User exists. Resetting password to demo123456...");
    const hashedPassword = await bcrypt.hash("demo123456", 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, isActive: true }
    });
    console.log("Password reset successfully.");
  } else {
    console.log("User does not exist. Creating admin@truckbilty.com with password demo123456...");
    
    // Check if role exists
    let role = await prisma.role.findFirst({ where: { name: "ADMIN" } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: "ADMIN", description: "System Administrator", isSystem: true }
      });
    }

    // Check if company exists
    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: { name: "TruckBilty Corp" }
      });
    }

    const hashedPassword = await bcrypt.hash("demo123456", 10);
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@truckbilty.com",
        password: hashedPassword,
        roleId: role.id,
        companyId: company.id,
        isActive: true
      }
    });
    console.log("User created successfully.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
