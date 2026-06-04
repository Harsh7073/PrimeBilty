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
  const updateData: any = {
    ...body,
  };
  if (body.year !== undefined) updateData.year = body.year ? Number(body.year) : null;
  if (body.capacity !== undefined) updateData.capacity = body.capacity ? Number(body.capacity) : null;
  if (body.rcExpiry !== undefined) updateData.rcExpiry = (body.rcExpiry && body.rcExpiry.trim() !== "") ? new Date(body.rcExpiry) : null;
  if (body.insuranceExpiry !== undefined) updateData.insuranceExpiry = (body.insuranceExpiry && body.insuranceExpiry.trim() !== "") ? new Date(body.insuranceExpiry) : null;
  if (body.fitnessExpiry !== undefined) updateData.fitnessExpiry = (body.fitnessExpiry && body.fitnessExpiry.trim() !== "") ? new Date(body.fitnessExpiry) : null;
  if (body.permitExpiry !== undefined) updateData.permitExpiry = (body.permitExpiry && body.permitExpiry.trim() !== "") ? new Date(body.permitExpiry) : null;

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: updateData,
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
