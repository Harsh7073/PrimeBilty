import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const vehicle = await prisma.vehicle.findFirst({
    where: { id, companyId: payload.companyId },
    include: { type: true, driverAssignments: { include: { driver: true }, where: { unassignedAt: null } } },
  });

  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ vehicle });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const body = await req.json();
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      ...body,
      year: body.year ? Number(body.year) : undefined,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      rcExpiry: body.rcExpiry ? new Date(body.rcExpiry) : undefined,
      insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : undefined,
      fitnessExpiry: body.fitnessExpiry ? new Date(body.fitnessExpiry) : undefined,
    },
    include: { type: true },
  });
  return NextResponse.json({ vehicle });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  await prisma.vehicle.update({ where: { id }, data: { status: "INACTIVE" } });
  return NextResponse.json({ message: "Vehicle deactivated" });
}
