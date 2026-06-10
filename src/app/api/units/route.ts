import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    let units = await prisma.unit.findMany({ 
      where: { isActive: true }, 
      orderBy: { name: "asc" } 
    });

    // Seed default units if DB is empty
    if (units.length === 0) {
      const defaults = [
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
      
      for (const d of defaults) {
        await prisma.unit.create({
          data: { name: d.name, symbol: d.symbol }
        });
      }
      
      units = await prisma.unit.findMany({ 
        where: { isActive: true }, 
        orderBy: { name: "asc" } 
      });
    }

    // Map symbol to description for UI columns compatibility
    const mappedUnits = units.map(u => ({
      ...u,
      description: u.symbol || ""
    }));

    return NextResponse.json({ units: mappedUnits });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const { name, symbol } = await req.json();
    const unit = await prisma.unit.create({ 
      data: { name, symbol } 
    });
    return NextResponse.json({ 
      unit: {
        ...unit,
        description: unit.symbol || ""
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
