import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    const cities = await prisma.city.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      include: {
        state: true,
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ cities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search cities" }, { status: 500 });
  }
}
