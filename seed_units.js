const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const unitsToSeed = [
  { symbol: "MTS", name: "METRIC TON (MTS)" },
  { symbol: "KGS", name: "KILOGRAMS (KGS)" },
  { symbol: "QTL", name: "QUINTAL" },
  { symbol: "TON", name: "TONNES" },
  { symbol: "LTR", name: "LITRES" },
  { symbol: "UNT", name: "UNITS" },
  { symbol: "PAC", name: "PACKS" },
  { symbol: "GMS", name: "GRAMMES" },
  { symbol: "CBM", name: "CUBIC METERS" },
  { symbol: "CCM", name: "CUBIC CENTIMETERS" },
  { symbol: "KLR", name: "KILOLITRE" },
  { symbol: "MLT", name: "MILILITRE" },
  { symbol: "UGS", name: "US GALLONS" },
  { symbol: "CMS", name: "CENTI METERS" },
  { symbol: "KME", name: "KILOMETRE" },
  { symbol: "MTR", name: "METERS" },
  { symbol: "YDS", name: "YARDS" },
  { symbol: "SQF", name: "SQUARE FEET" },
  { symbol: "SQM", name: "SQUARE METERS" },
  { symbol: "SQY", name: "SQUARE YARDS" },
  { symbol: "GYD", name: "GROSS YARDS" },
  { symbol: "BOU", name: "BILLION OF UNITS" },
  { symbol: "DOZ", name: "DOZENS" },
  { symbol: "GGK", name: "GREAT GROSS" },
  { symbol: "GRS", name: "GROSS" },
  { symbol: "NOS", name: "NUMBERS" },
  { symbol: "PCS", name: "PIECES" },
  { symbol: "TGM", name: "TEN GROSS" },
  { symbol: "THD", name: "THOUSANDS" },
  { symbol: "BAG", name: "BAGS" },
  { symbol: "BAL", name: "BALE" },
  { symbol: "BTL", name: "BOTTLES" },
  { symbol: "BOX", name: "BOX" },
  { symbol: "BKL", name: "BUCKLES" },
  { symbol: "CAN", name: "CANS" },
  { symbol: "CTN", name: "CARTONS" },
  { symbol: "DRM", name: "DRUMS" },
  { symbol: "TBS", name: "TABLETS" },
  { symbol: "TUB", name: "TUBES" },
  { symbol: "BDL", name: "BUNDLES" },
  { symbol: "BUN", name: "BUNCHES" },
  { symbol: "PRS", name: "PAIRS" },
  { symbol: "ROL", name: "ROLLS" },
  { symbol: "SET", name: "SETS" },
  { symbol: "MT", name: "METRIC TON" },
  { symbol: "KG", name: "KILOGRAMS" },
  { symbol: "OTH", name: "OTHERS" },
  { symbol: "VEH", name: "VEHICLE" },
  { symbol: "FIX", name: "FIX" }
];

async function main() {
  console.log("Clearing existing measurement units...");
  const deleteCount = await prisma.unit.deleteMany({});
  console.log(`Cleared ${deleteCount.count} existing units.`);

  console.log("Seeding new units...");
  for (const u of unitsToSeed) {
    await prisma.unit.create({
      data: {
        name: u.name,
        symbol: u.symbol,
        isActive: true
      }
    });
  }
  console.log(`Successfully seeded ${unitsToSeed.length} units.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
