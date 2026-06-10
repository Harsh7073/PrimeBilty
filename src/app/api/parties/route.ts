import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import { z } from "zod";

const partySchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  creditLimit: z.number().default(0),
  creditPeriod: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = { companyId: payload.companyId, isActive: true };
    if (type) where.type = { contains: type };
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { gstin: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];

    const [parties, total] = await Promise.all([
      prisma.party.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.party.count({ where }),
    ]);

    return NextResponse.json({ parties, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const data = partySchema.parse(body);

    const party = await prisma.party.create({
      data: { ...data, email: data.email || null, companyId: payload.companyId! },
    });

    return NextResponse.json({ party }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create party" }, { status: 500 });
  }
}
