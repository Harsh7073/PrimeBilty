import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import { generateLRNumber } from "@/lib/utils";
import { z } from "zod";

const biltySchema = z.object({
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  via: z.string().optional(),
  vehicleId: z.string(),
  driverId: z.string().optional(),
  consignorId: z.string(),
  consigneeId: z.string(),
  billingPartyId: z.string(),
  goodsDescription: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  freightAmount: z.number().default(0),
  advanceAmount: z.number().default(0),
  loadingCharges: z.number().default(0),
  unloadingCharges: z.number().default(0),
  otherCharges: z.number().default(0),
  gstRate: z.number().default(0),
  paymentType: z.enum(["TO-PAY", "PAID", "TBB"]).default("TO-PAY"),
  eWayBillNumber: z.string().optional(),
  notes: z.string().optional(),
  branchId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    const where: any = { companyId: payload.companyId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { lrNumber: { contains: search, mode: "insensitive" } },
        { fromCity: { contains: search, mode: "insensitive" } },
        { toCity: { contains: search, mode: "insensitive" } },
        { vehicle: { vehicleNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [bilties, total] = await Promise.all([
      prisma.bilty.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          vehicle: { select: { vehicleNumber: true, id: true } },
          driver: { select: { name: true, phone: true } },
          consignor: { select: { name: true, city: true } },
          consignee: { select: { name: true, city: true } },
          billingParty: { select: { name: true } },
        },
      }),
      prisma.bilty.count({ where }),
    ]);

    return NextResponse.json({
      bilties,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bilties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const data = biltySchema.parse(body);

    const gstAmount = (data.freightAmount * data.gstRate) / 100;
    const totalFreight = data.freightAmount + data.loadingCharges + data.unloadingCharges + data.otherCharges + gstAmount;
    const balanceAmount = totalFreight - data.advanceAmount;

    const bilty = await prisma.bilty.create({
      data: {
        lrNumber: generateLRNumber(),
        ...data,
        gstAmount,
        totalAmount: totalFreight,
        balanceAmount,
        companyId: payload.companyId!,
        createdById: payload.userId,
      },
      include: {
        vehicle: true,
        consignor: true,
        consignee: true,
        billingParty: true,
        driver: true,
      },
    });

    await prisma.activityLog.create({
      data: { userId: payload.userId, description: `Created Bilty ${bilty.lrNumber}`, module: "BILTY" },
    });

    return NextResponse.json({ bilty }, { status: 201 });
  } catch (error) {
    console.error("Create bilty error:", error);
    return NextResponse.json({ error: "Failed to create bilty" }, { status: 500 });
  }
}
