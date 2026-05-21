const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@truckbilty.com' } });
  console.log('User found:', !!user);
  if (user) {
    const valid = await bcrypt.compare('demo123456', user.password);
    console.log('Password valid:', valid);
    console.log('IsActive:', user.isActive);
  }
}

main().finally(() => prisma.$disconnect());
