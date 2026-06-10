import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const states = await prisma.state.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ states });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 });
  }
}
