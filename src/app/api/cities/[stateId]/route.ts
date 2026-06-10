import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stateId: string }> }
) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { stateId } = await params;
    const parsedStateId = parseInt(stateId);
    if (isNaN(parsedStateId)) {
      return NextResponse.json({ error: "Invalid state ID" }, { status: 400 });
    }

    const cities = await prisma.city.findMany({
      where: { stateId: parsedStateId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ cities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
