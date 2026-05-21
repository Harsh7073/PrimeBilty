import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const bilty = await prisma.bilty.findFirst({
      where: { id, companyId: payload.companyId },
      include: {
        vehicle: { include: { type: true } },
        driver: true,
        consignor: true,
        consignee: true,
        billingParty: true,
        branch: true,
        createdBy: { select: { name: true, email: true } },
        invoiceItems: { include: { invoice: true } },
      },
    });

    if (!bilty) return NextResponse.json({ error: "Bilty not found" }, { status: 404 });
    return NextResponse.json({ bilty });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bilty" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { status, deliveredAt, podDoc, ...rest } = body;

    const bilty = await prisma.bilty.update({
      where: { id },
      data: { status, deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined, podDoc, ...rest, updatedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: { userId: payload.userId, description: `Updated Bilty ${bilty.lrNumber} status to ${status}`, module: "BILTY" },
    });

    return NextResponse.json({ bilty });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update bilty" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await prisma.bilty.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ message: "Bilty cancelled successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel bilty" }, { status: 500 });
  }
}
