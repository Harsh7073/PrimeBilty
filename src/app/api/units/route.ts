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
        { name: "Tons", symbol: "MT" },
        { name: "Kilograms", symbol: "KG" },
        { name: "Boxes", symbol: "BOX" },
        { name: "Litres", symbol: "LTR" },
        { name: "Trips", symbol: "TRIP" },
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
