import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: true, company: true, branch: true, printTemplate: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { password, otp, otpExpiry, ...safeUser } = user as any;

  return NextResponse.json({ user: safeUser });
}
