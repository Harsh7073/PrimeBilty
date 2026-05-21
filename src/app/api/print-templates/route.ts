import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const templates = await prisma.printTemplate.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Failed to fetch print templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { designNo, designName, jsonLayout } = body;

    if (!designNo || !designName) {
      return NextResponse.json({ error: "designNo and designName are required" }, { status: 400 });
    }

    const existing = await prisma.printTemplate.findUnique({ where: { designNo } });
    if (existing) {
      return NextResponse.json({ error: `Design number ${designNo} already exists` }, { status: 400 });
    }

    const template = await prisma.printTemplate.create({
      data: {
        designNo,
        designName,
        jsonLayout: jsonLayout || "[]",
      }
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating print template:", error);
    return NextResponse.json({ error: "Failed to create print template" }, { status: 500 });
  }
}
