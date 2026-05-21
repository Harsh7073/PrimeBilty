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

    const template = await prisma.printTemplate.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json({ error: "Print template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template detail:", error);
    return NextResponse.json({ error: "Failed to fetch template detail" }, { status: 500 });
  }
}

export async function PUT(
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
    const { designName, jsonLayout, designNo } = body;

    const existing = await prisma.printTemplate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Print template not found" }, { status: 404 });
    }

    const updated = await prisma.printTemplate.update({
      where: { id },
      data: {
        designName: designName ?? existing.designName,
        designNo: designNo ?? existing.designNo,
        jsonLayout: jsonLayout ?? existing.jsonLayout,
      }
    });

    return NextResponse.json({ template: updated });
  } catch (error) {
    console.error("Error updating print template:", error);
    return NextResponse.json({ error: "Failed to update print template" }, { status: 500 });
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

    const existing = await prisma.printTemplate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Print template not found" }, { status: 404 });
    }

    await prisma.printTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting print template:", error);
    return NextResponse.json({ error: "Failed to delete print template" }, { status: 500 });
  }
}
