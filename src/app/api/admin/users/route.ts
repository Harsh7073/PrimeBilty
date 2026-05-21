import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken, hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const users = await prisma.user.findMany({
    where: { companyId: payload.companyId },
    include: { role: true, branch: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users: users.map(u => ({ ...u, password: undefined, otp: undefined })), total: users.length });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const body = await req.json();
  const { name, email, phone, password, roleId } = body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const hashed = await hashPassword(password || "changeme123");
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashed, roleId, companyId: payload.companyId },
    include: { role: true },
  });

  return NextResponse.json({ user: { ...user, password: undefined } }, { status: 201 });
}
