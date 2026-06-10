import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/auth";
import { z } from "zod";

const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1),
  ownerType: z.enum(["Own", "Market"]).default("Own"),
  vehicleTypeId: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  capacity: z.number().optional(),
  capacityUnit: z.string().optional(),
  rcNumber: z.string().optional(),
  rcExpiry: z.string().optional(),
  insuranceNumber: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  fitnessExpiry: z.string().optional(),
  gpsEnabled: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { companyId: payload.companyId };
    if (status) where.status = status;
    if (search) where.vehicleNumber = { contains: search, mode: "insensitive" };

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          type: true,
          driverAssignments: {
            where: { unassignedAt: null },
            include: { driver: { select: { name: true, phone: true } } },
            take: 1,
          },
        },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return NextResponse.json({ vehicles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const data = vehicleSchema.parse(body);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        rcExpiry: (data.rcExpiry && data.rcExpiry.trim() !== "") ? new Date(data.rcExpiry) : null,
        insuranceExpiry: (data.insuranceExpiry && data.insuranceExpiry.trim() !== "") ? new Date(data.insuranceExpiry) : null,
        fitnessExpiry: (data.fitnessExpiry && data.fitnessExpiry.trim() !== "") ? new Date(data.fitnessExpiry) : null,
        companyId: payload.companyId!,
      },
      include: { type: true },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
