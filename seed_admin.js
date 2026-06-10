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

  // Clear existing vehicles and types to avoid foreign key constraint errors
  console.log("Clearing existing vehicles...");
  await prisma.vehicle.deleteMany({});

  console.log("Clearing existing vehicle types...");
  await prisma.vehicleType.deleteMany({});

  // Seed default vehicle types
  const defaultTypes = [
    { name: "Full Body Trailer", description: "Full Body Trailer" },
    { name: "Half Body Trailer", description: "Half Body Trailer" },
    { name: "Container Body Truck", description: "Container Body Truck" },
    { name: "Flat Body Truck - Open", description: "Flat Body Truck - Open" },
    { name: "Full Body Truck - Open <> Close", description: "Full Body Truck - Open <> Close" },
    { name: "Half Body Truck - Open", description: "Half Body Truck - Open" },
    { name: "Small Truck - Eicher Type", description: "Small Truck - Eicher Type" },
    { name: "Pickup Truck - Bolero Type", description: "Pickup Truck - Bolero Type" },
    { name: "Mini Truck - Tempo", description: "Mini Truck - Tempo" },
    { name: "Any Truck Type", description: "Any Truck Type" }
  ];

  // Migrate any existing BILLING type parties to CUSTOMER
  console.log("Migrating any existing BILLING parties to CUSTOMER...");
  await prisma.party.updateMany({
    where: { type: "BILLING" },
    data: { type: "CUSTOMER" }
  });

  console.log("Seeding default vehicle types...");
  for (const t of defaultTypes) {
    await prisma.vehicleType.create({ data: t });
    console.log(`Created vehicle type: ${t.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
